import * as fs from 'fs';
import { promisify } from 'util';
import * as LSP from 'vscode-languageserver';
import { Position, TextDocument } from 'vscode-languageserver-textdocument';

import { filePathToFileURL, getFileExtension, getJavascriptFilePaths, getModelFilePaths } from '../util/fs';
import { ModelDetailLevel } from '../model-definition/symbolsAndReferences';
import { time, timeEnd } from 'console';
import { getContextFromLine, wordAtPoint } from '../util/xml';
import { ModelParser } from './parser/modelParser';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import { JavascriptParser } from './parser/javascriptParser';
import { FileParser } from './parser/fileParser';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';

const readFileAsync = promisify(fs.readFile);

/**
 * The Analyzer uses an xml parser to find definitions, reference, etc. 
 */
export class Analyzer {
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private modelDefinitionManager: ModelDefinitionManager;
	private uriToTextDocument: { [uri: string]: TextDocument } = {};

	constructor(symbolAndReferenceManager: SymbolAndReferenceManager, modelDefinitionManager:ModelDefinitionManager) {
		this.symbolAndReferenceManager = symbolAndReferenceManager;
		this.modelDefinitionManager =  modelDefinitionManager;
	}

	/**
	 * Initialize the Analyzer based on a connection to the client and a root path.	 
	 */
	public static async fromRoot(
		{ connection, rootPath }: { connection: LSP.Connection, rootPath: string }, 
		symbolAndReferenceManager: SymbolAndReferenceManager, 
		modelDefinitionManager: ModelDefinitionManager, 
		options?: { skipFolders: string[] })
		: Promise<Analyzer> {
		const analyzer = new Analyzer(symbolAndReferenceManager, modelDefinitionManager);

		if (rootPath) {
			connection.console.log(`Analyzing files inside ${rootPath}`);
			connection.console.log(`Skipping folders: ${options?.skipFolders}`);

			const lookupStartTime = Date.now();
			const getTimePassed = (): string => `${(Date.now() - lookupStartTime) / 1000} seconds`;

			const filePaths: string[] = await getModelFilePaths(rootPath, options);
			connection.console.log(`Glob resolved with ${filePaths.length} model files`);
			await analyzer.analyzeFiles(filePaths, connection, ModelDetailLevel.References);

			const javascriptFilePaths: string[] = await getJavascriptFilePaths( rootPath, options);
			connection.console.log(`Glob resolved with ${javascriptFilePaths.length} javascript files`);
			await analyzer.analyzeFiles(javascriptFilePaths, connection, ModelDetailLevel.References);
			
			connection.console.log(`Analyzer finished after ${getTimePassed()}`);
		}

		return analyzer;
	}

	private async analyzeFiles(filepaths: string[], connection: LSP.Connection, detailLevel: ModelDetailLevel) {
		const numberOfFiles = filepaths.length; let i = 1;
		for (const filePath of filepaths) {
			const uri = filePathToFileURL(filePath);
			connection.console.log(`Analyzing file (${i}/${numberOfFiles}): ${uri}`);

			try {
				const fileContent = await readFileAsync(filePath, 'utf8');
				this.analyze(uri, TextDocument.create(uri, getFileExtension(uri), 1, fileContent), detailLevel);
			} catch (error) {
				connection.console.warn(`Failed analyzing ${uri}. Error: ${(error as Error).message}`);
			}
			i++;
		}
		return { numberOfFiles, i };
	}

	public updateDocument(uri: string, document: TextDocument) {
		this.uriToTextDocument[uri] = document;
	}

	/**
	 * Analyze the given document to find declarations and references.
	 * Returns syntax errors that occurred while parsing the file
	 */
	public analyze(uri: string, document: TextDocument, detailLevel: ModelDetailLevel): LSP.Diagnostic[] {
		const contents = document.getText();
		let problems: LSP.Diagnostic[] = [];

		time("Analyzing file for declarations and references");
		const extension = getFileExtension(uri);
		let parser:FileParser;
		switch (extension) {
			case "xml": parser = new ModelParser(uri, detailLevel, this.modelDefinitionManager); break;
			case "js": parser = new JavascriptParser(uri); break;
			default: parser = new ModelParser(uri, detailLevel, this.modelDefinitionManager); break;
		}

		const results = parser.parseFile(contents);
		this.symbolAndReferenceManager.updateTree(uri, results.tree, results.modelFileContext);
		problems = problems.concat(results.problems);
		timeEnd("Analyzing file for declarations and references");
		return problems;
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