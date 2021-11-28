import { Attribute, IsSymbolOrReference, ModelElementTypes, Reference, SymbolOrReference } from '../model-definition/symbolsAndReferences';

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
export class CompletionContext {
	public inAttribute: boolean;
	public inTag: boolean;
	public nodes: SymbolOrReference[];
	public word: string;
	public uri: string;
	public attribute?: Reference | Attribute;

	constructor(inAttribute: boolean, inTag: boolean, nodes: SymbolOrReference[], word: string, uri: string, attribute?: Reference | Attribute) {
		this.inAttribute = inAttribute;
		this.inTag = inTag;
		this.nodes = nodes;
		this.word = word;
		this.uri = uri;
		this.attribute = attribute;
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
}