import { Definitions } from '../../../types/definitions';
import { RULE_DEFINITION } from '../../rules';
import { modelcode_element_module, modelcode_element_non_module, modeling_object_element_module, modeling_object_element_non_module } from './modeling-object-shared';

export const MODELING_OBJECT_RULE_DEFINITION: Definitions = {
	...RULE_DEFINITION,
	"ModelingObject": [
		modeling_object_element_module,
		modeling_object_element_non_module,
	],
	"ModelCode": [
		{
			...modelcode_element_non_module,
			children: [
				{ element: "rule" }
			]
		},
		{
			...modelcode_element_module,
			children: [
				{ element: "module" },
				{ element: "rule" }
			]
		}
	],
	"Hash": [{
		attributes: [],
		children: []
	}]
};