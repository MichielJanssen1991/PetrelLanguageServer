import * as fs from 'fs';
import { promisify } from 'util';
import { DocumentUri, Position, TextDocument } from 'vscode-languageserver-textdocument';

import { filePathToFileURI, fileURIToFilePath, getFileExtension, getJavascriptFilePaths, getModelFilePaths } from '../util/fs';
import { ModelDetailLevel } from '../model-definition/symbolsAndReferences';
import { time, timeEnd } from 'console';
import { getContextFromLine, wordAtPoint } from '../util/xml';
import { ModelParser } from './parser/modelParser';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import { JavascriptParser } from './parser/javascriptParser';
import { FileParser, FileParserResults } from './parser/fileParser';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';
import { Connection, Diagnostic, DidChangeTextDocumentParams, Range, TextDocumentContentChangeEvent } from 'vscode-languageserver';
import { IncrementalModelParser } from './parser/incrementalModelParser';
import { rangeIsInRange } from '../util/other';
import { ModelChecker } from '../model-checker/modelChecker';

const readFileAsync = promisify(fs.readFile);

/**
 * The Analyzer uses an xml parser to find definitions, reference, etc. 
 */
export class Analyzer {
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private modelDefinitionManager: ModelDefinitionManager;
	private modelChecker: ModelChecker;

	// Object containing TextDocument for each uri. Only for open workspace documents
	private uriToTextDocument: { [uri: string]: TextDocument } = {};
	// Object containing parser results for each uri. Only for open workspace documents. 
	// The previous parser result is used in incremental parsing
	private uriToParserResults: { [uri: string]: FileParserResults } = {};

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
		rootPath: string ,
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
				await this.analyze(uri, detailLevel);
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
		const parsingDiagnostics = await this.analyzeDocumentIncrementally(uri, ModelDetailLevel.All, change.contentChanges);
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
		const parsingDiagnostics = await this.analyze(uri, ModelDetailLevel.All, true);
		const checkerDiagnostics = await this.validateTextDocument(uri);
		return [...parsingDiagnostics, ...checkerDiagnostics];
	}

	/**
	 * Analyze the document for the provided uri to find declarations and references.
	 * Returns syntax errors that occurred while parsing the file
	 */
	public async analyze(uri: DocumentUri, detailLevel: ModelDetailLevel, storeResult=false): Promise<Diagnostic[]> {
		const contents = await this.getFileContent(uri);

		time("Parsing file");
		const parser: FileParser = this.getParserForFile(uri, detailLevel);
		const results = parser.parseFile(contents);
		if(storeResult){
			this.uriToParserResults[uri] = results;
		}
		this.symbolAndReferenceManager.updateTree(uri, results.tree, results.modelFileContext);
		timeEnd("Parsing file");
		return results.problems;
	}

	private getParserForFile(uri: string, detailLevel: ModelDetailLevel) {
		const extension = getFileExtension(uri);
		let parser: FileParser;
		switch (extension) {
			case "xml": parser = new ModelParser(uri, detailLevel, this.modelDefinitionManager); break;
			case "js": parser = new JavascriptParser(uri); break;
			default: parser = new ModelParser(uri, detailLevel, this.modelDefinitionManager); break;
		}
		return parser;
	}

	/**
	 * Analyze the document increment for the provided uri to update the tree.
	 * Returns syntax errors that occurred while parsing the file
	 */
	public async analyzeDocumentIncrementally(uri: DocumentUri, detailLevel: ModelDetailLevel, changes: TextDocumentContentChangeEvent[]): Promise<Diagnostic[]> {
		const diagnostics = changes.map(change => { this.analyzeSingleDocumentChange(uri, detailLevel, change); }).pop();
		return diagnostics || [];
	}

	/**
	 * Analyze the document single increment for the provided uri to update the tree.
	 * Returns syntax errors that occurred while parsing the file
	 */
	public async analyzeSingleDocumentChange(uri: DocumentUri, detailLevel: ModelDetailLevel, change: TextDocumentContentChangeEvent): Promise<Diagnostic[]> {
		let problems: Diagnostic[] = [];
		time("Parsing file increment");
		if (TextDocumentContentChangeEvent.isIncremental(change)) {
			//Determine ranges of the section to be reparsed.
			//oldRange: section to be reparsed, newRange: corresponding range after changes where applied
			const coveringNode = this.symbolAndReferenceManager.getNodeCoveringRange(uri, change.range);
			const oldRange = coveringNode.fullRange;
			const newRange = this.determineRangeAfterChanges(coveringNode.fullRange, change.range, change.text);
			const contents = await this.getFileContent(uri, newRange);

			const parser: IncrementalModelParser = new IncrementalModelParser(
				uri,
				detailLevel,
				this.modelDefinitionManager,
				this.uriToParserResults[uri],
				oldRange,
				newRange,
				contents);

			// console.log("oldRange:" + this.printRange(oldRange));
			// console.log("rangeAfterChange:" + this.printRange(rangeAfterChange));
			// console.log("contents:" + contents);
			// console.log("BEFORE");
			// this.printTree(this.uriToParserResults[uri].tree);
			const results = parser.updateParsedTree();
			this.uriToParserResults[uri] = results;
			// console.log("AFTER");
			// this.printTree(this.uriToParserResults[uri].tree);

			this.symbolAndReferenceManager.updateTree(uri, results.tree, results.modelFileContext);
			problems = results.problems;
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
	private async getFileContent(uri: string, range?: Range) {
		const document = this.uriToTextDocument[uri];
		if (document) {
			return document.getText(range);
		} else {
			return await readFileAsync(fileURIToFilePath(uri), 'utf8');
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