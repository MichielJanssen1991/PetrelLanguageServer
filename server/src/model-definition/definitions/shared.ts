import { NAMES } from '../constants';
import { AttributeTypes, ElementAttributes, ModelElementTypes, Definition, ModelDetailLevel, IXmlNodeContext, ValidationLevels, AttributeType } from '../symbolsAndReferences';

export const default_yes_no_attribute_type: AttributeType =
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

export const dev_comment_attribute: ElementAttributes =
	{
		name: "comment",
		description: "Developer's comment on this element."
	};

export const dev_obsolete_attribute: ElementAttributes =
	{
		name: "obsolete",
		description: "Set to yes if this model entity is obsolete. This means another way of modeling is prefered and this old functionality may be removed in the next version.",
		type: default_yes_no_attribute_type
	};

export const dev_obsolete_message_attribute: ElementAttributes =
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
	};

export const dev_description_attribute: ElementAttributes =
	{
		name: "description",
		description: "Description of contents and purpose."
	};

export const dev_ignore_modelcheck_attribute: ElementAttributes =
	{
		name: "ignore-modelcheck",
		description: "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
	};

export const dev_ignore_modelcheck_justification_attribute: ElementAttributes =
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
	};

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

export const include_blocks_element: Definition =
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
	};

export const merge_instruction_element: Definition =
	{
		description: "",
		attributes: [
			{
				name: "value",
				description: "",
				required: true,
				type: {
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
			},
			dev_comment_attribute
		]

	};

export const backend_action_element: Definition =
	{
		type: ModelElementTypes.ActionCall,
		detailLevel: ModelDetailLevel.References,
		description: "An action.",
		checkObsolete: true,
		attributes: [
			{
				name: "name",
				description: "The action to perform.",
				autoadd: true,
				required: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Action
				}
			},
			{
				name: "input-all",
				description: "If yes, all available local variables (in the frontend, the non-data bound as well as the data bound variables) will be passed to the action. Default is no.",
				type: default_yes_no_attribute_type
			},
			{
				name: "output-all",
				description: "If yes, all outputs returned by the action will be made available locally (in the frontend as non-data bound variables). Default is no.",
				type: default_yes_no_attribute_type
			},
			{
				name: "dataless",
				description: "If the standard added data argument should be left out. It is now left out by default for performance (unless input-all is set). (Currently, only applicable for frontend calls to server actions.)",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "default"
						},
						{
							name: "yes"
						},
						{
							name: "no"
						}
					]
				}
			},
			{
				name: "user-created",
				description: "Set this flag to yes in case the rule name is not hard-coded. In that case the platform will check whether the current user is allowed to invoke the rule (the rule should be marked as external-invocable in the security.xml).",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "name",
						condition: "==",
						value: "rule"
					}
				]
			},
			{
				// rulename is already loaded via backendactions. 
				// The xxx (in visibilityConditions) ensures that this item is never visible in attribute context provider
				// Despite it is not visible, the attribute value context provider uses the type definition
				name: "rulename",
				description: "",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Rule
				},
				visibilityConditions: [	
					{
						attribute: "name",
						condition: "==",
						value: "xxx"	
					}
				]
			},
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "argument"
			},
			{
				element: "output",
				validations: [
					{
						identifier: "RULE00001",
						name: "action-outputs-missing",
						matches: [
							{
								attribute: "remote/local)-name",
								condition: "misses",
								value: ""//new JsonElementVariable("backend-rules", "/output[@name]")
							},
							{
								operator: "or",
								attribute: "local-name",
								condition: "misses",
								value: ""//new JsonElementVariable("backend-rules", "/output[@name]")
							}
						],
						message: "Missing defined output ${@backend-rules.output[name]} for rule ${@parent[rulename]}",
						level: ValidationLevels.Info,
						conditions: [
							{
								attribute: "@parent[name]",
								condition: "==",
								value: "rule"
							}
						]
					},
					{
						identifier: "RULE00002",
						name: "rule-outputs-notdefined",
						matches: [
							{
								attribute: "remote-name",
								condition: "not-in",
								value: ""//new JsonElementVariable("backend-rules", "/output[@name]")
							},
							{
								attribute: "local-name",
								condition: "not-in",
								value: ""//new JsonElementVariable("backend-rules", "/output[@name]")
							}
						],
						message: "Output ${@name} is not defined in rule ${@rulename}",
						level: ValidationLevels.Error,
						conditions: [
							{
								attribute: "@parent[name]",
								condition: "==",
								value: "rule"
							}
						]
					},
					{
						identifier: "RULE00003",
						name: "rule-outputs-not-used",
						matches: [
							{
								attribute: "(local/remote)-name",
								condition: "not-in",
								value: "@parent-rule-definition.arguments"
							},
							{
								attribute: "(local/remote)-name",
								condition: "not-in",
								value: "@parent-rule-definition.condition[variable]"
							},
							{
								attribute: "(local/remote)-name",
								condition: "not-in-like",
								value: "@parent-rule-definition.condition[expression]"
							},
							{
								attribute: "(local/remote)-name",
								condition: "not-in-like",
								value: "@parent-rule-definition.set-var[expression]"
							},
							{
								attribute: "(local/remote)-name",
								condition: "not-in",
								value: "@parent-rule-definition.output[variable]"
							},
							{
								attribute: "(local/remote)-name",
								condition: "not-in-like",
								value: "@parent-rule-definition.output[expression]"
							}
						],
						message: "Output ${@name} is outputted, but not used in rule ${@parent-rule-definition[name]}",
						level: ValidationLevels.Warning,
						conditions: [
							{
								attribute: "@parent[name]",
								condition: "==",
								value: "rule"
							}
						]
					}
				]
			},
			{
				element: "graph-params"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			},
			{
				element: "include"
			},
			{
				element: "model-condition"
			},
			{
				element: "merge-instruction"
			}

		]
	};
export const model_condition_element: Definition =
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
				type: {
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
			},
			{
				name: "value",
				description: "The operator to compare the setting value and the specified value.",
				autoadd: true
			},
		],
		childs: {
			matchFromParent: true
		}
	};

export const include_element: Definition =
	{
		description: "Includes a file or an include block. The included model fragment is merged with the contents of the parent node of the include.",
		type: ModelElementTypes.IncludeBlock,
		attributes: [
			{
				name: "block",
				description: "A block to include.",
				autoadd: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.IncludeBlock
				},
				visibilityConditions: [
					{
						attribute: "file",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "file",
				description: "A file to include. Model paths can be used.",
				visibilityConditions: [
					{
						attribute: "block",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "is-fragment",
				description: "If the include is a fragment such that there is no overlap with other parts: the code is included without looking for identical entities to merge.",
				type: default_yes_no_attribute_type
			},
			{
				name: "in-modeler",
				description: "If the value from this attribute is no, the include file is not loaded in the modeler as include.",
				type: default_yes_no_attribute_type
			},
			{
				name: "precedence",
				description: "If the included block has import precedence. Default, included XML has no import precedence (thus the included XML can be overridden by the includer). When setting precedence to an include, the present XML is overridden by the included.",
				"deprecated": true,
				type: default_yes_no_attribute_type,
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
				description: "If the included block moves childs that the included block and the current context have in common up to the include point. Default, merged childs are moved.",
				type: default_yes_no_attribute_type,
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
				autoadd: true,
				type: {
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
				},
				visibilityConditions: [
					{
						attribute: "presedence",
						condition: "==",
						value: ""
					},
					{
						attribute: "file",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "application",
				description: "To select an application within the included file.",
				visibilityConditions: [
					{
						attribute: "file",
						condition: "!=",
						value: ""
					}
				]
			},
			dev_comment_attribute
		]
	};

export const decorations_element: Definition = 
{
	description: "Group decorators applications of this element.",
	attributes: [
		dev_comment_attribute
	],
	childs: [
		{
			element: "decoration"
		}
	]
};

export const decoration_element: Definition = 
{
	description: "Apply a decorator to this target element.",
	attributes: [
		{
			name: "name",
			required: true,
			autoadd: true
		},
		dev_comment_attribute
	],
	childs: [
		{
			element: "decoration-argument"
		}
	]
};

export const decoration_argument_element: Definition = 
{
	description: "Pass an input value to the decorator.",
	attributes: [
		{
			name: "name",
			required: true,
			autoadd: true
		},
		{
			name: "value",
			autoadd: true
		},
		dev_comment_attribute
	]
};

export const decorators_element: Definition = 
{
	type: ModelElementTypes.Decorators,
	description: "Use to group decorator definitions.",
	childs: [
		{
			element: "decorator"
		}
	]
};

export const decorator_element: Definition = 
{
	type: ModelElementTypes.Decorator,
	description: "Definition to decorate a target element with extra elements or attributes. It will always get a default argument, named \"TargetName\", which contains the name attribute of the element on which this decorator is applied.",
	attributes: [
		{
			name: "name",
			required: true,
			autoadd: true
		}
	],
	childs: [
		{
			element: "decorator-input",
		},
		{
			element: "target",
			occurence: "once",
			required: true
		},
		{
			element: "decorator-context-entity",
			occurence: "once"
		},
	]
};

export const decorator_input_element: Definition = 
{
	description: "Declare an input for the decorator. This input can be used in an expression inside the decorator.",
	attributes: [
		{
			name: "name",
			required: true,
			autoadd: true
		},
		{
			name: "required",
			autoadd: true,
			type:
			{
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
			}
		},
	]
};

export const target_element: Definition = 
{
	type: ModelElementTypes.Target,
	description: "This element is mandatory and is a 'placeholder' for the element on which the decorator is applied. It can be extended with attributes and elements. Elements outside this element will occur outside the target element also.",
	attributes: [
		{
			name: "meta-name",
			description: "For which element to apply rules.",
			required: true,
			type:
			{
				type: AttributeTypes.Enum,
				options: [
					{
						name: ModelElementTypes.Type
					},
					{
						name: ModelElementTypes.View
					},
					{
						name: ModelElementTypes.Group
					},
					{
						name: ModelElementTypes.Attribute
					}
				]
			}
		}
	],
	childs: {
		matchElementFromAttribute: "meta-name"
	}
};

export const decorator_context_entity_element: Definition = 
{
	type: ModelElementTypes.DecoratorContextEntity,
	description: "Some summary",
	attributes: [
		{
			name: "meta-name",
			description: "For which element to apply rules.",
			required: true,
			type:
			{
				type: AttributeTypes.Enum,
				options: [
					{
						name: ModelElementTypes.Type
					},
					{
						name: ModelElementTypes.View
					},
					{
						name: ModelElementTypes.Group
					},
					{
						name: ModelElementTypes.Attribute
					}
				]
			}
		}
	],
	childs: {
		matchElementFromAttribute: "meta-name"
	}
};

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