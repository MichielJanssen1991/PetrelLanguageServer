//VSCode languageserver
import { TextDocuments, Diagnostic, CompletionItem, TextDocumentPositionParams, LocationLink, Location } from 'vscode-languageserver/node';
import * as LSP from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

//Own
import { Analyzer } from './file-analyzer/analyzer';
import { formatFileURL } from './util/fs';
import { ModelDetailLevel, IsSymbolOrReference, Reference, SymbolDeclaration } from './model-definition/symbolsAndReferences';
import { CompletionContext, CompletionProvider } from './completion/completionProvider';
import { ModelChecker } from './model-checker/modelChecker';

//Other
import { time, timeEnd } from 'console';
import * as fs from 'fs';
import path = require('path');
import { pointIsInRange } from './util/other';
import { ModelManager } from './symbol-and-reference-manager/modelManager';
import { ModelDefinitionManager } from './model-definition/modelDefinitionManager';
import { RuleContext } from './util/xml';

interface DocumentSettings {
	maxNumberOfProblems: number;
	skipFolders: string[];
	skipFoldersForChecks: string[];
}

export default class PetrelLanguageServer {
	private analyzer: Analyzer;
	private connection: LSP._Connection;
	private modelManager: ModelManager;
	private modelDefinitionManager: ModelDefinitionManager;
	private completionProvider: CompletionProvider;
	private modelChecker: ModelChecker;
	private documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
	// The global settings, used when the `workspace/configuration` request is not supported by the client.
	private static defaultSettings: DocumentSettings = { maxNumberOfProblems: 10000, skipFolders: [], skipFoldersForChecks: [] };
	private settings: DocumentSettings = PetrelLanguageServer.defaultSettings;

	constructor(connection: LSP._Connection) {
		this.modelDefinitionManager = new ModelDefinitionManager();
		this.modelManager = new ModelManager();
		this.analyzer = new Analyzer(this.modelManager, this.modelDefinitionManager);
		this.modelChecker = new ModelChecker(this.modelManager);
		this.completionProvider = new CompletionProvider(this.modelManager, this.modelDefinitionManager);
		this.connection = connection;

		// Make the text document manager listen on the connection
		// for open, change and close text document events
		this.documents.listen(this.connection);

		// The content of a text document has changed. This event is emitted
		// when the text document first opened or when its content has changed.
		this.documents.onDidChangeContent(change => {
			this.onDocumentChangeContent(change);
		});

	}

	public static async fromRoot(connection: LSP._Connection, rootPath: string): Promise<PetrelLanguageServer> {
		const languageServer = new PetrelLanguageServer(connection);
		languageServer.settings = PetrelLanguageServer.getConfigSettings(rootPath);

		languageServer.analyzer = await Analyzer.fromRoot({ connection, rootPath }, languageServer.modelManager, languageServer.modelDefinitionManager, languageServer.settings);
		return languageServer;
	}

	private static getConfigSettings(rootPath: string): DocumentSettings {
		const configFile = path.join(rootPath, "petrel-language-server.config.json");
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

	public async onDocumentChangeContent(change: any) {
		const document = change.document;
		this.analyzer.updateDocument(formatFileURL(document.uri), document);
		const diagnostics = await this.validateTextDocument(document);
		this.connection.sendDiagnostics({
			uri: document.uri,
			diagnostics
		});
	}

	private async validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
		const uri = formatFileURL(textDocument.uri);
		const parsingDiagnostics = this.analyzer.analyze(uri, textDocument, ModelDetailLevel.All);

		time("Verifying references");
		const referenceChecksDiagnostics = this.modelChecker.checkFile(uri);
		timeEnd("Verifying references");

		return [...parsingDiagnostics, ...referenceChecksDiagnostics];
	}

	private getWordAtPoint(params: LSP.TextDocumentPositionParams): string {
		return this.analyzer.wordAtPoint(params.textDocument.uri, params.position);
	}
	
	private getAttributeAtPoint(params: LSP.TextDocumentPositionParams): string {
		return this.analyzer.attributeAtPoint(params.textDocument.uri, params.position);
	}

	private getRuleContextAtPoint(params: LSP.TextDocumentPositionParams): RuleContext {
		return this.analyzer.ruleContextFromLine(params.textDocument.uri, params.position);
	}

	/**	
	 * Get the context for a given DocumentPosition.
	 */
	public getContext(params: LSP.TextDocumentPositionParams): CompletionContext {
		let word = "";
		let attribute = "";
		let ruleContext = {} as RuleContext;
		
		if (params.position && params.position.line){
			word = this.getWordAtPoint(params);
			attribute = this.getAttributeAtPoint(params);
			ruleContext = this.getRuleContextAtPoint(params);
		}
		
		const uri = params.textDocument.uri;
		const pos = params.position;
		const inAttribute = this.analyzer.contextFromLine(uri, pos);

		const { nodes, inTag } = this.modelManager.getNodesForPosition(uri, pos);

		return { word, nodes, inTag, inAttribute, uri, attribute, ruleContext};
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
		const { nodes, word } = context;
		this.logRequest({ request: 'onDefinition', params, context });
		let symbols: SymbolDeclaration[] = [];
		if (nodes.length > 0) {
			const lastNode = context.nodes[nodes.length - 1];
			const possibleReferencesSelected = [lastNode, ...Object.values(lastNode.attributeReferences)].filter(x => x.objectType == IsSymbolOrReference.Reference && (x.name == word || x.name.endsWith(`.${word}`))) as Reference[];
			symbols = possibleReferencesSelected
				.map(ref => this.modelManager.getReferencedObject(ref))
				.filter(x => (x != undefined)) as SymbolDeclaration[];
		} else {
			symbols = this.modelManager.findSymbolsMatchingWord({ exactMatch: true, word });
		}
		return this.getSymbolDefinitionLocationLinks(symbols);
	}

	public onReference(params: TextDocumentPositionParams) {
		const context = this.getContext(params);
		const { nodes, word } = context;
		this.logRequest({ request: 'onReference', params, context });
		let references: Reference[] = [];
		if (nodes.length > 0) {
			const lastNode = context.nodes[nodes.length - 1];
			const possibleDeclarationsSelected = [lastNode].filter(x => x.objectType == IsSymbolOrReference.Symbol && (x.name == word || x.name.endsWith(`.${word}`))) as SymbolDeclaration[];
			references = possibleDeclarationsSelected.flatMap(ref => this.modelManager.getReferencesForSymbol(ref));
		} else {
			references = this.modelManager.findReferencesMatchingWord({ exactMatch: true, word });
		}

		return this.getReferenceLocations(references);
	}

	public async getSymbolDefinitionLocationLinks(symbols: SymbolDeclaration[]): Promise<LocationLink[]> {
		return symbols.map((def) => this.symbolDefinitionToLocationLink(def));
	}

	private logRequest({ request, params, context }: {
		request: string
		params: LSP.TextDocumentPositionParams
		context?: CompletionContext
	}) {
		const nodesSimplified = context?.nodes.map(node => {
			return {
				name: node.name,
				type: node.type,
				objectType: node.objectType,
				tag: node.tag,
				otherAttributes: node.otherAttributes,
				attributeReferences: node.attributeReferences				
			};
		}); // Only log essentials to avoid very large log messages (especially caused by chidren)
		this.connection.console.log(
			`${request} ${params.position.line}:${params.position.character} 
			inAttribute=${JSON.stringify(context?.inAttribute)},
			inTag=${JSON.stringify(context?.inTag)},
			uri=${JSON.stringify(context?.uri)},
			word=${JSON.stringify(context?.word)},
			nodes (simplified)=${JSON.stringify(nodesSimplified)}`
		);
	}

	private symbolDefinitionToLocationLink(symbol: SymbolDeclaration): LocationLink {
		const locLink: LocationLink = {
			targetRange: symbol.range,
			targetSelectionRange: symbol.range,
			targetUri: symbol.uri,
		};
		return locLink;
	}

	private async getReferenceLocations(symbols: Reference[]): Promise<Location[]> {
		return symbols.map((def) => this.referenceToLocation(def));
	}

	private referenceToLocation(symbol: Reference): Location {
		const locLink: Location = {
			range: symbol.range,
			uri: symbol.uri,
		};
		return locLink;
	}
}