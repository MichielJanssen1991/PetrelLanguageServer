import { BACKEND_DEFINITION } from './backend';
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
	}

	public getModelDefinition(context: ModelFileContext)
	{
		return this.contextToModelDefinition[context];
	}

}