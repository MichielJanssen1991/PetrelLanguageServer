import { ModelDetailLevel, ModelElementTypes, IXmlNodeContext, Definitions, AttributeTypes } from '../symbolsAndReferences';
import { NAMES } from '../constants';
import { action_argument_element, action_output_element, isOutputDeclaration, view_argument_element } from './shared';

//Defines a list of possible refrerences and declarations for each opening tag
export const OTHER_DEFINITION: Definitions =
{
	"rule": [{
		type: ModelElementTypes.Rule,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (nodeContext) => !isProfileRule(nodeContext)
	},
	{
		matchCondition: (nodeContext) => isProfileRule(nodeContext),
		type: ModelElementTypes.Rule,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"infoset": [{
		type: ModelElementTypes.Infoset,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
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
		}]
	}],
	"function": [{
		type: ModelElementTypes.Function,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"type": [{
		type: ModelElementTypes.Type,
		prefixNameSpace: true,
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
		matchCondition: (nodeContext) => !isProfileType(nodeContext)
	},
	{
		matchCondition: (nodeContext) => isProfileType(nodeContext),
		type: ModelElementTypes.Type,
		isReference: true,
		detailLevel: ModelDetailLevel.References
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
	},
	{
		matchCondition: (nodeContext) => isProfileView(nodeContext),
		type: ModelElementTypes.View,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"argument": [view_argument_element,	action_argument_element],
	"input": [{
		type: ModelElementTypes.Input,
		attributes: [
			{
				name: "required",
				detailLevel: ModelDetailLevel.Declarations
			}
		],
		detailLevel: ModelDetailLevel.Declarations
	}],
	"module": [{
		type: ModelElementTypes.NameSpace,
		detailLevel: ModelDetailLevel.Declarations,
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
		detailLevel: ModelDetailLevel.Declarations
	}],
	"output": [{
		matchCondition: (nodeContext) => isOutputDeclaration(nodeContext),
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.Declarations
	},
	action_output_element],
	"variable": [{
		matchCondition: (nodeContext) => isInfosetOutput(nodeContext),
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.Declarations,
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
	}],
	"action": [{
		matchCondition: (nodeContext: IXmlNodeContext) => isActionDefinition(nodeContext),
		type: ModelElementTypes.Action,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	},
	{
		type: ModelElementTypes.Action,
		isReference: true,
		detailLevel: ModelDetailLevel.References,
		matchCondition: (nodeContext: IXmlNodeContext) => !isActionDefinition(nodeContext) && !isModelCheckRuleAction(nodeContext),
		attributes: [{
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
	}],
	"search": [{
		type: ModelElementTypes.TypeFilter,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (nodeContext) => isFilterDeclaration(nodeContext)
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
		}]
	}],
	"set-aggregate-query": [{
		type: ModelElementTypes.Aggregate,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"include-block": [{
		type: ModelElementTypes.IncludeBlock,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"include-block1": [{
		type: ModelElementTypes.IncludeBlock,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"decorator": [{
		type: ModelElementTypes.Decorator,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"decoration": [{
		type: ModelElementTypes.Decorator,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"include": [{
		name: (x) => x.attributes.block,
		type: ModelElementTypes.IncludeBlock,
		isReference: true,
		detailLevel: ModelDetailLevel.References,
	}],
	"profile": [{
		type: ModelElementTypes.Profile,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	// ---------- Premium tags ----------
	"ProfileType": [{
		name: (x) => x.attributes.TypeName,
		type: ModelElementTypes.Type,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"ProfileView": [{
		name: (x) => x.attributes.ViewName,
		type: ModelElementTypes.View,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"ProfileRule": [{
		name: (x) => x.attributes.RuleName,
		type: ModelElementTypes.Rule,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"DataConversion": [{
		name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_DATACONVERSION_RULENAME])),
		type: ModelElementTypes.Rule,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"Types": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"CForms": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"Views": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"ControllerEvents": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"Functions": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"Function": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"Rules": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"Rule": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"CQueries": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"Infosets": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"Infoset": [{
		type: ModelElementTypes.Unknown,
		detailLevel: ModelDetailLevel.Declarations
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
	return ("infoset" == nodeContext.getFirstParent().name);
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
	return !(nodeContext.getFirstParent().name == "action") && (nodeContext.getCurrentXmlNode().attributes.name != undefined);
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