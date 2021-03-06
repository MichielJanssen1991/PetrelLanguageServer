import { Definition, IXmlNodeContext, ModelElementSubTypes, ModelElementTypes } from '../../../types/definitions';

export function isModule(nodeContext: IXmlNodeContext) {
	return nodeContext.getCurrentXmlNode().attributes["IsModule"] == "1";
}

export const modeling_object_element_module: Definition = {
	attributes: [],
	matchCondition: {
		matchFunction: (nodeContext: IXmlNodeContext) => isModule(nodeContext),
	},
	type: ModelElementTypes.ModelingObject,
	subtype: ModelElementSubTypes.ModelingObject_Module,
	children: [
		{ element: "ModelCode" },
		{ element: "ModelingObjectSubObjects" },
		{ element: "Hash" },
	]
};

export const modeling_object_element_non_module: Definition = {
	attributes: [],
	matchCondition: {
		matchFunction: (nodeContext: IXmlNodeContext) => !isModule(nodeContext),
	},
	type: ModelElementTypes.ModelingObject,
	subtype: ModelElementSubTypes.ModelingObject_NonModule,
	children: [
		{ element: "ModelCode" },
		{ element: "ModelingObjectSubObjects" },
		{ element: "Hash" },
	]
};

export const modelcode_element_module: Definition = {
	attributes: [],
	type: ModelElementTypes.ModelCode,
	subtype: ModelElementSubTypes.ModelingObject_Module,
	matchCondition: { 
		ancestors: [{ type: ModelElementTypes.ModelingObject, subtypes: [ModelElementSubTypes.ModelingObject_Module] }] 
	},
	children: []
};

export const modelcode_element_non_module: Definition = {
	attributes: [],
	type: ModelElementTypes.ModelCode,
	subtype: ModelElementSubTypes.ModelingObject_NonModule,
	matchCondition: { 
		ancestors: [{ type: ModelElementTypes.ModelingObject, subtypes: [ModelElementSubTypes.ModelingObject_NonModule] }] 
	},
	children: []
};




