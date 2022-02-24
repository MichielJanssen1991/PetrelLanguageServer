import { NAMES } from '../constants';
import { AttributeTypes, Definitions, IXmlNodeContext, MatchDefinition, ModelDetailLevel, ModelElementTypes } from '../symbolsAndReferences';

//Defines a list of possible refrerences and declarations for each opening tag
export const OTHER_DEFINITION: Definitions =
{
	"action": [{
		matchCondition: {
			matchFunction: (nodeContext: IXmlNodeContext) => isActionDefinition(nodeContext),
		},
		type: ModelElementTypes.Action,
		attributes: [],
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		children: []
	},
	{
		type: ModelElementTypes.ActionCall,
		detailLevel: ModelDetailLevel.References,
		matchCondition: {
			matchFunction: (nodeContext: IXmlNodeContext) => !isActionDefinition(nodeContext) && !isModelCheckRuleAction(nodeContext),
		},
		attributes: [{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Action,
			},
			detailLevel: ModelDetailLevel.References,
			name: NAMES.ATTRIBUTE_NAME
		}, {
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
			detailLevel: ModelDetailLevel.References,
			name: NAMES.ATTRIBUTE_RULE
		},
		{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
			detailLevel: ModelDetailLevel.References,
			name: NAMES.ATTRIBUTE_ONERRORRULE
		},
		{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Infoset,
			},
			detailLevel: ModelDetailLevel.References,
			name: NAMES.ATTRIBUTE_INFOSET
		},
		{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Function,
			},
			detailLevel: ModelDetailLevel.References,
			name: NAMES.ATTRIBUTE_FUNCTION
		},
		{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Type,
			},
			detailLevel: ModelDetailLevel.References,
			name: NAMES.ATTRIBUTE_TYPE
		}],
		children: []
	}]
};

export function isActionDefinition(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.hasAncestorTag("actions");
}

export function isModelCheckRuleAction(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.hasAncestorTag("xml-rules");
}

export function isViewControl(nodeContext: IXmlNodeContext, controlType: string): boolean {
	return (nodeContext.getCurrentXmlNode().attributes.control?.toLowerCase() || "") == controlType.toLowerCase();
}

export function isIncludeBlockOfType(nodeContext: IXmlNodeContext, metaType: string): boolean {
	return (nodeContext.getCurrentXmlNode().attributes["meta-name"]?.toLowerCase() == metaType?.toLowerCase() || nodeContext.getCurrentXmlNode().attributes["meta-index"]?.toLowerCase() == metaType?.toLowerCase());
}

export function combineMatchConditions(condition1: MatchDefinition | undefined, condition2: MatchDefinition | undefined): MatchDefinition {
	const ancestors = [...(condition1?.ancestors || []), ...(condition2?.ancestors || [])];
	const matchFunction = (nodeContext: IXmlNodeContext) =>
		(condition1?.matchFunction ? condition1.matchFunction(nodeContext) : true)
		&& (condition2?.matchFunction ? condition2.matchFunction(nodeContext) : true);
	return { ancestors, matchFunction };
}

//Objects which can be referenced without requiring the context
export const standaloneObjectTypes = new Set([
	ModelElementTypes.View,
	ModelElementTypes.Infoset,
	ModelElementTypes.Type,
	ModelElementTypes.Function,
	ModelElementTypes.Rule,
	ModelElementTypes.Decorator,
	ModelElementTypes.IncludeBlock,
	ModelElementTypes.Action,
	ModelElementTypes.NameSpace,
	ModelElementTypes.Profile
]);