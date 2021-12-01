import { XmlNode } from '../file-analyzer/parser/saxParserExtended';
import { Attribute, INodeContext, IsSymbolOrReference, ModelElementTypes, Reference, SymbolOrReference } from '../model-definition/symbolsAndReferences';

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

//@Koos: Ik verwacht dat context.getPredecessorOfType(ModelElementTypes.Rule) het ruleDefinition object zou teruggeven
export class CompletionContext implements INodeContext {
	public inAttribute: boolean;
	public inTag: boolean;
	public nodes: SymbolOrReference[];
	public word: string;
	public uri: string;
	public attribute?: Reference | Attribute;
	public get numberOfNodes(): number {
		return this.nodes.length;
	}

	public get currentNode(): SymbolOrReference | undefined {
		return this.numberOfNodes > 0 ? this.nodes[this.numberOfNodes - 1] : undefined;
	}

	constructor(inAttribute: boolean, inTag: boolean, nodes: SymbolOrReference[], word: string, uri: string, attribute?: Reference | Attribute) {
		this.inAttribute = inAttribute;
		this.inTag = inTag;
		this.nodes = nodes;
		this.word = word;
		this.uri = uri;
		this.attribute = attribute;
	}

	// INodeContext methods
	public getFirstParent() {
		if (this.numberOfNodes > 2) {
			const parentNode = this.nodes[this.numberOfNodes - 2];
			return this.symbolOrReferenceToXmlNode(parentNode);
		}
	}

	public hasParentTag(name: string) {
		return this.nodes.some(node => node.name == name);
	}

	public getCurrentNode() {
		return this.getXmlNode();
	}

	public getXmlNode() {
		return this.symbolOrReferenceToXmlNode(this.nodes[this.numberOfNodes - 1]);
	}

	private symbolOrReferenceToXmlNode(symbolOrReference: SymbolOrReference): XmlNode {
		const attributeReferences = symbolOrReference.attributeReferences;
		const attributes1 = Object.keys(attributeReferences).
			reduce((result: Record<string, string>, att) => {
				result[att] = attributeReferences[att].name; return result;
			}, {});
		const otherAttributes = symbolOrReference.otherAttributes;
		const attributes2 = Object.keys(otherAttributes).
			reduce((result: Record<string, string>, att) => {
				result[att] = otherAttributes[att].name; return result;
			}, {});
		return {
			name: symbolOrReference.tag,
			attributes: { ...attributes1, ...attributes2 }
		};
	}

	//Returns the first predecessor of the given type
	public getPredecessorOfType(type: ModelElementTypes, symbolOrReference: IsSymbolOrReference) {
		return this.nodes.reverse().find(node => node.type == type && node.objectType == symbolOrReference);
	}

	public getRuleContext() {
		const ruleDefinition = this.getPredecessorOfType(ModelElementTypes.Rule, IsSymbolOrReference.Symbol);
		if (ruleDefinition) {
			const rulename = ruleDefinition.name;
			const params = this.findNames(ruleDefinition.children, [ModelElementTypes.Output, ModelElementTypes.Input, ModelElementTypes.SetVar]);
			return { name: rulename, availableParams: params };
		}
		else {
			return undefined;
		}
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

	public createChildContext(child: SymbolOrReference) {
		const nodesForChild = { ...this.nodes, child }; //Create copy and add child
		return new CompletionContext(false, false, nodesForChild, "", this.uri);
	}
}