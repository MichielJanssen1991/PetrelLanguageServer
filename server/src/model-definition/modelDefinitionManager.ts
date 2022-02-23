import { BACKEND_DEFINITION } from './definitions/backend';
import { BACKEND_ACTIONS_DEFINITION } from './definitions/backend-actions';
import { FRONTEND_DEFINITION } from './definitions/frontend';
import { INFOSET_DEFINITION } from './definitions/infosets';
import { OTHER_DEFINITION } from './definitions/other';
import { CFORM_DEFINITION } from './definitions/premium-runtime/cform';
import { CONTROLLER_EVENT_DEFINITION } from './definitions/premium-runtime/controllerevent';
import { CQUERY_DEFINITION } from './definitions/premium-runtime/cquery';
import { MODELING_OBJECT_FUNCTION_DEFINITION } from './definitions/premium-runtime/modelingObjects/modeling-object-function';
import { MODELING_OBJECT_INFOSET_DEFINITION } from './definitions/premium-runtime/modelingObjects/modeling-object-infoset';
import { MODELING_OBJECT_RULE_DEFINITION } from './definitions/premium-runtime/modelingObjects/modeling-object-rule';
import { MODELING_OBJECT_TYPE_DEFINITION } from './definitions/premium-runtime/modelingObjects/modeling-object-type';
import { MODELING_OBJECT_VIEW_DEFINITION } from './definitions/premium-runtime/modelingObjects/modeling-object-view';
import { PROFILE_DEFINITION } from './definitions/premium-runtime/profile';
import { RULE_DEFINITION } from './definitions/rules';
import { IXmlNodeContext, Definitions, ModelElementTypes, Definition, TreeNode, ModelElementSubTypes } from './symbolsAndReferences';

export enum ModelFileContext {
	Backend,
	BackendActions,
	Frontend,
	Rules,
	Infosets,
	Unknown,
	Premium_CForm,
	Premium_ControllerEvent,
	Premium_CQuery,
	Premium_Profile,
	Premium_DataConversion,
	Premium_ModelingObject_Infoset,
	Premium_ModelingObject_Rule,
	Premium_ModelingObject_Function,
	Premium_ModelingObject_Type,
	Premium_ModelingObject_View
}

export class ModelDefinitionManager {
	private contextToModelDefinition: Record<ModelFileContext, Definitions> = {
		"0": {}, "1": {}, "2": {}, "3": {},
		"4": {}, "5": {}, "6": {}, "7": {},
		"8": {}, "9": {}, "10": {}, "11": {},
		"12": {}, "13": {}, "14": {}, "15": {}
	}

	constructor() {
		this.contextToModelDefinition[ModelFileContext.Backend] = BACKEND_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Rules] = RULE_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Infosets] = INFOSET_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Frontend] = FRONTEND_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Unknown] = OTHER_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.BackendActions] = BACKEND_ACTIONS_DEFINITION;
		//Premium files
		this.contextToModelDefinition[ModelFileContext.Premium_CForm] = CFORM_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_ControllerEvent] = CONTROLLER_EVENT_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_CQuery] = CQUERY_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_Profile] = PROFILE_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_DataConversion] = PROFILE_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_ModelingObject_Infoset] = MODELING_OBJECT_INFOSET_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_ModelingObject_Rule] = MODELING_OBJECT_RULE_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_ModelingObject_Function] = MODELING_OBJECT_FUNCTION_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_ModelingObject_Type] = MODELING_OBJECT_TYPE_DEFINITION;
		this.contextToModelDefinition[ModelFileContext.Premium_ModelingObject_View] = MODELING_OBJECT_VIEW_DEFINITION;
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
			default: { return definitionsForTag.find(def => this.conditionAndAncestorMatches(modelFileContext, def, nodeContext)); }
		}
	}

	private conditionAndAncestorMatches(modelFileContext: ModelFileContext, def: Definition, nodeContext: IXmlNodeContext): boolean {
		const matchConditionOk = def.matchCondition && nodeContext
			? def.matchCondition(nodeContext)
			: true;
		//TODO: Maybe this condition should be improved to allow for ancestors instead of parents. Or the name should be changed to parent
		const ancestor = this.getFirstNonGroupingElementAncestor(modelFileContext, nodeContext);
		const ancestorOk = def.ancestors ? def.ancestors.some(ancestorDef => this.ancestorMatches(ancestorDef, ancestor)) : true;
		return matchConditionOk && ancestorOk;
	}

	private ancestorMatches(ancestorsDef: any, ancestor?: TreeNode): boolean {
		const ancestorOk = ancestor?.type == (ancestorsDef.type || ModelElementTypes.Unknown)
			&& (ancestorsDef.subtypes ? ancestorsDef.subtypes.includes(ancestor?.subtype) : true);
		return ancestorOk;
	}

	private getFirstNonGroupingElementAncestor(modelFileContext: ModelFileContext, nodeContext: IXmlNodeContext, ancestorIndex = 1): TreeNode | undefined {
		const ancestor = nodeContext.getAncestor(ancestorIndex);
		if (ancestor) {
			const ancestorDefinition = this.getModelDefinitionForTagAndType(modelFileContext, ancestor.tag, ancestor.type);
			if (ancestorDefinition?.isGroupingElement) {
				return this.getFirstNonGroupingElementAncestor(modelFileContext, nodeContext, ancestorIndex + 1);
			} else {
				return ancestor;
			}
		}
	}

	/**
	 * Get the definition for the current treenode
	 * - To be used after parsing the xml model, ambiguities should be resolved during parsing 
	 * @param context the model file context
	 * @param node the tree node
	 * @returns definition for the current node
	 */
	public getModelDefinitionForTreeNode(context: ModelFileContext, node: TreeNode) {
		return this.getModelDefinitionForTagAndType(context, node.tag, node.type, node.subtype);
	}
	/**
	 * Get the definition for the current tag and model element type
	 * - The type is required to distinguish between duplicate tags based on the type
	 * - To be used after parsing the xml model, ambiguities should be resolved during parsing 
	 * @param context the model file context
	 * @param type the model element type
	 * @param subtype optionally the model element subtype
	 * @returns definition for the current node
	 */
	public getModelDefinitionForTagAndType(context: ModelFileContext, tag: string, type: ModelElementTypes, subtype?: ModelElementSubTypes) {
		const definitionsForTag = this.getModelDefinition(context)[tag] || [];
		switch (definitionsForTag.length) {
			case 0: { return; }
			case 1: { return definitionsForTag[0]; }
			default: { return definitionsForTag.find(def => this.tagAndTypeMatches(def, type, subtype)); }
		}
	}

	private tagAndTypeMatches(def: Definition, type: ModelElementTypes, subtype?: ModelElementSubTypes): boolean {
		const typeMatches = ((def.type || ModelElementTypes.Unknown) == type) || type == ModelElementTypes.All;
		const subTypeMatchesOrEmpty = (subtype == undefined) || (def.subtype == subtype) || subtype == ModelElementSubTypes.All;
		return typeMatches && subTypeMatchesOrEmpty;
	}
}