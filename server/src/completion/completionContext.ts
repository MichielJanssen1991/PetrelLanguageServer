import { ModelElementTypes, SymbolOrReference } from '../model-definition/symbolsAndReferences';

//@Koos: Ik verwacht dat context.getPredecessorOfType(ModelElementTypes.Rule) het ruleDefinition object zou teruggeven
export class CompletionContext {
	public inAttribute: boolean;
	public inTag: boolean;
	public nodes: SymbolOrReference[];
	public word: string;
	public uri: string;
	public attribute?: string;

	constructor(inAttribute: boolean, inTag: boolean, nodes: SymbolOrReference[], word: string, uri: string) {
		this.inAttribute = inAttribute;
		this.inTag = inTag;
		this.nodes = nodes;
		this.word = word;
		this.uri = uri;
	}

	//Returns the first predecessor of the given type
	public getPredecessorOfType(type:ModelElementTypes)
	{
		this.nodes.reverse().find(node=> node.type = type);
	}
}