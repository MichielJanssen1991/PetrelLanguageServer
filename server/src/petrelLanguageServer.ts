//VSCode languageserver
import * as LSP from 'vscode-languageserver';
import { CompletionItem, TextDocumentPositionParams, DocumentSymbolParams, DocumentSymbol, DidChangeTextDocumentParams, DidOpenTextDocumentParams, DidSaveTextDocumentParams } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

//Own
import { Analyzer } from './file-analyzer/analyzer';
import { ModelDetailLevel } from './model-definition/types/definitions';
import { CompletionProvider } from './completion/completionProvider';
import { ModelChecker } from './model-checker/modelChecker';
import { ModelDefinitionManager } from './model-definition/modelDefinitionManager';
import { ModelManager } from './symbol-and-reference-manager/modelManager';
import { ActionContext } from './generic/actionContext';
import { DocumentSymbolProvider } from './document-symbols/documentSymbolProvider';
import { DefinitionAndReferenceProvider } from './on-definition-or-reference/DefinitionAndReferenceProvider';

//Other
import * as fs from 'fs';
import path = require('path');

interface DocumentSettings {
	maxNumberOfProblems: number;
	skipFolders: string[];
	skipFoldersForChecks: string[];
}

export default class PetrelLanguageServer {
	//Injected dependencies
	private connection: LSP._Connection;

	// Sub components of the language server
	private analyzer: Analyzer;
	private modelManager: ModelManager;
	private modelDefinitionManager: ModelDefinitionManager;
	private completionProvider: CompletionProvider;
	private documentSymbolProvider: DocumentSymbolProvider;
	private modelChecker: ModelChecker;
	private definitionAndReferenceProvider: DefinitionAndReferenceProvider

	// Initialize default settings
	private static defaultSettings: DocumentSettings = { maxNumberOfProblems: 10000, skipFolders: [], skipFoldersForChecks: [] };
	private settings: DocumentSettings = PetrelLanguageServer.defaultSettings;

	constructor(connection: LSP._Connection) {
		//Injected dependencies
		this.connection = connection;

		//Initialize various components and inject
		this.modelDefinitionManager = new ModelDefinitionManager();
		this.modelManager = new ModelManager();
		this.documentSymbolProvider = new DocumentSymbolProvider(this.modelManager);
		this.modelChecker = new ModelChecker(this.modelManager, this.modelDefinitionManager);
		this.analyzer = new Analyzer(this.modelManager, this.modelDefinitionManager, this.modelChecker);
		this.completionProvider = new CompletionProvider(this.modelManager, this.modelDefinitionManager);
		this.definitionAndReferenceProvider = new DefinitionAndReferenceProvider(this.modelManager);
	}

	public static async fromRoot(connection: LSP._Connection, rootPath: string): Promise<PetrelLanguageServer> {
		const languageServer = new PetrelLanguageServer(connection);
		languageServer.settings = PetrelLanguageServer.getSettingsFromFileOrDefault(rootPath);
		languageServer.analyzer = await Analyzer.fromRoot(
			connection,
			rootPath,
			languageServer.modelManager,
			languageServer.modelDefinitionManager,
			languageServer.modelChecker,
			languageServer.settings);
		return languageServer;
	}

	private static getSettingsFromFileOrDefault(rootPath: string): DocumentSettings {
		let configFile = path.join(rootPath, "petrel-language-server.config.json");
		if (!fs.existsSync(configFile)) {
			configFile = path.join(rootPath, ".modeler/petrel-language-server.config.json");
		}

		if (fs.existsSync(configFile)) {
			const rawdata = fs.readFileSync(configFile, { encoding: 'utf8' });
			return JSON.parse(rawdata);
		}
		else {
			return this.defaultSettings;
		}
	}

	public async onInitialized() {
		const diagnosticsPerFile = this.modelChecker.checkAllFiles({
			maxNumberOfProblems: this.settings.maxNumberOfProblems,
			detailLevel: ModelDetailLevel.References,
			skipFolders: this.settings.skipFoldersForChecks
		});

		Object.keys(diagnosticsPerFile).forEach(key =>
			this.connection.sendDiagnostics({ uri: key, diagnostics: diagnosticsPerFile[key] })
		);
	}

	public async onDidChangeTextDocument(change: DidChangeTextDocumentParams) {
		const uri = change.textDocument.uri;
		const diagnostics = await this.analyzer.updateDocument(change);
		this.connection.sendDiagnostics({ uri, diagnostics });
	}

	public async onDidOpenTextDocument(params: DidOpenTextDocumentParams) {
		const uri = params.textDocument.uri;
		const documentItem = params.textDocument;
		const document = TextDocument.create(documentItem.uri, documentItem.languageId, documentItem.version, documentItem.text);
		const diagnostics = await this.analyzer.openDocument(document);
		this.connection.sendDiagnostics({ uri, diagnostics });
	}

	public async onDidSaveTextDocument(params: DidSaveTextDocumentParams) {
		const uri = params.textDocument.uri;
		const diagnostics = await this.analyzer.analyzeDocument(uri);
		this.connection.sendDiagnostics({ uri, diagnostics });
	}

	private getWordAtPoint(params: LSP.TextDocumentPositionParams): string {
		return this.analyzer.wordAtPoint(params.textDocument.uri, params.position);
	}

	/**	
	 * Get the context for a given DocumentPosition.
	 */
	public getContext(params: LSP.TextDocumentPositionParams): ActionContext {
		let word = "";

		if (params.position && params.position.line) {
			word = this.getWordAtPoint(params);
		}

		const uri = params.textDocument.uri;
		const pos = params.position;
		const inAttribute = this.analyzer.contextFromLine(uri, pos);

		const { node, inTag, attribute } = this.modelManager.getNodeForPosition(uri, pos);
		const context = new ActionContext(inAttribute, inTag, node, word, uri, attribute);

		return context;
	}

	public onCompletion(params: TextDocumentPositionParams): CompletionItem[] {
		const context = this.getContext(params);
		this.logRequest({ request: 'onCompletion', params, context });
		return this.completionProvider.getCompletionItems(context);
	}

	public onCompletionResolve(item: CompletionItem): CompletionItem {
		return item;
	}

	public onDefinition(params: TextDocumentPositionParams) {
		const context = this.getContext(params);
		this.logRequest({ request: 'onDefinition', params, context });
		return this.definitionAndReferenceProvider.onDefinition(context);
	}

	public onReference(params: TextDocumentPositionParams) {
		const context = this.getContext(params);
		this.logRequest({ request: 'onReference', params, context });
		return this.definitionAndReferenceProvider.onReference(context);
	}

	public async onDocumentSymbol(params: DocumentSymbolParams): Promise<DocumentSymbol[]> {
		const uri = params.textDocument.uri;
		return this.documentSymbolProvider.getDocumentSymbolsForFile(uri);
	}

	private logRequest({ request, params, context }: {
		request: string
		params: LSP.TextDocumentPositionParams
		context?: ActionContext
	}) {
		const nodeSimplified = {
			type: context?.node.type,
			objectType: context?.node.isSymbolDeclaration,
			tag: context?.node.tag
		}; // Only log essentials to avoid very large log messages (especially caused by chidren)
		this.connection.console.log(
			`${request} ${params.position.line}:${params.position.character} 
			inAttribute=${JSON.stringify(context?.inAttribute)},
			inTag=${JSON.stringify(context?.inTag)},
			uri=${JSON.stringify(context?.uri)},
			word=${JSON.stringify(context?.word)},
			nodes (simplified)=${JSON.stringify(nodeSimplified)}`
		);
	}
}