import { ModelDetailLevel, ModelElementTypes, Definition, INodeContext } from './symbolsAndReferences';
import { NAMES } from './constants';

//Defines a list of possible refrerences and declarations for each opening tag
export const definitionsPerTag: Record<string, Definition[]> =
{
	"rule": [{
		type: ModelElementTypes.Rule,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (x, nodeContext) => !isProfileRule(nodeContext)
	},
	{
		matchCondition: (x, nodeContext) => isProfileRule(nodeContext),
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
			attribute: "name",
			type: ModelElementTypes.Attribute,
			detailLevel: ModelDetailLevel.References,
		},
		{
			attribute: "rule",
			type: ModelElementTypes.Rule,
			detailLevel: ModelDetailLevel.References,
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
				attribute: "type",
				type: ModelElementTypes.Type,
				detailLevel: ModelDetailLevel.References
			}
		],
		matchCondition: (x, nodeContext) => !isProfileType(nodeContext)
	},
	{
		matchCondition: (x, nodeContext) => isProfileType(nodeContext),
		type: ModelElementTypes.Type,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"view": [{
		type: ModelElementTypes.View,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (x, nodeContext) => isViewDeclaration(x, nodeContext) && !isProfileView(nodeContext),
		attributes: [
			{
				attribute: "view",
				type: ModelElementTypes.View,
				detailLevel: ModelDetailLevel.References,
			}
		],
	},
	{
		matchCondition: (x, nodeContext) => isProfileView(nodeContext),
		type: ModelElementTypes.View,
		isReference: true,
		detailLevel: ModelDetailLevel.References
	}],
	"argument": [{
		name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
		type: ModelElementTypes.Input,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (x, nodeContext) => isViewArgument(nodeContext)
	},
	{
		name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
		type: ModelElementTypes.Input,
		isReference: true,
		detailLevel: ModelDetailLevel.SubReferences,
		matchCondition: (x, nodeContext) => !isViewArgument(nodeContext)
	}],
	"input": [{
		type: ModelElementTypes.Input,
		attributes: [
			{
				attribute: "required",
				type: ModelElementTypes.Value,
				detailLevel: ModelDetailLevel.Declarations
			}
		],
		detailLevel: ModelDetailLevel.Declarations
	}],
	"module": [{
		name: ((x: any) => x.attributes["target-namespace"]),
		type: ModelElementTypes.NameSpace,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"attribute": [{
		type: ModelElementTypes.Attribute,
		attributes: [
			{
				attribute: "required",
				type: ModelElementTypes.Value,
				detailLevel: ModelDetailLevel.Declarations
			},
			{
				attribute: "readonly",
				type: ModelElementTypes.Value,
				detailLevel: ModelDetailLevel.Declarations
			}
		],
		detailLevel: ModelDetailLevel.Declarations
	}],
	"output": [{
		matchCondition: (x, nodeContext) => isOutputDeclaration(nodeContext),
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.Declarations
	},
	{
		name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
		matchCondition: (x, nodeContext) => !isOutputDeclaration(nodeContext),
		type: ModelElementTypes.Output,
		isReference: true,
		detailLevel: ModelDetailLevel.SubReferences
	}],
	"variable": [{
		matchCondition: (x, nodeContext) => isInfosetOutput(nodeContext),
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				attribute: "attribute",
				type: ModelElementTypes.Attribute,
				detailLevel: ModelDetailLevel.SubReferences
			}
		],
	}],
	"action": [{
		matchCondition: (x: any, nodeContext: INodeContext) => isActionDefinition(nodeContext),
		type: ModelElementTypes.Action,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	},
	{
		type: ModelElementTypes.Action,
		isReference: true,
		detailLevel: ModelDetailLevel.References,
		matchCondition: (x: any, nodeContext: INodeContext) => !isActionDefinition(nodeContext) && !isModelCheckRuleAction(nodeContext),
		attributes: [{
			type: ModelElementTypes.Rule,
			detailLevel: ModelDetailLevel.References,
			attribute: NAMES.ATTRIBUTE_RULE
		},
		{
			type: ModelElementTypes.Rule,
			detailLevel: ModelDetailLevel.References,
			attribute: NAMES.ATTRIBUTE_ONERRORRULE
		},
		{
			type: ModelElementTypes.Infoset,
			detailLevel: ModelDetailLevel.References,
			attribute: NAMES.ATTRIBUTE_INFOSET
		},
		{
			type: ModelElementTypes.Function,
			detailLevel: ModelDetailLevel.References,
			attribute: NAMES.ATTRIBUTE_FUNCTION
		},
		{
			type: ModelElementTypes.Type,
			detailLevel: ModelDetailLevel.References,
			attribute: NAMES.ATTRIBUTE_TYPE
		},
		{
			type: ModelElementTypes.Value,
			detailLevel: ModelDetailLevel.References,
			attribute: "FrontendBackend"
		}],
	}],
	"search": [{
		type: ModelElementTypes.TypeFilter,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (x, nodeContext) => isFilterDeclaration(nodeContext)
	},
	{
		type: ModelElementTypes.Search,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (x, nodeContext) => !isFilterDeclaration(nodeContext),
		attributes: [{
			attribute: NAMES.ATTRIBUTE_TYPE,
			type: ModelElementTypes.Type,
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


export function isViewArgument(nodeContext: INodeContext): boolean {
	return nodeContext.getFirstParent().name == "view";
}

export function isOutputDeclaration(nodeContext: INodeContext): boolean {
	return (["rule", "infoset", "function"].includes(nodeContext.getFirstParent().name))
		|| (nodeContext.getFirstParent().name == "action" && nodeContext.hasParentTag("actions"));
}

export function isInfosetOutput(nodeContext: INodeContext): boolean {
	return ("infoset" == nodeContext.getFirstParent().name);
}

export function isActionDefinition(nodeContext: INodeContext): boolean {
	return nodeContext.hasParentTag("actions");
}

export function isFilterDeclaration(nodeContext: INodeContext): boolean {
	return nodeContext.hasParentTag("filters") || nodeContext.hasParentTag("virtual-filter");
}

export function isProfileType(nodeContext: INodeContext): boolean {
	return nodeContext.hasParentTag("profile") || nodeContext.hasParentTag("include-block") || nodeContext.hasParentTag("include-block2");
}

export function isProfileRule(nodeContext: INodeContext): boolean {
	return nodeContext.hasParentTag("profile") || nodeContext.hasParentTag("include-block") || nodeContext.hasParentTag("include-block2");
}

export function isProfileView(nodeContext: INodeContext): boolean {
	return nodeContext.hasParentTag("profile") || nodeContext.hasParentTag("include-block") || nodeContext.hasParentTag("include-block2");
}

export function isModelCheckRuleAction(nodeContext: INodeContext): boolean {
	return nodeContext.hasParentTag("xml-rules");
}

export function isViewDeclaration(x: any, nodeContext: INodeContext): boolean {
	return !(nodeContext.getFirstParent().name == "action") && (x.attributes.name != undefined);
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