import { Definitions } from '../../../symbolsAndReferences';
import { FRONTEND_DEFINITION } from '../../frontend';
import { modelcode_element_module, modelcode_element_non_module, modeling_object_element_module, modeling_object_element_non_module } from './modeling-object-shared';

export const MODELING_OBJECT_FUNCTION_DEFINITION: Definitions = {
	...FRONTEND_DEFINITION,
	"ModelingObject": [
		modeling_object_element_module,
		modeling_object_element_non_module,
	],
	"ModelCode": [
		{
			...modelcode_element_non_module,
			children: [
				{ element: "function" }
			]
		},
		{
			...modelcode_element_module,
			children: [
				{ element: "module" },
				{ element: "function" }
			]
		}
	],
	"Hash": [{
		attributes: [],
		children: []
	}]
};