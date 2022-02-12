import { fileURLToPath } from 'url';
import {
	createConnection,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	DocumentSymbolParams,
	DidOpenTextDocumentParams,
	DidChangeTextDocumentParams,
	DidSaveTextDocumentParams
} from 'vscode-languageserver/node';

import PetrelLanguageServer from './petrelLanguageServer';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

let languageServer: PetrelLanguageServer;
let workspaceRoot: string | undefined;


connection.onInitialize(async (params: InitializeParams) => {
	if (params.workspaceFolders) {
		workspaceRoot = fileURLToPath(params.workspaceFolders[0].uri);
	}

	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: {
				change: TextDocumentSyncKind.Incremental,
				openClose: true,
				save: true
			},
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true
			},
			// Tell the client that this server supports go to definition.
			definitionProvider: true,
			// Tell the client that this server supports find references
			referencesProvider: true,
			// Tell the client that this server supports document symbols for the document outline
			documentSymbolProvider: true
		}
	};
	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	if (workspaceRoot) {
		languageServer = await PetrelLanguageServer.fromRoot(connection, workspaceRoot);
	}
	else {
		languageServer = new PetrelLanguageServer(connection);
	}
	return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
	languageServer.onInitialized();
});

connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
	return languageServer.onCompletion(params);
});

connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return languageServer.onCompletionResolve(item);
});

connection.onDefinition((params: TextDocumentPositionParams) => {
	return languageServer.onDefinition(params);
});

connection.onReferences((params: TextDocumentPositionParams) => {
	return languageServer.onReference(params);
});

connection.onDocumentSymbol((params: DocumentSymbolParams) => {
	return languageServer.onDocumentSymbol(params);
});

connection.onDidOpenTextDocument((params: DidOpenTextDocumentParams) => {
	return languageServer.onDidOpenTextDocument(params);
});

connection.onDidChangeTextDocument((params: DidChangeTextDocumentParams) => {
	return languageServer.onDidChangeTextDocument(params);
});

connection.onDidSaveTextDocument((params: DidSaveTextDocumentParams) => {
	return languageServer.onDidSaveTextDocument(params);
});

// Listen on the connection
connection.listen();
