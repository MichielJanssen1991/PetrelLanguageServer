import { Definitions } from '../../../symbolsAndReferences';
import { INFOSET_DEFINITION } from '../../infosets';
import { modelcode_element_module, modelcode_element_non_module, modeling_object_element_module, modeling_object_element_non_module } from './modeling-object-shared';

export const MODELING_OBJECT_INFOSET_DEFINITION: Definitions = {
	...INFOSET_DEFINITION,
	"ModelingObject": [
		modeling_object_element_module,
		modeling_object_element_non_module,
	],
	"ModelCode": [
		{
			...modelcode_element_non_module,
			children: [
				{ element: "infoset" }
			]
		},
		{
			...modelcode_element_module,
			children: [
				{ element: "module" },
				{ element: "infoset" }
			]
		}
	],
	"Hash": [{
		attributes: [],
		children: []
	}]
};