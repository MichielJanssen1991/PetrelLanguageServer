import { BACKEND_DEFINITION } from './definitions/backend';
import { BACKEND_ACTIONS_DEFINITION } from './definitions/backend-actions';
import { FRONTEND_DEFINITION } from './definitions/frontend';
import { INFOSET_DEFINITION } from './definitions/infosets';
import { OTHER_DEFINITION } from './definitions/other';
import { RULE_DEFINITION } from './definitions/rules';
import { IXmlNodeContext, Definitions, ModelElementTypes } from './symbolsAndReferences';

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
	 * - To be used when parsing the model
	 * @param modelFileContext the model file context
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

	/**
	 * Get the definition for the current tag and model element type
	 * - The type is required to distinguish between duplicate tags based on the type
	 * - To be used after parsing the xml model, ambiguities should be resolved during parsing 
	 * @param modelFileContext the model file context
	 * @param type the model element type
	 * @returns definition for the current node
	 */
	public getModelDefinitionForTagAndType(context: ModelFileContext, tag: string, type: ModelElementTypes) {
		const definitionsForTag = this.getModelDefinition(context)[tag] || [];
		return definitionsForTag.find(def => (def.type == type)||type==ModelElementTypes.All);
	}
}