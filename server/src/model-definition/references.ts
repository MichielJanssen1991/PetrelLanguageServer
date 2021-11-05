import { ModelDetailLevel, ModelElementTypes, Definition, INodeContext } from './symbolsAndReferences';
import { NAMES } from './attributes';
import { isActionDefinition, isOutputDeclaration, isProfileType, isViewArgument, isProfileRule, isProfileView } from './declarations';

//Define what references are possible for each opening tag
export const referenceDefinitions: Record<string, Definition[]> =
{
	"action": [{
		type: ModelElementTypes.Action,
		detailLevel: ModelDetailLevel.References,
		matchCondition: (x: any, nodeContext: INodeContext) => !isActionDefinition(nodeContext),
		attributeReferences: [{
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
		}],
		otherAttributes: { "FrontendBackend": (x, nodeContext) => frontendOrBackendActionCall(nodeContext) }
	}],
	"argument": [{
		name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
		type: ModelElementTypes.Input,
		detailLevel: ModelDetailLevel.ArgumentReferences,
		matchCondition: (x, nodeContext) => !isViewArgument(nodeContext)
	}],
	"output": [{
		name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
		matchCondition: (x, nodeContext) => !isOutputDeclaration(nodeContext),
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.ArgumentReferences
	}],
	"type": [{
		matchCondition: (x, nodeContext) => isProfileType(nodeContext),
		type: ModelElementTypes.Type,
		detailLevel: ModelDetailLevel.References
	}],
	"rule": [{
		matchCondition: (x, nodeContext) => isProfileRule(nodeContext),
		type: ModelElementTypes.Rule,
		detailLevel: ModelDetailLevel.References
	}],
	"view": [{
		matchCondition: (x, nodeContext) => isProfileView(nodeContext),
		type: ModelElementTypes.View,
		detailLevel: ModelDetailLevel.References
	}],
	"ProfileType": [{
		name: (x) => x.attributes.TypeName,
		type: ModelElementTypes.Type,
		detailLevel: ModelDetailLevel.References
	}],
	"ProfileView": [{
		name: (x) => x.attributes.ViewName,
		type: ModelElementTypes.View,
		detailLevel: ModelDetailLevel.References
	}],
	"ProfileRule": [{
		name: (x) => x.attributes.RuleName,
		type: ModelElementTypes.Rule,
		detailLevel: ModelDetailLevel.References
	}],
	"DataConversion": [{
		name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_DATACONVERSION_RULENAME])),
		type: ModelElementTypes.Rule,
		detailLevel: ModelDetailLevel.References
	}],
	"decoration": [{
		type: ModelElementTypes.Decorator,
		detailLevel: ModelDetailLevel.References
	}],
	"include": [{
		name: (x)=>x.attributes.block,
		type: ModelElementTypes.IncludeBlock,
		detailLevel: ModelDetailLevel.References,
	}]
};

function frontendOrBackendActionCall(nodeContext: INodeContext): string | number | boolean {
	return nodeContext.hasParentTag("view") || nodeContext.hasParentTag("function") ? "Frontend" : "Backend";
}
