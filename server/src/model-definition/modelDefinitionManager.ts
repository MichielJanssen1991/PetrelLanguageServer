import { BACKEND_DEFINITION } from './definitions/backend';
import { BACKEND_ACTIONS_DEFINITION } from './definitions/backend-actions';
import { FRONTEND_DEFINITION } from './definitions/frontend';
import { INFOSET_DEFINITION } from './definitions/infosets';
import { OTHER_DEFINITION } from './definitions/other';
import { RULE_DEFINITION } from './definitions/rules';
import { IXmlNodeContext, Definitions } from './symbolsAndReferences';

export enum ModelFileContext {
	Backend,
	BackendActions,
	Frontend,
	Rules,
	Infosets,
	Unknown
}

export class ModelDefinitionManager {
	private contextToModelDefinition: Record<ModelFileContext, Definitions> = { "0": {}, "1": {}, "2": {}, "3": {}, "4": {}, "5": {} }

	constructor() {
		this.contextToModelDefinition[ModelFileContext.Backend] = BACKEND_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Rules] = RULE_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Infosets] = INFOSET_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Frontend] = FRONTEND_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Unknown] = OTHER_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.BackendActions] = BACKEND_ACTIONS_DEFINITION;
	}

	public getModelDefinition(context: ModelFileContext) {
		return this.contextToModelDefinition[context];
	}

	/**
	 * Get the definition for the current tag in the current xml node
	 * - The nodeContext is required to distinguish between duplicate tags based on the matchCondition
	 * @param modelFileContext 
	 * @param nodeContext the current nodeContext 
	 * @returns definition for the current node
	 */
	public getModelDefinitionForCurrentNode(modelFileContext: ModelFileContext, nodeContext: IXmlNodeContext) {
		const definitionsForTag = this.getModelDefinition(modelFileContext)[nodeContext.getCurrentXmlNode().name] || [];
		return definitionsForTag.find(def =>
			def.matchCondition && nodeContext
				? def.matchCondition(nodeContext)
				: true
		);
	}

	//Should be removed later (context will always be required to distinguish between some tags)
	public getModelDefinitionForTagWithoutContext(context: ModelFileContext, tag: string) {
		const definitionsForTag = this.getModelDefinition(context)[tag] || [];
		return definitionsForTag.find(def => true);
	}
}