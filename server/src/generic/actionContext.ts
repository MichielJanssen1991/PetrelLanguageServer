import { ModelElementTypes } from '../model-definition/types/definitions';
import { Attribute, Reference, TreeNode, SymbolDeclaration } from '../model-definition/types/tree';

export class ActionContext {
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
	public getAncestorOfType(type: ModelElementTypes) {
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

	/**
	 * Get the value of given attributes for children of a given type within a given context
	 * @param ancertorType: The context in which to search
	 * @param typeAttributes: A list of type and attribute pairs. For each element of type it returns the value of the specified attribute
	 * @returns 
	 */
	public getFromContext(ancertorType: ModelElementTypes, typeAttributes: { type: ModelElementTypes, attribute: string }[]) {
		const node = this.getAncestorOfType(ancertorType) as SymbolDeclaration;
		if (node) {
			const params = this.findNamesForChildrenOfType(node, typeAttributes);
			return { name: node.name, availableParams: params };
		}
		return undefined;
	}

	private findNamesForChildrenOfType(node: TreeNode, typeAttributes: { type: ModelElementTypes, attribute: string }[]): string[] {
		let names: string[] = [];
		node.children.forEach(child => {
			const attribute = typeAttributes.find(typeAndAttribute => typeAndAttribute.type == child.type)?.attribute;
			if (attribute && child.attributes[attribute]) {
				names.push(child.attributes[attribute].value);
			}
			if (child.children && child.children.length > 0) {
				names = names.concat(this.findNamesForChildrenOfType(child, typeAttributes));
			}
		});
		return this.removeDuplicates(names);
	}

	private removeDuplicates(names: string[]) {
		return Array.from(new Set(names));
	}
}