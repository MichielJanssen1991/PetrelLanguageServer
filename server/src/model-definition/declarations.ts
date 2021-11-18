import { ModelDetailLevel, ModelElementTypes, Definition, INodeContext } from './symbolsAndReferences';
import { NAMES } from './constants';

//Define what declarations are possible for each opening tag
export const symbolDeclarationDefinitions: Record<string, Definition[]> =
{
	"rule": [{
		type: ModelElementTypes.Rule,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (x, nodeContext) => !isProfileRule(nodeContext)
	}],
	"infoset": [{
		type: ModelElementTypes.Infoset,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"searchcolumn": [{
		type: ModelElementTypes.SearchColumn,
		detailLevel: ModelDetailLevel.Declarations,
		attributeReferences: [{
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
		attributeReferences: [
			{
				attribute: "type",
				type: ModelElementTypes.Type,
				detailLevel: ModelDetailLevel.References
			}
		],
		matchCondition: (x, nodeContext) => !isProfileType(nodeContext)
	}],
	"view": [{
		type: ModelElementTypes.View,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (x, nodeContext) => isViewDeclaration(x, nodeContext) && !isProfileView(nodeContext),
		attributeReferences: [
			{
				attribute: "view",
				type: ModelElementTypes.View,
				detailLevel: ModelDetailLevel.References,
			}
		],
	}],
	"argument": [{
		name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
		type: ModelElementTypes.Input,
		detailLevel: ModelDetailLevel.Declarations,
		matchCondition: (x, nodeContext) => isViewArgument(nodeContext)
	}],
	"input": [{
		type: ModelElementTypes.Input,
		otherAttributes: {
			"required": (x, nodeContext) => (x.attributes[NAMES.ATTRIBUTE_REQUIRED] == 'yes')
		},
		detailLevel: ModelDetailLevel.Declarations
	}],
	"module": [{
		name: ((x: any) => x.attributes["target-namespace"]),
		type: ModelElementTypes.NameSpace,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"attribute": [{
		type: ModelElementTypes.Attribute,
		otherAttributes: {
			"required": (x, nodeContext) => (x.attributes[NAMES.ATTRIBUTE_REQUIRED] == 'yes'),
			"readonly": (x, nodeContext) => x.attributes[NAMES.ATTRIBUTE_READONLY]
		},
		detailLevel: ModelDetailLevel.Declarations
	}],
	"output": [{
		matchCondition: (x, nodeContext) => isOutputDeclaration(nodeContext),
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"variable": [{
		matchCondition: (x, nodeContext) => isInfosetOutput(nodeContext),
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.Declarations,
		attributeReferences: [
			{
				attribute: "attribute",
				type: ModelElementTypes.Attribute,
				detailLevel: ModelDetailLevel.ArgumentReferences
			}
		],
	}],
	"action": [{
		matchCondition: (x: any, nodeContext: INodeContext) => isActionDefinition(nodeContext),
		type: ModelElementTypes.Action,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
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
		attributeReferences: [{
			attribute: NAMES.ATTRIBUTE_TYPE,
			type: ModelElementTypes.Type,
			detailLevel: ModelDetailLevel.Declarations
		}]
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
	"profile": [{
		type: ModelElementTypes.Profile,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	}],
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

export function isViewDeclaration(x: any, nodeContext: INodeContext): boolean {
	return !(nodeContext.getFirstParent().name == "action") && (x.attributes.name != undefined);
}

export const objectsTypesWhichRequireContext = new Set([
	ModelElementTypes.Input,
	ModelElementTypes.Output,
	ModelElementTypes.SearchColumn,
	ModelElementTypes.Search,
	ModelElementTypes.Attribute
]);