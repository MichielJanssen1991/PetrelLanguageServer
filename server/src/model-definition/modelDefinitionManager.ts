import { BACKEND_DEFINITION } from './definitions/backend';
import { RULE_DEFINITION } from './definitions/rules';
import { NewDefinition } from './symbolsAndReferences';

export enum ModelFileContext {
	Backend,
	Frontend,
	Rules,
	Infosets,
	Unknown
}

export class ModelDefinitionManager {
	private contextToModelDefinition: Record<ModelFileContext, NewDefinition[]> = { "0": [], "1": [], "2": [], "3": [], "4": [] }

	constructor() {
		this.contextToModelDefinition[ModelFileContext.Backend] = BACKEND_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Rules] = RULE_DEFINITION;
	}

	public getModelDefinition(context: ModelFileContext)
	{
		return this.contextToModelDefinition[context];
	}

	public getModelDefinitionForTag(context: ModelFileContext, tag:string)
	{
		return this.getModelDefinition(context).find(x => x.element == tag);
	}

}