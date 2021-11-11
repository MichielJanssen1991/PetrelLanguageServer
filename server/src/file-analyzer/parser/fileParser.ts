import * as LSP from 'vscode-languageserver';
import { Diagnostic } from 'vscode-languageserver';
import { ModelDetailLevel, ModelElementTypes, newSymbolDeclaration, SymbolDeclaration } from '../../model-definition/symbolsAndReferences';

export abstract class FileParser {
	protected uri: string;
	protected detailLevel: ModelDetailLevel;
	protected results: { problems: Diagnostic[], tree: SymbolDeclaration };

	constructor(uri: string, detailLevel: ModelDetailLevel) {
		this.uri = uri;
		this.detailLevel = detailLevel;
		const rootNode = newSymbolDeclaration("root", "root", ModelElementTypes.Unknown, LSP.Range.create({ character: 0, line: 0 }, { character: 0, line: 0 }), uri, false);
		this.results = { problems: [], tree: rootNode };
	}

	abstract parseFile(fileContent: string): FileParserResults
}



export type FileParserResults = {
	problems: Diagnostic[],
	tree: SymbolDeclaration
}