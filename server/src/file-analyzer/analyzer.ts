import * as fs from 'fs';
import { DocumentUri, Position, TextDocument } from 'vscode-languageserver-textdocument';

import { filePathToFileURI, fileURIToFilePath, getFileExtension, getJavascriptFilePaths, getModelFilePaths } from '../util/fs';
import { ModelDetailLevel, ModelElementTypes } from '../model-definition/symbolsAndReferences';
import { time, timeEnd } from 'console';
import { getContextFromLine, wordAtPoint } from '../util/xml';
import { ModelParser } from './parser/modelParser';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import { JavascriptParser } from './parser/javascriptParser';
import { FileParser, IncrementalParser } from './parser/fileParser';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';
import { Connection, Diagnostic, DidChangeTextDocumentParams, Range, TextDocumentContentChangeEvent } from 'vscode-languageserver';
import { rangeIsInRange } from '../util/other';
import { ModelChecker } from '../model-checker/modelChecker';
import { IncrementalModelParser } from './parser/incrementalModelParser';

/**
 * The Analyzer uses an xml parser to find definitions, reference, etc. 
 */
export class Analyzer {
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private modelDefinitionManager: ModelDefinitionManager;
	private modelChecker: ModelChecker;

	// Object containing TextDocument for each uri. Only for open workspace documents
	private uriToTextDocument: { [uri: string]: TextDocument } = {};
	// Object containing incremental parsers per uri. Only for open workspace documents. 
	// The previous parser result is used in incremental parsing
	private uriToIncrementalParsers: { [uri: string]: IncrementalParser } = {};

	constructor(symbolAndReferenceManager: SymbolAndReferenceManager, modelDefinitionManager: ModelDefinitionManager, modelChecker: ModelChecker) {
		this.symbolAndReferenceManager = symbolAndReferenceManager;
		this.modelDefinitionManager = modelDefinitionManager;
		this.modelChecker = modelChecker;
	}

	/**
	 * Initialize the Analyzer based on a connection to the client and a root path.	 
	 */
	public static async fromRoot(
		connection: Connection,
		rootPath: string,
		symbolAndReferenceManager: SymbolAndReferenceManager,
		modelDefinitionManager: ModelDefinitionManager,
		modelChecker: ModelChecker,
		options?: { skipFolders: string[] })
		: Promise<Analyzer> {
		const analyzer = new Analyzer(symbolAndReferenceManager, modelDefinitionManager, modelChecker);

		if (rootPath) {
			connection.console.log(`Analyzing files inside ${rootPath}`);
			connection.console.log(`Skipping folders: ${options?.skipFolders}`);

			const lookupStartTime = Date.now();
			const getTimePassed = (): string => `${(Date.now() - lookupStartTime) / 1000} seconds`;

			const filePaths: string[] = await getModelFilePaths(rootPath, options);
			connection.console.log(`Glob resolved with ${filePaths.length} model files`);
			await analyzer.analyzeFiles(filePaths, connection, ModelDetailLevel.References);

			const javascriptFilePaths: string[] = await getJavascriptFilePaths(rootPath, options);
			connection.console.log(`Glob resolved with ${javascriptFilePaths.length} javascript files`);
			await analyzer.analyzeFiles(javascriptFilePaths, connection, ModelDetailLevel.References);

			connection.console.log(`Analyzer finished after ${getTimePassed()}`);
		}

		return analyzer;
	}

	private async analyzeFiles(filepaths: string[], connection: Connection, detailLevel: ModelDetailLevel) {
		const numberOfFiles = filepaths.length; let i = 1;
		for (const filePath of filepaths) {
			const uri = filePathToFileURI(filePath);
			connection.console.log(`Analyzing file (${i}/${numberOfFiles}): ${uri}`);

			try {
				await this.analyze(uri, detailLevel, false);
			} catch (error) {
				connection.console.warn(`Failed analyzing ${uri}. Error: ${(error as Error).message}`);
			}
			i++;
		}
		return { numberOfFiles, i };
	}

	public async updateDocument(change: DidChangeTextDocumentParams) {
		const uri = change.textDocument.uri;
		const document = this.uriToTextDocument[uri];
		const updatedDocument = TextDocument.update(document, change.contentChanges, change.textDocument.version);
		this.uriToTextDocument[uri] = updatedDocument;
		const parsingDiagnostics = await this.analyzeDocumentIncrementally(uri, change.contentChanges);
		const checkerDiagnostics = await this.validateTextDocument(uri);
		return [...parsingDiagnostics, ...checkerDiagnostics];
	}

	public async openDocument(document: TextDocument) {
		const uri = document.uri;
		this.uriToTextDocument[uri] = document;
		const parsingDiagnostics = await this.analyze(uri, ModelDetailLevel.All, true);
		const checkerDiagnostics = await this.validateTextDocument(uri);
		return [...parsingDiagnostics, ...checkerDiagnostics];
	}

	public async analyzeDocument(uri: DocumentUri) {
		const parsingDiagnostics = this.analyze(uri, ModelDetailLevel.All, true);
		const checkerDiagnostics = await this.validateTextDocument(uri);
		return [...parsingDiagnostics, ...checkerDiagnostics];
	}

	/**
	 * Analyze the document for the provided uri to find declarations and references.
	 * Returns syntax errors that occurred while parsing the file
	 */
	public analyze(uri: DocumentUri, detailLevel: ModelDetailLevel, incrementalIfPossible: boolean): Diagnostic[] {
		const contents = this.getFileContent(uri);

		time("Parsing file");
		const parser: FileParser = this.getParserForFile(uri, detailLevel, incrementalIfPossible);
		const results = parser.parseFile(contents);
		if (IncrementalModelParser.IsIncrementalParser(parser)) {
			this.uriToIncrementalParsers[uri] = parser as IncrementalModelParser;
		}
		this.symbolAndReferenceManager.updateTree(uri, results.tree, results.modelFileContext);
		timeEnd("Parsing file");
		return results.problems;
	}

	private getParserForFile(uri: string, detailLevel: ModelDetailLevel, incrementalIfPossible: boolean) {
		const extension = getFileExtension(uri);
		let parser: FileParser;
		switch (extension) {
			case "xml": {
				if (incrementalIfPossible) {
					parser = new IncrementalModelParser(uri, detailLevel, this.modelDefinitionManager);
				} else {
					parser = new ModelParser(uri, detailLevel, this.modelDefinitionManager);
				}
				break;
			}
			case "js": parser = new JavascriptParser(uri); break;
			default: parser = new ModelParser(uri, detailLevel, this.modelDefinitionManager); break;
		}
		return parser;
	}

	/**
	 * Analyze the document increment for the provided uri to update the tree.
	 * Returns syntax errors that occurred while parsing the file
	 */
	public async analyzeDocumentIncrementally(uri: DocumentUri, changes: TextDocumentContentChangeEvent[]): Promise<Diagnostic[]> {
		const diagnostics = changes.map(change => { return this.analyzeSingleDocumentChange(uri, change); }).pop();
		return diagnostics || [];
	}

	/**
	 * Analyze the document single increment for the provided uri to update the tree.
	 * Returns syntax errors that occurred while parsing the file
	 */
	public analyzeSingleDocumentChange(uri: DocumentUri, change: TextDocumentContentChangeEvent): Diagnostic[] {
		let problems: Diagnostic[] = [];
		time("Parsing file increment");
		if (TextDocumentContentChangeEvent.isIncremental(change)) {
			//Determine ranges of the section to be reparsed.
			//oldRange: section to be reparsed, newRange: corresponding range after changes where applied
			const coveringNode = this.symbolAndReferenceManager.getNodeCoveringRange(uri, change.range).parent;
			if (coveringNode && coveringNode.type! + ModelElementTypes.Document) {
				const oldRange = coveringNode.fullRange;
				const newRange = this.determineRangeAfterChanges(coveringNode.fullRange, change.range, change.text);
				const contents = this.getFileContent(uri, newRange);

				const parser: IncrementalParser = this.uriToIncrementalParsers[uri];
				const results = parser.updateFile(oldRange, newRange, contents);
				this.symbolAndReferenceManager.updateTree(uri, results.tree, results.modelFileContext);
				problems = results.problems;
			} else {
				return this.analyze(uri, ModelDetailLevel.All, true);
			}
		}

		timeEnd("Parsing file increment");
		return problems;
	}

	private async validateTextDocument(uri: DocumentUri): Promise<Diagnostic[]> {
		time("Checking file");
		const diagnostics = this.modelChecker.checkFile(uri, { detailLevel: ModelDetailLevel.All });
		timeEnd("Checking file");
		return diagnostics;
	}

	private determineRangeAfterChanges(range: Range, changeRange: Range, newText: string) {
		const verifyChangeRangeIsInRange = rangeIsInRange(changeRange, range);
		console.log(verifyChangeRangeIsInRange);

		// Unpack
		const end = range.end; const start = range.start;
		// New start range is equal to old start range
		const newRangeStart = { ...start };

		// Determine lines removed and lines added
		const linesRemoved = changeRange.end.line - changeRange.start.line;
		const linesAdded = (newText.match(/\n/g) || []).length;

		// Did a change happen on the last line
		const changeOnLastLine = changeRange.end.line == range.end.line;
		let charsRemovedLastLine = 0, charsAddedLastLine = 0;
		if (changeOnLastLine) {
			if (linesAdded == 0) {
				charsRemovedLastLine = changeRange.end.character - changeRange.start.character;
				charsAddedLastLine = newText.length;
			} else {
				charsRemovedLastLine = changeRange.end.character;
				charsAddedLastLine = newText.split("\n").pop()?.length || 0;
			}
		}

		const newRangeEnd = {
			character: end.character + charsAddedLastLine - charsRemovedLastLine,
			line: end.line + linesAdded - linesRemoved
		};
		return { start: newRangeStart, end: newRangeEnd };
	}

	/**
	 * Get the content for a given file. If it is an open workspace document get it directly, otherwise read it from disk
	 */
	private getFileContent(uri: string, range?: Range) {
		const document = this.uriToTextDocument[uri];
		if (document) {
			return document.getText(range);
		} else {
			return fs.readFileSync(fileURIToFilePath(uri), 'utf8');
		}
	}

	/**
	 * Find the full word at the given point.
	 */
	public wordAtPoint(uri: string, pos: Position): string {
		const textDocument = this.uriToTextDocument[uri];
		return wordAtPoint(textDocument, pos);
	}

	public contextFromLine(uri: string, pos: Position) {
		const textDocument = this.uriToTextDocument[uri];
		const inAttribute = getContextFromLine(textDocument, pos);
		return inAttribute;
	}

}