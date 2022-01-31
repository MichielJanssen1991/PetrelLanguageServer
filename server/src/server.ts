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
	DocumentSymbolParams
} from 'vscode-languageserver/node';

import PetrelLanguageServer from './petrelLanguageServer';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
// let hasDiagnosticRelatedInformationCapability = false;

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
	// hasDiagnosticRelatedInformationCapability = !!(
	// 	capabilities.textDocument &&
	// 	capabilities.textDocument.publishDiagnostics &&
	// 	capabilities.textDocument.publishDiagnostics.relatedInformation
	// );

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true,
				triggerCharacters: ['#', '@']
			},
			definitionProvider: true,
			referencesProvider: true,
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

// Listen on the connection
connection.listen();
