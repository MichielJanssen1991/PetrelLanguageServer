import { NAMES } from '../constants';
import { AttributeTypes, Definitions, IXmlNodeContext, ModelDetailLevel, ModelElementTypes } from '../symbolsAndReferences';

//Defines a list of possible refrerences and declarations for each opening tag
export const OTHER_DEFINITION: Definitions =
{
	"action": [
	{
		type: ModelElementTypes.ActionCall,
		detailLevel: ModelDetailLevel.References,
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
	return nodeContext.hasParentTag("actions");
}

export function isFilterDeclaration(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.hasParentTag("filters") || nodeContext.hasParentTag("virtual-filter");
}

export function isProfileType(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.hasParentTag("profile") || nodeContext.hasParentTag("include-block") || nodeContext.hasParentTag("include-block2");
}

export function isProfileRule(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.hasParentTag("profile") || nodeContext.hasParentTag("include-block") || nodeContext.hasParentTag("include-block2");
}

export function isProfileView(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.hasParentTag("profile") || nodeContext.hasParentTag("include-block") || nodeContext.hasParentTag("include-block2");
}

export function isModelCheckRuleAction(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.hasParentTag("xml-rules");
}

export function isViewDeclaration(nodeContext: IXmlNodeContext): boolean {
	return !(nodeContext.getParent()?.tag == "action" || nodeContext.getParent()?.tag == "view");
}

export function isViewControl(nodeContext: IXmlNodeContext, controlType: string): boolean {
	return (nodeContext.getCurrentXmlNode().attributes.control?.toLowerCase() || "") == controlType.toLowerCase();
}

export function isIncludeBlockOfType(nodeContext: IXmlNodeContext, metaType: string): boolean {
	return (nodeContext.getCurrentXmlNode().attributes["meta-name"]?.toLowerCase() == metaType?.toLowerCase() || nodeContext.getCurrentXmlNode().attributes["meta-index"]?.toLowerCase() == metaType?.toLowerCase());
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