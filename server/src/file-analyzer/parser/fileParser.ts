import * as LSP from 'vscode-languageserver';
import { Diagnostic } from 'vscode-languageserver';
import { DiagnosticsCollection } from '../../generic/diagnosticsCollection';
import { ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { ModelDetailLevel, ModelElementTypes, newTreeNode, TreeNode } from '../../model-definition/symbolsAndReferences';

export abstract class FileParser extends DiagnosticsCollection {
	protected uri: string;
	protected detailLevel: ModelDetailLevel;
	protected results: FileParserResults;

	constructor(uri: string, detailLevel: ModelDetailLevel) {
		super();
		this.uri = uri;
		this.detailLevel = detailLevel;
		const rootNode = newTreeNode("document", ModelElementTypes.Document, LSP.Range.create({ character: 0, line: 0 }, { character: 0, line: 0 }), uri);
		this.results = { problems: [], tree: rootNode };
	}

	abstract parseFile(fileContent: string): FileParserResults
}

export type FileParserResults = {
	problems: Diagnostic[],
	tree: TreeNode,
	modelFileContext?: ModelFileContext,
}