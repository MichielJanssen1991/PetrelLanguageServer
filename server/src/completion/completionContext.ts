import { Attribute, ModelElementTypes, Reference, TreeNode, SymbolDeclaration } from '../model-definition/symbolsAndReferences';

export type RuleContext = {
	name: string,
	availableParams: string[]//ParamRuleContext[]
}

export type ParamRuleContext = {
	type: [ModelElementTypes.Input, ModelElementTypes.Output, ModelElementTypes.SetVar],
	name?: string,
	localName?: string,
	remoteName?: string,
	value?: string
}

export class CompletionContext {
	public inAttribute: boolean;
	public inTag: boolean;
	public node: TreeNode;
	public word: string;
	public uri: string;
	public attribute?: Reference | Attribute;

	public get currentNode(): TreeNode | undefined {
		return this.node;
	}

	public get firstParent(): TreeNode | undefined {
		return this.node ? this.node.parent : undefined;
	}

	constructor(inAttribute: boolean, inTag: boolean, nodes: TreeNode, word: string, uri: string, attribute?: Reference | Attribute) {
		this.inAttribute = inAttribute;
		this.inTag = inTag;
		this.node = nodes;
		this.word = word;
		this.uri = uri;
		this.attribute = attribute;
	}

	//Returns the first predecessor of the given type
	public getPredecessorOfType(type: ModelElementTypes) {
		return this.getPredecessorOfTypeForNode(this.node, type);
	}
	public getPredecessorOfTypeForNode(node: TreeNode, type: ModelElementTypes): TreeNode | undefined {
		const parent = node.parent;
		if (!parent) { return undefined; }
		if (parent.type == type) {
			return parent;
		} else {
			return this.getPredecessorOfTypeForNode(parent, type);
		}
	}

	public getFromContext(type: ModelElementTypes, matchTypes: ModelElementTypes[]) {
		const node = this.getPredecessorOfType(type) as SymbolDeclaration;
		if (node) {
			const params = this.findNamesForChildrenOfType(node, matchTypes);
			return { name: node.name, availableParams: params };
		}
		return undefined;
	}

	private findNamesForChildrenOfType(node: TreeNode, matchTypes: ModelElementTypes[]): string[] {
		let names: string[] = [];
		node.children.forEach(child => {
			if (matchTypes.includes(child.type)) {
				names.push((child as SymbolDeclaration).name);
			}
			if (child.children && child.children.length > 0) {
				names = names.concat(this.findNamesForChildrenOfType(child, matchTypes));
			}
		});
		return names;
	}
}