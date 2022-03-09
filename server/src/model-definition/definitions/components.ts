import { AttributeTypes, Definitions, ModelElementTypes } from '../types/definitions';
import { comment_attribute, default_yes_no_attribute_type} from './shared';

export const COMPONENTS_DEFINITION: Definitions = {
	"root": [{
		description: "Project root of the components model.",
		attributes: [],
		children: [
			{
				element: "include",
				occurence: "at-least-once"
			}
		]
	}],
	"include": [{
		description: "Include for components",
		type: ModelElementTypes.Include,
		attributes: [
			{
				name: "file",
				description: "A file to include. Model paths can be used.",
				autoadd: true,
				required: true,
			},
			{
				name: "is-fragment",
				description: "If the include is a fragment such that there is no overlap with other parts: the code is included without looking for identical entities to merge.",
				types: [default_yes_no_attribute_type]
			},
			{
				name: "in-modeler",
				description: "If the value from this attribute is no, the include file is not loaded in the modeler as include.",
				obsolete: true,
				types: [default_yes_no_attribute_type]
			},
			{
				name: "precedence",
				description: "If the included block has import precedence. Default, included XML has no import precedence (thus the included XML can be overridden by the includer). When setting precedence to an include, the present XML is overridden by the included.",
				obsolete: true,
				types: [default_yes_no_attribute_type],
				visibilityConditions: [
					{
						attribute: "is-fragment",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "move-merged-childs",
				description: "If the included block moves children that the included block and the current context have in common up to the include point. Default, merged children are moved.",
				obsolete: true,
				types: [default_yes_no_attribute_type],
				visibilityConditions: [
					{
						attribute: "is-fragment",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "include-once",
				description: "If this include should be skipped if the file was already included before. (Notice that this only looks to includes specified *before* this include, not to possible includes coming *after* this include. This is also inevitable for preserving 'precendence' behaviour.) (Due to the look-behind behaviour, 'precedence' does not work together with this attribute.)",
				obsolete: true,
				types: [{
					type: AttributeTypes.Enum,
					options: [
						{
							name: "yes",
							default: true
						},
						{
							name: "no"
						}
					]
				}],
				visibilityConditions: [
					{
						attribute: "presedence",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "file",
						condition: "!=",
						value: ""
					}
				]
			},
			comment_attribute
		],
		children: []
	}]
};