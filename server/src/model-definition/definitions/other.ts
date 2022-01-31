import { ModelDetailLevel, ModelElementTypes, IXmlNodeContext, Definitions, AttributeTypes } from '../symbolsAndReferences';
import { NAMES } from '../constants';
import { action_argument_element, action_call_output_element, dev_comment_attribute, isOutputDeclaration, view_argument_element } from './shared';

//Defines a list of possible refrerences and declarations for each opening tag
export const OTHER_DEFINITION: Definitions =
{
	"rule": [{
		type: ModelElementTypes.Rule,
		attributes: [dev_comment_attribute],
		prefixNameSpace: true,
		isSymbolDeclaration: true,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (nodeContext) => !isProfileRule(nodeContext),
		childs: []
	},
	{
		matchCondition: (nodeContext) => isProfileRule(nodeContext),
		type: ModelElementTypes.Rule,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.References,
		childs: []
	}],
	"infoset": [{
		type: ModelElementTypes.Infoset,
		attributes: [dev_comment_attribute],
		isSymbolDeclaration: true,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"searchcolumn": [{
		type: ModelElementTypes.SearchColumn,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [{
			name: "name",
			detailLevel: ModelDetailLevel.References,
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Attribute,
			},
		},
		{
			name: "rule",
			detailLevel: ModelDetailLevel.References,
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
		}],
		childs: []
	}],
	"in": [{
		type: ModelElementTypes.In,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"function": [{
		type: ModelElementTypes.Function,
		attributes: [dev_comment_attribute],
		prefixNameSpace: true,
		isSymbolDeclaration: true,
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"type": [{
		type: ModelElementTypes.Type,
		prefixNameSpace: true,
		isSymbolDeclaration: true,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "type",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type,
				},
				detailLevel: ModelDetailLevel.References
			}
		],
		matchCondition: (nodeContext) => !isProfileType(nodeContext),
		childs: []
	},
	{
		matchCondition: (nodeContext) => isProfileType(nodeContext),
		type: ModelElementTypes.Type,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.References,
		childs: []
	}],
	"view": [{
		type: ModelElementTypes.View,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (nodeContext) => isViewDeclaration(nodeContext) && !isProfileView(nodeContext),
		attributes: [
			{
				name: "view",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.View,
				},
				detailLevel: ModelDetailLevel.References,
			}
		],
		childs: []
	},
	{
		matchCondition: (nodeContext) => isProfileView(nodeContext),
		type: ModelElementTypes.View,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.References,
		childs: []
	}],
	"argument": [view_argument_element, action_argument_element],
	"input": [{
		type: ModelElementTypes.Input,
		isSymbolDeclaration: true,
		attributes: [
			{
				name: "required",
				detailLevel: ModelDetailLevel.Declarations
			}
		],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"module": [{
		isGroupingElement: true,
		type: ModelElementTypes.Module,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"attribute": [{
		type: ModelElementTypes.Attribute,
		attributes: [
			{
				name: "required",
				detailLevel: ModelDetailLevel.Declarations
			},
			{
				name: "readonly",
				detailLevel: ModelDetailLevel.Declarations
			}
		],
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		childs: []
	}],
	"output": [{
		matchCondition: (nodeContext) => isOutputDeclaration(nodeContext),
		type: ModelElementTypes.Output,
		isSymbolDeclaration: true,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	},
		action_call_output_element],
	"variable": [{
		matchCondition: (nodeContext) => isInfosetOutput(nodeContext),
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		attributes: [
			{
				name: "attribute",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute,
				},
				detailLevel: ModelDetailLevel.SubReferences
			}
		],
		childs: []
	}],
	"action": [{
		matchCondition: (nodeContext: IXmlNodeContext) => isActionDefinition(nodeContext),
		type: ModelElementTypes.Action,
		attributes: [dev_comment_attribute],
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		childs: []
	},
	{
		type: ModelElementTypes.ActionCall,
		detailLevel: ModelDetailLevel.References,
		matchCondition: (nodeContext: IXmlNodeContext) => !isActionDefinition(nodeContext) && !isModelCheckRuleAction(nodeContext),
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
		childs: []
	}],
	"search": [{
		type: ModelElementTypes.TypeFilter,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (nodeContext) => isFilterDeclaration(nodeContext),
		childs: []
	},
	{
		type: ModelElementTypes.Search,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (nodeContext) => !isFilterDeclaration(nodeContext),
		attributes: [{
			name: NAMES.ATTRIBUTE_TYPE,
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Type,
			},
			detailLevel: ModelDetailLevel.Declarations
		}],
		childs: []
	}],
	"set-aggregate-query": [{
		type: ModelElementTypes.Aggregate,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"include-block": [{
		type: ModelElementTypes.IncludeBlock,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		childs: []
	}],
	"include-block1": [{
		type: ModelElementTypes.IncludeBlock,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		childs: []
	}],
	"decorator": [{
		type: ModelElementTypes.Decorator,
		attributes: [dev_comment_attribute],
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		childs: []
	}],
	"decoration": [{
		type: ModelElementTypes.Decorator,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.References,
		childs: []
	}],
	"include": [{
		name: (x) => x.attributes.block,
		type: ModelElementTypes.IncludeBlock,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.References,
		childs: []
	}],
	"profile": [{
		type: ModelElementTypes.Profile,
		attributes: [dev_comment_attribute],
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		childs: []
	}],
	// ---------- Premium tags ----------
	"ProfileType": [{
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Type,
			},
			detailLevel: ModelDetailLevel.References,
			name: "TypeName"
		}],
		childs: []
	}],
	"ProfileView": [{
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.View,
			},
			detailLevel: ModelDetailLevel.References,
			name: "ViewName"
		}],
		childs: []
	}],
	"ProfileRule": [{
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
			detailLevel: ModelDetailLevel.References,
			name: "RuleName"
		}],
		childs: []
	}],
	"DataConversion": [{
		type: ModelElementTypes.Rule,
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
			detailLevel: ModelDetailLevel.References,
			name: "RuleName"
		}],
		childs: []
	}],
	"Types": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"CForms": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"Views": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"ControllerEvents": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"Functions": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"Function": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"Rules": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"Rule": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"CQueries": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"Infosets": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}],
	"Infoset": [{
		type: ModelElementTypes.Unknown,
		attributes: [dev_comment_attribute],
		detailLevel: ModelDetailLevel.Declarations,
		childs: []
	}]
};

const nonPetrelModelTags = new Set(
	["ProfileType", "ProfileView", "ProfileRule", "DataConversion",
		"Types", "CForms", "Views", "ControllerEvents", "Functions",
		"Function", "Rules", "Rule", "CQueries", "Infosets", "Infoset"]
);
export function isNonPetrelModelTag(tagName: string) {
	return nonPetrelModelTags.has(tagName);
}






export function isInfosetOutput(nodeContext: IXmlNodeContext): boolean {
	return ("infoset" == nodeContext.getFirstParent()?.name);
}

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
	return !(nodeContext.getFirstParent()?.name == "action" || nodeContext.getFirstParent()?.name == "view");
}

export function isViewControl(nodeContext: IXmlNodeContext, controlType: string): boolean {
	return (nodeContext.getCurrentXmlNode().attributes.control?.toLowerCase() || "") == controlType.toLowerCase();
}

export function isIncludeBlockOfType(nodeContext: IXmlNodeContext, metaType: string): boolean {
	return (nodeContext.getCurrentXmlNode().attributes["meta-name"] == metaType || nodeContext.getCurrentXmlNode().attributes["meta-info"] == metaType);
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