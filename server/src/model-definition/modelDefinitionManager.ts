import { XmlNode } from '../file-analyzer/parser/saxParserExtended';
import { BACKEND_DEFINITION } from './definitions/backend';
import { BACKEND_ACTIONS_DEFINITION } from './definitions/backend-actions';
import { FRONTEND_DEFINITION } from './definitions/frontend';
import { INFOSET_DEFINITION } from './definitions/infosets';
import { OTHER_DEFINITION } from './definitions/other';
import { RULE_DEFINITION } from './definitions/rules';
import { IXmlNodeContext, Definitions, ModelElementTypes, Definition } from './symbolsAndReferences';

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
		switch (definitionsForTag.length) {
			case 0: { return; }
			case 1: { return definitionsForTag[0]; }
			default: { return definitionsForTag.find(def => this.conditionMatches(modelFileContext, def, nodeContext));	}
		}
	}

	private conditionMatches(modelFileContext: ModelFileContext, def: Definition, nodeContext: IXmlNodeContext): unknown {
		const matchConditionOk = def.matchCondition && nodeContext
			? def.matchCondition(nodeContext)
			: true;
		//TODO: Maybe this condition should be improved to allow for ancestors instead of parents. Or the name should be changed to parent
		const ancestorOk = def.ancestor ? this.getFirstNonGroupingElementAncestor(modelFileContext, nodeContext)?.type == def.ancestor : true;
		return matchConditionOk && ancestorOk;
	}

	private getFirstNonGroupingElementAncestor(modelFileContext: ModelFileContext, nodeContext: IXmlNodeContext, ancestorIndex = 1): XmlNode | undefined {
		const ancestor = nodeContext.getAncestor(ancestorIndex);
		if (ancestor) {
			const ancestorDefinition = this.getModelDefinitionForTagAndType(modelFileContext, ancestor.name, ancestor.type);
			if (ancestorDefinition?.isGroupingElement) {
				return this.getFirstNonGroupingElementAncestor(modelFileContext, nodeContext, ancestorIndex + 1);
			} else {
				return ancestor;
			}
		}
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
		switch (definitionsForTag.length) {
			case 0: { return; }
			case 1: { return definitionsForTag[0]; }
			default: { return definitionsForTag.find(def => (def.type == type) || type == ModelElementTypes.All);	}
		}
	}
}