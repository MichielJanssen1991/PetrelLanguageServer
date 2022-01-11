import { Range } from 'vscode-languageserver-types';
import { Attribute, ModelElementTypes, Reference, TreeNode, newSymbolDeclaration, SymbolDeclaration } from '../model-definition/symbolsAndReferences';

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

	// public getAttributeValueByTagAndName(inTag: ModelElementTypes|undefined, searchName: string): string {
	// 	let value = "";
	// 	if (inTag) {
	// 		this.nodes.forEach(n=>{
	// 			if (value == ""){
	// 				const res = this.walkChildrenToFindAttributeInTag(n, inTag, searchName);
	// 				if (res) {
	// 					const allNodeAttributes: any = res.attributes;
	// 					value = allNodeAttributes[searchName].value;
	// 				}
	// 			}				
	// 		});
	// 	}
	// 	return value;
	// }

	// private walkChildrenToFindAttributeInTag(node: TreeNode, inTag: ModelElementTypes, searchName: string): TreeNode | undefined{
	// 	let res;
	// 	if (node.tag.toLowerCase() == inTag.toLowerCase()){
	// 		const allNodeAttributes: any = node.attributes;
	// 		const attrValue = allNodeAttributes[searchName].value;
	// 		if (attrValue){
	// 			res = node;
	// 		}
	// 	} 
		
	// 	if (!res && node.children){
	// 		node.children.forEach(c=>{
	// 			res = this.walkChildrenToFindAttributeInTag(c, inTag, searchName);
	// 		});
	// 	}
	// 	return res;	
	// }

	/* private symbolOrReferenceToXmlNode(symbolOrReference: TreeNode): XmlNode {
		const attributes = symbolOrReference.attributes;
		const attributesSimplified = Object.keys(attributes).
			reduce((result: Record<string, string>, att) => {
				result[att] = attributes[att].name; return result;
			}, {});
		return {
			name: symbolOrReference.tag,
			attributes: attributesSimplified
		};
	} */

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

	public createVirtualChildContext(tag: string) {
		const range = Range.create({ character: 0, line: 0 }, { character: 0, line: 0 });
		const child = newSymbolDeclaration("", tag, ModelElementTypes.Unknown, range, "");
		const nodesForChild = { ...this.nodes, child }; //Create copy and add child
		return new CompletionContext(false, false, nodesForChild, "", this.uri);
	}
}