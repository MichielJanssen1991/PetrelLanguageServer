import { Definitions } from '../../../types/definitions';
import { BACKEND_DEFINITION } from '../../backend';
import { modelcode_element_module, modelcode_element_non_module, modeling_object_element_module, modeling_object_element_non_module } from './modeling-object-shared';

export const MODELING_OBJECT_TYPE_DEFINITION: Definitions = {
	...BACKEND_DEFINITION,
	"ModelingObject": [
		modeling_object_element_module,
		modeling_object_element_non_module,
	],
	"ModelCode": [
		{
			...modelcode_element_non_module,
			children: [
				{ element: "type" }
			]
		},
		{
			...modelcode_element_module,
			children: [
				{ element: "module" },
				{ element: "type" }
			]
		}
	],
	"ModelingObjectSubObjects": [{
		attributes: [],
		children: [
			{element: "ModelingObjectSubObject"}
		]
	}],
	"ModelingObjectSubObject": [{
		attributes: [],
		children: []
	}],
	"Hash": [{
		attributes: [],
		children: []
	}]
};