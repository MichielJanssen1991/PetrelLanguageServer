import { NAMES } from '../constants';
import { AttributeTypes, ElementAttributes, ModelElementTypes, Definition, ModelDetailLevel, IXmlNodeContext } from '../symbolsAndReferences';

export const dev_comment_attribute =
	{
		name: "comment",
		description: "Developer's comment on this element."
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
				conditions: [
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
				conditions: [
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
				conditions: [
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
				conditions: [
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
				conditions: [
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
				conditions: [
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
	name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
	type: ModelElementTypes.Argument,
	isReference: true,
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
	isReference: true,
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
	name: ((x: any) => (x.attributes[NAMES.ATTRIBUTE_REMOTENAME] || x.attributes[NAMES.ATTRIBUTE_LOCALNAME] || "")),
	matchCondition: (nodeContext) => !isOutputDeclaration(nodeContext),
	type: ModelElementTypes.Output,
	isReference: true,
	detailLevel: ModelDetailLevel.SubReferences
};

export function isViewArgument(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.getFirstParent().name == "view";
}

export function isOutputDeclaration(nodeContext: IXmlNodeContext): boolean {
	return (["rule", "infoset", "function"].includes(nodeContext.getFirstParent().name))
		|| (nodeContext.getFirstParent().name == "action" && nodeContext.hasParentTag("actions"));
}