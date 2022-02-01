import { DocumentSymbol, SymbolKind, SymbolTag } from 'vscode-languageserver';
import { NAMES } from '../model-definition/constants';
import { ModelElementTypes, SymbolDeclaration, TreeNode } from '../model-definition/symbolsAndReferences';
import { ModelManager } from '../symbol-and-reference-manager/modelManager';

export class DocumentSymbolProvider {
	private modelManager: ModelManager
	constructor(modelManager: ModelManager) {
		this.modelManager = modelManager;
	}

	/**
	 * getDocumentSymbolsForFile
	 */
	public getDocumentSymbolsForFile(uri: string) {
		const tree = this.modelManager.getTreeForFile(uri);
		return [this.mapNodesToDocumentSymbols(tree)];
	}

	private mapNodesToDocumentSymbols(node: TreeNode | SymbolDeclaration): DocumentSymbol {
		const { name, details, kind } = this.getNameDetailsAndKindForNode(node);
		const documentSymbol: DocumentSymbol = DocumentSymbol.create(
			name, details, kind, node.fullRange, node.range,
			node.children.map(child => this.mapNodesToDocumentSymbols(child))
		);
		const isObsolete = node.contextQualifiers.isObsolete;
		if(isObsolete){
			documentSymbol.tags = [SymbolTag.Deprecated];
		}
		return documentSymbol;
	}

	private getNameDetailsAndKindForNode(node: TreeNode | SymbolDeclaration) {
		let kind: SymbolKind, name: string, details: string;

		switch (node.type) {
			case ModelElementTypes.ActionCall:
				return this.getNameDetailsAndKindForActionCall(node);
				break;
			case ModelElementTypes.Module:
				name = node.tag;
				details = node.attributes[NAMES.ATTRIBUTE_TARGETNAMESPACE]
					? `${node.attributes[NAMES.ATTRIBUTE_NAME]?.value} (${node.attributes[NAMES.ATTRIBUTE_TARGETNAMESPACE]?.value})`
					: `${node.attributes[NAMES.ATTRIBUTE_NAME]?.value}`;
				kind = SymbolKind.Object;
				break;
			case ModelElementTypes.Rule:
			case ModelElementTypes.Function:
				name = node.tag;
				details = `${node.attributes[NAMES.ATTRIBUTE_NAME]?.value}`;
				kind = SymbolKind.Function;
				break;
			case ModelElementTypes.Input:
			case ModelElementTypes.Output:
				name = node.tag;
				details = `${node.attributes[NAMES.ATTRIBUTE_NAME]?.value}`;
				if(node.attributes[NAMES.ATTRIBUTE_REQUIRED]?.value=="yes")
				{
					details+="*";
				}
				kind = SymbolKind.TypeParameter;
				break;
			case ModelElementTypes.Argument:
				name = node.tag;
				details = this.formatArgumentMapping(node);
				kind = SymbolKind.Variable;
				break;
			case ModelElementTypes.ActionCallOutput:
				name = node.tag;
				details = this.formatOutputArgumentMapping(node);
				kind = SymbolKind.Variable;
				break;
			case ModelElementTypes.Condition:
				name = node.tag;
				details = "";
				kind = SymbolKind.Operator;
				break;
			case ModelElementTypes.If:
			case ModelElementTypes.Switch:
				name = node.tag;
				details = node.attributes[NAMES.ATTRIBUTE_DESCRIPTION]?.value;
				kind = SymbolKind.Boolean;
				break;
			case ModelElementTypes.Document:
				name = node.tag;
				details = "";
				kind = SymbolKind.File;
				break;
			default:
				name = node.tag;
				details = (node as SymbolDeclaration).name;
				kind = SymbolKind.Object;
				break;
		}
		return { name, details, kind };
	}

	private getNameDetailsAndKindForActionCall(node: TreeNode | SymbolDeclaration) {
		const name = node.tag;
		const kind = SymbolKind.Event;
		let details;
		const actionName = node.attributes.name.value;
		switch (actionName.toLowerCase()) {
			case "rule":
				details = `Rule:${node.attributes[NAMES.ATTRIBUTE_RULE]?.value}`;
				break;
			case "infoset":
				details = `Infoset:${node.attributes[NAMES.ATTRIBUTE_INFOSET]?.value}`;
				break;

			default:
				details = actionName;
				break;
		}
		return { name, details, kind };
	}

	private formatArgumentMapping(node: TreeNode) {
		const localName = node.attributes[NAMES.ATTRIBUTE_LOCALNAME];
		const remoteName = node.attributes[NAMES.ATTRIBUTE_REMOTENAME];
		const value = node.attributes[NAMES.ATTRIBUTE_VALUE];
		const expression = node.attributes[NAMES.ATTRIBUTE_EXPRESSION];
		const from = (value ? `"${value?.value}"` : undefined)
			|| (expression ? `"${expression?.value}"` : undefined)
			|| localName?.value;
		const to = remoteName?.value
			|| localName?.value;
		return `${from} -> ${to}`;
	}

	private formatOutputArgumentMapping(node: TreeNode) {
		const localName = node.attributes[NAMES.ATTRIBUTE_LOCALNAME];
		const remoteName = node.attributes[NAMES.ATTRIBUTE_REMOTENAME];
		const to = localName?.value || remoteName?.value;
		const from = remoteName?.value
			|| localName?.value;
		return `${to} <- ${from}`;
	}
}