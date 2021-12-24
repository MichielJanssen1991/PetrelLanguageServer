import { NAMES } from '../constants';
import { AttributeTypes, ElementAttributes, ModelElementTypes, Definition, ModelDetailLevel, IXmlNodeContext, ValidationLevels, AttributeType } from '../symbolsAndReferences';

export const default_yes_no_attribute_type =
	{
		type: AttributeTypes.Enum,
		"options": [
			{
				name: "yes"
			},
			{
				name: "no",
			}						
		]
	} as AttributeType;

export const dev_comment_attribute =
	{
		name: "comment",
		description: "Developer's comment on this element."
	} as ElementAttributes;

export const dev_obsolete_attribute =
	{
		name: "obsolete",
		description: "Set to yes if this model entity is obsolete. This means another way of modeling is prefered and this old functionality may be removed in the next version.",
		type: default_yes_no_attribute_type
	} as ElementAttributes;

export const dev_obsolete_message_attribute =
	{
		name: "obsolete-message",
		description: "Indicate what to use as an alternative.",
		visibilityConditions: [
			{
				attribute: "obsolete",
				condition: "==",
				value: "yes"
			}
		]
	} as ElementAttributes;

export const dev_description_attribute =
	{
		name: "description",
		description: "Description of contents and purpose."
	} as ElementAttributes;

export const dev_ignore_modelcheck_attribute =
	{
		name: "ignore-modelcheck",
		description: "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
	} as ElementAttributes;

export const dev_ignore_modelcheck_justification_attribute =
	{
		name: "ignore-modelcheck-justification",
		description: "If \"ignore-modelcheck\" was set, a justification why those model checks were ignored.",
		visibilityConditions: [
			{
				attribute: "ignore-modelcheck",
				condition: "!=",
				value: ""
			}
		]
	} as ElementAttributes;

export const target_namespace_attribute =
	{
		name: "target-namespace",
		description: "Target namespace of the contents of the module. A relative namespace may start with a +, e.g., \"+Preferences\" may result in, e.g., \"Platform.Preferences\". (The target namespace together with the module name makes the module unique.)",
		autoadd: true,
		validations: [
			{
				type: "regex",
				value: /(\\+?[A-Z][a-zA-Z]+(\\.[A-Z][a-zA-Z]+)*)?/,
				message: "Only alphabetic, CamelCased words separated by dots are allowed.",
				level: ValidationLevels.Fatal
			}
		]
	} as ElementAttributes;

export const include_blocks_element =
	{
		description: "Use to group include blocks.",
		attributes: [
			{
				name: "name",
				description: "Unique identifier."
			},
			{
				name: "description",
				description: "Description of contents and purpose."
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			}
		]
	} as Definition;

export const merge_instruction_element =
	{
		description: "",
		attributes: [
			{
				name: "value",
				description: "",
				required: true,
				types: [
					{
						type: AttributeTypes.Enum,
						options: [
							{
								name: "extension-insertion-point"
							},
							{
								name: "inheritance-insertion-point"
							},
						]
					}
				]

			},
			dev_comment_attribute
		]

	} as Definition;

export const model_condition_element =
	{
		description: "A model part that will be included when the mentioned setting has the specified value.",
		attributes: [
			{
				name: "name",
				description: "The name of the setting.",
				required: true,
				autoadd: true
			},
			{
				name: "operator",
				description: "The operator to compare the setting value and the specified value.",
				autoadd: true,
				types: [
					{
						type: AttributeTypes.Enum,
						options: [
							{
								name: "",
								description: "Equals",
								"default": true
							},
							{
								name: "Unequal",
								description: "Unequal"
							},
							{
								name: "StartsWith",
								description: "starts with"
							},
							{
								name: "&gt;",
								description: "greater than (string compare)"
							},
							{
								name: "&gt;=",
								description: "greater than or equal to (string compare)"
							},
							{
								name: "&lt;=",
								description: "less than or equal to (string compare)"
							},
							{
								name: "&lt;",
								description: "less than (string compare)"
							},
						]
					}
				]
			},
			{
				name: "value",
				description: "The operator to compare the setting value and the specified value.",
				autoadd: true
			},
		],
		childs: [
			// TODO context specific child nodes!!
		]
	} as Definition;

export const include_element =
	{
		description: "Includes a file or an include block. The included model fragment is merged with the contents of the parent node of the include.",
		type: ModelElementTypes.IncludeBlock,
		"isReference": true,
		attributes: [
			{
				name: "block",
				description: "A block to include.",
				autoadd: true,
				types: [
					{
						type: AttributeTypes.Enum,
						options: [
							{
								name: "$reachable-include-blocks[not(@meta-name) or @meta-name = name(current()/../.)]/@name" // TODO
							}
						]
					}
				],
				visibilityConditions: [
					{
						"attribute": "file",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				name: "file",
				description: "A file to include. Model paths can be used.",
				visibilityConditions: [
					{
						"attribute": "block",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				name: "is-fragment",
				description: "If the include is a fragment such that there is no overlap with other parts: the code is included without looking for identical entities to merge.",
				types: [
					{
						type: AttributeTypes.Enum,
						options: [
							{
								name: "yes"
							},
							{
								name: "no"
							}
						]
					}
				]
			},
			{
				name: "in-modeler",
				description: "If the value from this attribute is no, the include file is not loaded in the modeler as include.",
				types: [
					{
						type: AttributeTypes.Enum,
						options: [
							{
								name: "yes"
							},
							{
								name: "no"
							}
						]
					}
				]
			},
			{
				name: "precedence",
				description: "If the included block has import precedence. Default, included XML has no import precedence (thus the included XML can be overridden by the includer). When setting precedence to an include, the present XML is overridden by the included.",
				"deprecated": true,
				types: [
					{
						type: AttributeTypes.Enum,
						options: [
							{
								name: "yes"
							},
							{
								name: "no"
							}
						]
					}
				],
				visibilityConditions: [
					{
						"attribute": "is-fragment",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				name: "move-merged-childs",
				description: "If the included block moves childs that the included block and the current context have in common up to the include point. Default, merged childs are moved.",
				types: [
					{
						type: AttributeTypes.Enum,
						options: [
							{
								name: "yes"
							},
							{
								name: "no"
							}
						]
					}
				],
				visibilityConditions: [
					{
						"attribute": "is-fragment",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				name: "include-once",
				description: "If this include should be skipped if the file was already included before. (Notice that this only looks to includes specified *before* this include, not to possible includes coming *after* this include. This is also inevitable for preserving 'precendence' behaviour.) (Due to the look-behind behaviour, 'precedence' does not work together with this attribute.)",
				autoadd: true,
				types: [
					{
						type: AttributeTypes.Enum,
						options: [
							{
								name: "yes",
								"default": true
							},
							{
								name: "no"
							}
						]
					}
				],
				visibilityConditions: [
					{
						"attribute": "presedence",
						"condition": "==",
						"value": ""
					},
					{
						"attribute": "file",
						"condition": "!=",
						"value": ""
					}
				]
			},
			{
				name: "application",
				description: "To select an application within the included file.",
				visibilityConditions: [
					{
						"attribute": "file",
						"condition": "!=",
						"value": ""
					}
				]
			},
			dev_comment_attribute
		]
	} as Definition;

export const view_argument_element: Definition = {
	type: ModelElementTypes.Argument,
	detailLevel: ModelDetailLevel.SubReferences,
	matchCondition: (nodeContext) => !isViewArgument(nodeContext),
	attributes: [{
		name: NAMES.ATTRIBUTE_REMOTENAME,
	},
	{
		name: NAMES.ATTRIBUTE_LOCALNAME,
	}]
};

export const action_argument_element: Definition = {
	name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
	type: ModelElementTypes.Argument,
	detailLevel: ModelDetailLevel.SubReferences,
	matchCondition: (nodeContext) => !isViewArgument(nodeContext),
	attributes: [{
		name: NAMES.ATTRIBUTE_REMOTENAME,
	},
	{
		name: NAMES.ATTRIBUTE_LOCALNAME,
	}]
};

export const action_output_element: Definition =
{
	description: "Output of the action.",
	name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
	matchCondition: (nodeContext) => !isOutputDeclaration(nodeContext),
	type: ModelElementTypes.Output,
	detailLevel: ModelDetailLevel.SubReferences,
	attributes:[
		{
			name: "local-name",
			description: "Name for a local field or variable.",
			autoadd: true
		},
		{
			name: "remote-name",
			description: "Name for a destination field or variable.",
			autoadd: true
		},
		{
			name: "value",
			description: "The value for the argument. For output arguments, this is the default value."
		},
		{
			name: "postcondition",
			description: "A condition to check the value with.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "is not empty"
					}
				]
			}
		},
		{
			name: "override-inherited",
			description: "A condition to check the value with.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "childs",
						description: "yes"
					},
					{
						name: "",
						description: "no"
					}
				]
			}
		},
		dev_comment_attribute,
		dev_ignore_modelcheck_attribute,
		dev_ignore_modelcheck_justification_attribute
	]
};

export function isViewArgument(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.getFirstParent().name == "view";
}

export function isOutputDeclaration(nodeContext: IXmlNodeContext): boolean {
	return (["rule", "infoset", "function"].includes(nodeContext.getFirstParent().name))
		|| (nodeContext.getFirstParent().name == "action" && nodeContext.hasParentTag("actions"));
}