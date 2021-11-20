import * as LSP from 'vscode-languageserver';
import { Diagnostic } from 'vscode-languageserver';
import { ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { ModelDetailLevel, ModelElementTypes, newSymbolDeclaration, SymbolDeclaration } from '../../model-definition/symbolsAndReferences';

export abstract class FileParser {
	protected uri: string;
	protected detailLevel: ModelDetailLevel;
	protected results: FileParserResults;

	constructor(uri: string, detailLevel: ModelDetailLevel) {
		this.uri = uri;
		this.detailLevel = detailLevel;
		const rootNode = newSymbolDeclaration("root", "root", ModelElementTypes.Unknown, LSP.Range.create({ character: 0, line: 0 }, { character: 0, line: 0 }), uri);
		this.results = { problems: [], tree: rootNode };
	}

	abstract parseFile(fileContent: string): FileParserResults

	protected addError(range: LSP.Range, message: string) {
		this.results.problems.push(LSP.Diagnostic.create(
			range,
			message,
			LSP.DiagnosticSeverity.Error
		));
	}

	protected addWarning(range: LSP.Range, message: string) {
		this.results.problems.push(LSP.Diagnostic.create(
			range,
			message,
			LSP.DiagnosticSeverity.Warning
		));
	}
}

export type FileParserResults = {
	problems: Diagnostic[],
	tree: SymbolDeclaration,
	modelFileContext?: ModelFileContext,
}