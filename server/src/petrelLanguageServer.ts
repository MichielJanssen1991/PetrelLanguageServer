//VSCode languageserver
import { TextDocuments, Diagnostic, CompletionItem, TextDocumentPositionParams, LocationLink, Location } from 'vscode-languageserver/node';
import * as LSP from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

//Own
import { Analyzer } from './file-analyzer/analyzer';
import { formatFileURL } from './util/fs';
import { ModelDetailLevel, Reference, SymbolDeclaration } from './model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from "./symbolAndReferenceManager";
import { CompletionContext, CompletionProvider } from './completion/completionProvider';
import { ModelChecker } from './model-checker/modelChecker';

//Other
import { time, timeEnd } from 'console';
import * as fs from 'fs';
import path = require('path');
import { pointIsInRange } from './util/other';

interface DocumentSettings {
	maxNumberOfProblems: number;
	skipFolders: string[];
	skipFoldersForChecks: string[];
}

export default class PetrelLanguageServer {
	private analyzer: Analyzer;
	private connection: LSP._Connection;
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private completionProvider: CompletionProvider;
	private modelChecker: ModelChecker;
	private documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
	// The global settings, used when the `workspace/configuration` request is not supported by the client.
	private static defaultSettings: DocumentSettings = { maxNumberOfProblems: 10000, skipFolders: [], skipFoldersForChecks: [] };
	private settings: DocumentSettings = PetrelLanguageServer.defaultSettings;

	constructor(connection: LSP._Connection) {
		this.symbolAndReferenceManager = new SymbolAndReferenceManager();
		this.analyzer = new Analyzer(this.symbolAndReferenceManager);
		this.modelChecker = new ModelChecker(this.symbolAndReferenceManager);
		this.completionProvider = new CompletionProvider(this.symbolAndReferenceManager);
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

		languageServer.analyzer = await Analyzer.fromRoot({ connection, rootPath }, languageServer.symbolAndReferenceManager, languageServer.settings);
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
		const parsingDiagnostics = this.analyzer.analyze(uri, textDocument, ModelDetailLevel.ArgumentReferences);
		
		time("Verifying references");
		const referenceChecksDiagnostics = this.modelChecker.checkFile(uri);
		timeEnd("Verifying references");

		return [...parsingDiagnostics, ...referenceChecksDiagnostics];
	}

	private getWordAtPoint(params: LSP.TextDocumentPositionParams): string {
		return this.analyzer.wordAtPoint(params.textDocument.uri, params.position);
	}

	/**	
	 * Get the context for a given DocumentPosition.
	 */
	public getContext(params: LSP.TextDocumentPositionParams): CompletionContext {
		const word = this.getWordAtPoint(params);
		const uri = params.textDocument.uri;
		const pos = params.position;
		const { inAttribute, tag } = this.analyzer.contextFromLine(uri, pos);

		//Find main reference if any
		let referencesAtPosition = this.symbolAndReferenceManager.getReferencesForPosition(uri, pos);
		//Find main declaration if any
		const declarationsAtPosition = this.symbolAndReferenceManager.getSymbolsForPosition(uri, pos);

		//If no reference found possibly a child reference
		let parentReferenceAtPoint;
		if (referencesAtPosition.length == 0) {
			const parentReferencesAtPoint = this.symbolAndReferenceManager.getReferencesForPosition(uri, pos, true);
			if (parentReferencesAtPoint.length > 0) {
				const parentReferenceAtPoint = parentReferencesAtPoint[0];
				referencesAtPosition = parentReferenceAtPoint.children.filter(ref =>
					pointIsInRange(ref.range, pos));
			}
		}
		return { word, references: referencesAtPosition, declarations: declarationsAtPosition, parentReference: parentReferenceAtPoint, inAttribute, tag };
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
		const { references, word } = context;
		this.logRequest({ request: 'onDefinition', params, context });
		let symbols: SymbolDeclaration[] = [];
		if (references.length > 0) {
			const possibleReferencesSelected = references.filter(x => x.name == word || x.name.endsWith(`.${word}`));
			symbols = possibleReferencesSelected
			.map(ref => this.symbolAndReferenceManager.getReferencedObject(ref))
			.filter(x=> (x!=undefined)) as SymbolDeclaration[];
		}else{
			symbols = this.symbolAndReferenceManager.findSymbolsMatchingWord({exactMatch:true,word});
		}
		return this.getSymbolDefinitionLocationLinks(symbols);
	}

	public onReference(params: TextDocumentPositionParams) {
		const context = this.getContext(params);
		const { declarations, word } = context;
		this.logRequest({ request: 'onReference', params, context });
		let references: Reference[] = [];
		if (declarations.length > 0) {
			const possibleDeclarationsSelected = declarations.filter(x => x.name == word || x.name.endsWith(`.${word}`));
			references = possibleDeclarationsSelected.flatMap(ref => this.symbolAndReferenceManager.getReferencesForSymbol(ref));
		}else{
			references = this.symbolAndReferenceManager.findSymbolsMatchingWord({exactMatch:true,word});
		}

		return this.getReferenceLocations(references);
	}

	public async getSymbolDefinitionLocationLinks(symbols: SymbolDeclaration[]): Promise<LocationLink[]> {
		return symbols.map((def) => this.symbolDefinitionToLocationLink(def));
	}

	private logRequest({ request, params, word, context }: {
		request: string
		params: LSP.TextDocumentPositionParams
		word?: string | null
		context?: any
	}) {
		const wordLog = word ? `"${word}"` : 'null';
		this.connection.console.log(
			`${request} ${params.position.line}:${params.position.character} word=${wordLog} context=${JSON.stringify(context)}`,
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