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
	public nodes: TreeNode[];
	public word: string;
	public uri: string;
	public attribute?: Reference | Attribute;
	public get numberOfNodes(): number {
		return this.nodes.length;
	}

	public get currentNode(): TreeNode | undefined {
		return this.numberOfNodes > 0 ? this.nodes[this.numberOfNodes - 1] : undefined;
	}

	public get firstParent(): TreeNode | undefined {
		return this.numberOfNodes > 1 ? this.nodes[this.numberOfNodes - 2] : undefined;
	}

	constructor(inAttribute: boolean, inTag: boolean, nodes: TreeNode[], word: string, uri: string, attribute?: Reference | Attribute) {
		this.inAttribute = inAttribute;
		this.inTag = inTag;
		this.nodes = nodes;
		this.word = word;
		this.uri = uri;
		this.attribute = attribute;
	}

	//Returns the first predecessor of the given type
	public getPredecessorOfType(type: ModelElementTypes, isSymbolDeclaration: boolean) {
		return this.nodes.reverse().find(node => node.type == type && node.isSymbolDeclaration == isSymbolDeclaration);
	}

	public getFromContext(modelType: ModelElementTypes, matchTags: ModelElementTypes[]){
		const definition = this.getPredecessorOfType(modelType, true) as SymbolDeclaration;
		if (definition) {
			const params = this.findNames(definition.children, matchTags);
			return { name: definition.name, availableParams: params };
		}
		return undefined;
	}

	private findNames(children: any[], matchTags: ModelElementTypes[]): string[] {
		let names: string[] = [];
		children.forEach(child => {
			if (matchTags.map(tag => tag.toLowerCase()).includes(child.tag)) {
				names.push(child.name);
			}
			if (child.children && child.children.length > 0) {
				names = names.concat(this.findNames(child.children, matchTags));
			}
		});
		return names;
	}
}