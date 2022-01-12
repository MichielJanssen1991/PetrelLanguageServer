import { NAMES } from '../constants';
import { AttributeTypes, ElementAttribute, ModelElementTypes, Definition, ModelDetailLevel, IXmlNodeContext, ValidationLevels, AttributeType, ChildDefinition } from '../symbolsAndReferences';

export const default_yes_no_attribute_type: AttributeType =
	{
		type: AttributeTypes.Enum,
		"options": [
			{
				name: "yes"
			},
			{
				name: "no",
			},					
			{
				name: "true",
				obsolete: true
			},					
			{
				name: "false",
				obsolete: true
			},					
		]
	} as AttributeType;

export const dev_comment_attribute: ElementAttribute =
	{
		name: "comment",
		description: "Developer's comment on this element."
	};

export const dev_obsolete_attribute: ElementAttribute =
	{
		name: "obsolete",
		description: "Set to yes if this model entity is obsolete. This means another way of modeling is prefered and this old functionality may be removed in the next version.",
		type: default_yes_no_attribute_type
	};

export const dev_obsolete_message_attribute: ElementAttribute =
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

	export const dev_override_rights_attribute: ElementAttribute =
	{
		name: "override-rights",
		description: "May restrict which layers can override / extend this declaration.",
		type: {
			type: AttributeTypes.Enum,
			options: [
				{
					name: "All",
					description: "Full"
				},
				{
					name: "User",
					description: "Allowed until User layer"
				},
				{
					name: "Company",
					description: "Allowed until Company layer"
				},
				{
					name: "General",
					description: "Allowed until General layer"
				},
				{
					name: "None",
					description: "No override allowed, not even on the same level"
				}
			]
		}
	};
	
	export const dev_is_declaration_attribute: ElementAttribute =
	{
		name: "is-declaration",
		description: "May be used to have a metadata item which only specifies override rights and not specifies an instance.",
		type: default_yes_no_attribute_type
	};

	export const dev_is_public_attribute: ElementAttribute =
	{
		name: "is-public",
		description: "Indicates whether this entity is part of the public API and exposed to other models using it. NOTE: There is currently no validation of the contract, and this property is only used for the unused entities model check, but features may be added later.",
		type: default_yes_no_attribute_type
	};
	

export const dev_description_attribute: ElementAttribute =
	{
		name: "description",
		description: "Description of contents and purpose."
	};

export const dev_ignore_modelcheck_attribute: ElementAttribute =
	{
		name: "ignore-modelcheck",
		description: "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
	};

export const dev_ignore_modelcheck_justification_attribute: ElementAttribute =
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

export const search_condition_options_attribute_type: AttributeType =
	{
		type: AttributeTypes.Enum,
		options: [
			{
				name: "Is",
				description: "= (equal to)",
				obsolete: true
			},
			{
				name: "==",
				description: "== (equal to)"
			},
			{
				name: "Not",
				description: "≠ (not equal to)",
				obsolete: true
			},
			{
				name: "!=",
				description: "!= (not equal to)"
			},
			{
				name: "Like",
				description: "≈ (like)"
			},
			{
				name: "Greater",
				description: "> (greater than)"
			},
			{
				name: ">",
				description: "> (greater than)"
			},
			{
				name: "Smaller",
				description: "< (smaller than)"
			},
			{
				name: "<",
				description: "< (smaller than)"
			},
			{
				name: "GreaterOrEqual",
				description: "≥ (greater than or equal to)"
			},
			{
				name: ">=",
				description: "≥ (greater than or equal to)"
			},
			{
				name: "SmallerOrEqual",
				description: "≤ (smaller than or equal to)"
			},
			{
				name: "<=",
				description: "≤ (smaller than or equal to)"
			},
			{
				name: "StartsWith",
				description: "starts with"
			},
			{
				name: "WildCard",
				description: "Any wildcard search that is supported by the persistence, e.g., \"%[A-Z]_[0-9]\""
			},
			{
				name: "misses",
				description: ""
			},
			{
				name: "contains",
				description: ""
			},
			{
				name: "regexp",
				description: ""
			},
		]
	};

export const target_namespace_attribute: ElementAttribute =
	{
		name: "target-namespace",
		description: "Target namespace of the contents of the module. A relative namespace may start with a +, e.g., \"+Preferences\" may result in, e.g., \"Platform.Preferences\". (The target namespace together with the module name makes the module unique.)",
		autoadd: true,
		validations: [
			{
				type: "regex",
				value: /^(\+?[A-Z][a-zA-Z]+(\.[A-Z][a-zA-Z]+)*)?$/,
				message: "Only alphabetic, CamelCased words separated by dots are allowed.",
				level: ValidationLevels.Fatal
			}
		]
	};

export const input_element: Definition = 
{
	type: ModelElementTypes.Input,
	isSymbolDeclaration:true,
	detailLevel: ModelDetailLevel.Declarations,
	description: "Specifies an input argument.",
	attributes: [
		{
			name: "name",
			description: "Unique name for the input.",
			required: true,
			autoadd: true
		},
		{
			name: "required",
			description: "If required is set to yes, an exception will be thrown if the input argument is not present.",
			autoadd: true,
			detailLevel: ModelDetailLevel.Declarations,
			type: {
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
		},
		dev_ignore_modelcheck_attribute,
		dev_ignore_modelcheck_justification_attribute,
		dev_comment_attribute
	],
};

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

export const infoset_single_aggregate_query: Definition = 
	{
		description: "Specifies an aggregate query that returns a single aggregate result object.",
		attributes: [
			{
				name: "type",
				description: "The type of the objects to apply the query to.",
				required: true
			},
			{
				name: "filter",
				description: "A reference to a filter on the type being queryed. May also be defined inline.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.TypeFilter // TODO: should not be visible if child group is added
				}
			},
			{
				name: "result-type",
				description: "The result type of the aggregate results. If not specified, returns results of the Platform.AggregateResults type.</summary>Define a type inheriting from Platform.AggregateResults. Relation attributes may be added to this type, and views can be created for it.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				}
			}
		],
		childs: [
			{
				element: "aggregate-attribute",
				occurence: "at-least-once",
				required: true
			},
			{
				element: "filter",
				occurence: "once"
			}
		]
	};

export const infoset_aggregate_attribute: Definition = 
	{
		description: "Specifies an aggregate result.",
		attributes: [
			{
				name: "name",
				required: true,
				description: "Unique identifer. This name is used as output name."
			}
		], 
		childs: [
			{
				element: "aggregate-function"
			}
		]
	};

export const infoset_aggregate_function: Definition = 
	{
		description: "Specifies the value of an aggregate.",
		attributes: [
			{
				name: "name",
				description: "The function to apply.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "common value"
						},
						{
							name: "sum"
						},
						{
							name: "maximum"
						},
						{
							name: "minimum"
						},
						{
							name: "average"
						},
						{
							name: "count"
						},
					]
				}
			},
			{
				name: "attribute",
				description: "The attribute parameter to the function.",
				requiredConditions: [
					{
						attribute: "name",
						condition: "==",
						value: "count"
					}
				]
			}
		]
	};
export const backend_action_call_element: Definition =
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
							description: "Equals (default)",
							obsolete: true
						},
						{
							name: "==",
							description: "Equals",
							default: true
						},
						{
							name: "!=",
							description: "Unequal"
						},
						{
							name: "Unequal",
							description: "Unequal",
							obsolete: true
						},
						{
							name: "StartsWith",
							description: "starts with"
						},
						{
							name: ">",
							description: "greater than (string compare)"
						},
						{
							name: ">=",
							description: "greater than or equal to (string compare)"
						},
						{
							name: "<=",
							description: "less than or equal to (string compare)"
						},
						{
							name: "<",
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
				obsolete: true,
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
	isSymbolDeclaration: true,
	detailLevel: ModelDetailLevel.Declarations,
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
	attributes: [dev_comment_attribute],
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

export const target_element: Definition = {
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

export const action_definition_argument_element: Definition = {
	description: "Allows to define attributes/inputs/outputs shared per module",
	attributes: [
		{
			name: "name",
			required: true
		},
		{
			name: "type",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "string"
					},
					{
						name: "integer"
					},
					{
						name: "boolean"
					},
					{
						name: "numeric"
					},
					{
						name: "xml"
					},
					{
						name: "xml-string"
					},
					{
						name: "mixed"
					},
					{
						name: "iid"
					},
					{
						name: "pipedlist"
					},
					{
						name: "xml-list"
					},
				]
			}
		},
	]
};

export const view_argument_element: Definition = {
	description: "Filter arguments for the view.",
	type: ModelElementTypes.Argument,
	detailLevel: ModelDetailLevel.SubReferences,
	ancestors: [ModelElementTypes.View, ModelElementTypes.SubView],
	attributes: [
		{
			name: NAMES.ATTRIBUTE_REMOTENAME,
			description: "Name for a destination field or variable."
		},
		{
			name: NAMES.ATTRIBUTE_LOCALNAME,
			description: "Name for a local field or variable."
		},
		{
			name: "value",
			description: "The value for the argument. For output arguments, this is the default value."
		},
		{
			name: "parseType",
			description: "The type to which the argument value should be parsed.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "Petrel.ModelPath",
						default: true
					}
				]
			}
		},
		{
			name: "precondition",
			description: "A condition to check the value with.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "is not empty",
						default: true
					}
				]
			}
		},
		{
			name: "bounded",
			description: "This indicates whether the field corresponds with a field from the related type.</summary> If the field is \"data bound\":[Model_Frontend_Bounded] (saved in the data). Useful when displaying values not in the persistence. A non-data bound field is a free form field that is not linked to a database attribute.",
			type: default_yes_no_attribute_type			
		},
		{
			name: "search",
			description: "If the argument has to be used as a filter on the corresponding attribute. Default = yes.",
			type: default_yes_no_attribute_type
		},
		{
			name: "condition",
			description: "The search condition",
			type: search_condition_options_attribute_type,
			visibilityConditions: [
				{
					attribute: "search",
					condition: "==",
					value: "yes"
				}
			]
		},
		{
			name: "search-when-empty",
			description: "If the filter argument has to be used when null.",
			type: default_yes_no_attribute_type,
			visibilityConditions: [
				{
					attribute: "search",
					condition: "==",
					value: "yes"
				}
			]
		},
		{
			name: "fill-as-default",
			description: "If the argument has to be used as a default value for attribute with that name. Default = yes.",
			type: default_yes_no_attribute_type
		},
		dev_ignore_modelcheck_attribute,
		dev_ignore_modelcheck_justification_attribute,
		dev_comment_attribute
	]
};

export const action_argument_element: Definition = {
	description: "An argument to pass to the action.",
	type: ModelElementTypes.Argument,
	detailLevel: ModelDetailLevel.SubReferences,
	ancestors: [ModelElementTypes.ActionCall],
	matchCondition: (nodeContext) => !isViewArgument(nodeContext),
	attributes: [
		{
			name: NAMES.ATTRIBUTE_REMOTENAME,
			description: "Name for a destination field or variable."
		},
		{
			name: NAMES.ATTRIBUTE_LOCALNAME,
			description: "Name for a local field or variable."
		},
		{
			name: "value",
			description: "The value for the argument. For output arguments, this is the default value."
		},
		{
			name: "parseType",
			description: "The type to which the argument value should be parsed.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "Petrel.ModelPath",
						default: true
					}
				]
			}
		},
		{
			name: "precondition",
			description: "A condition to check the value with.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "is not empty",
						default: true
					}
				]
			}
		},
		{
			name: "bounded",
			description: "This indicates whether the field corresponds with a field from the related type.</summary> If the field is \"data bound\":[Model_Frontend_Bounded] (saved in the data). Useful when displaying values not in the persistence. A non-data bound field is a free form field that is not linked to a database attribute.",
			type: default_yes_no_attribute_type			
		},
		dev_ignore_modelcheck_attribute,
		dev_ignore_modelcheck_justification_attribute,
		dev_comment_attribute
	]
};

export const action_call_output_element: Definition =
{
	description: "Output of the action.",
	ancestors: [ModelElementTypes.ActionCall],
	type: ModelElementTypes.ActionCallOutput,
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

export const search_attributes: ElementAttribute[] = 
[
	{
		name: "type",
		description: "Type of object to be retrieved.",
		required: true,
		type: {
			type: AttributeTypes.Reference,
			relatedTo: ModelElementTypes.Type
		}
	},
	{
		name: "name",
		description: "Unique filter identifier."	// only visible from backend types
	},
	{
		name: "field",
		description: "Attribute of the data to scalar.",
		type: {
			type: AttributeTypes.Reference,
			relatedTo: ModelElementTypes.Attribute // TODO: filter attributes on type
		}
	},
	{
		name: "add-relations",
		description: "Select relation attributes too. Set to 'yes' if you want to link a variable to a related attribute.",
		type: default_yes_no_attribute_type
	},
	{
		name: "filter",
		description: "The type filter to apply for search.",
		type: {
			type: AttributeTypes.Reference,
			relatedTo: ModelElementTypes.TypeFilter	// TODO: filter on typename
		}
	},
	{
		name: "all-when-empty-filter",
		description: "If 'no' the search returns nothing (matches no record) when the filter is empty or if all the parameter based search columns are left out; if 'yes' it returns all records (matches all records).",
		type: default_yes_no_attribute_type
	},
	{
		name: "alias",
		description: "An internal name for the search query which is available to use for 'match search field' purposes."
	},
	dev_comment_attribute
];

export const view_group_attributes: ElementAttribute[] =
[
	{
		name: "name",
		description: "A unique identifier to refer to this group. The name of a group is required because a grouping of fields has a semantical reason.This attribute can be used for inheritance from identically named groups.",
		required: true
	},
	{
		name: "caption",
		description: "The caption of the group."
	},
	{
		name: "show",
		description: "If the group is initially visible.",
		type: default_yes_no_attribute_type
	},
	{
		name: "show-in-listview",
		description: "If the group should be visible as a group in the list view.",
		type: default_yes_no_attribute_type
	},
	{
		name: "sortable",
		description: "If the column should be sortable by the specified sort field.",
		type: default_yes_no_attribute_type,
		visibilityConditions: [
			{
				attribute: "show-in-listview",
				condition: "==",
				value: "yes"
			}
		]
	},
	{
		name: "sort-field",
		description: "The field to sort by if the column showed in the list view is sortable.",
		type: {
			type: AttributeTypes.Reference,
			relatedTo: ModelElementTypes.Attribute // filter current view
		},
		visibilityConditions: [
			{
				attribute: "sortable",
				condition: "==",
				value: "yes"
			}
		],
		requiredConditions: [
			{
				attribute: "sortable",
				condition: "==",
				value: "yes"
			}
		]
	},
	{
		name: "accesskey",
		description: "A key to access the field set."
	},
	{
		name: "appearance-class",
		description: "A specific style for the view element.",
		type: {
			type: AttributeTypes.Reference,
			relatedTo: ModelElementTypes.AppearanceClass
		}
	},
	{
		name: "float",
		description: "Whether the view is floated",
		type: {
			type: AttributeTypes.Enum,
			options: [
				{
					name: "none"
				},
				{
					name: "left"
				},
				{
					name: "right"
				}
			]
		}
	},
	{
		name: "clear",
		description: "Specifies the sides of the view where other floating elements are not allowed.",
		type: {
			type: AttributeTypes.Enum,
			options: [
				{
					name: "both"
				},
				{
					name: "left"
				},
				{
					name: "right"
				}
			]
		}
	},
	{
		name: "background-image",
		description: "A background image for the view. (TIP: use SCSS instead of this attribute)"
	},
	{
		name: "background-position",
		description: "Background position for the view. See: http://www.w3.org/TR/CSS2/colors.html (TIP: use SCSS instead of this attribute)"
	},
	{
		name: "collapsable",
		description: "Whether the user should be able to expand and collapse the field set box.",
		type: default_yes_no_attribute_type
	},
	{
		name: "collapsed",
		description: "If the field set is initially expanded. Collapsed will make the fieldset visible by title only (and expandable by a button).",
		type: {
			type: AttributeTypes.Enum,
			options: [
				{
					name: "collapsed",
					default: true
				},
				{
					name: "expanded"
				}
			]
		},
		visibilityConditions: [
			{
				attribute: "collapsable",
				condition: "==",
				value: "yes"
			}
		]
	},
	{
		name: "page-break-before",
		description: "",
		type: {
			type: AttributeTypes.Enum,
			options: [
				{
					name: "auto"
				},
				{
					name: "always"
				},
				{
					name: "avoid"
				}
			]
		}
	},
	dev_override_rights_attribute,
	dev_ignore_modelcheck_attribute,
	dev_ignore_modelcheck_justification_attribute,
	dev_comment_attribute
];

export const child_merge_instruction: ChildDefinition = 
{
	element: "merge-instruction",
	occurence: "once"
};
export const child_include: ChildDefinition = 
{
	element: "include"
};
export const child_model_condition: ChildDefinition = 
{
	element: "model-condition"
};

export const view_group_childs: ChildDefinition[] =
[
	{
		element: "group"
	},
	{
		element: "attribute"
	},
	{
		element: "events"
	},
	{
		element: "view"
	},
	{
		element: "tabber"
	},
	{
		element: "button"
	},
	{
		element: "decorations"
	},
	child_include,
	child_merge_instruction,
	child_model_condition
];

export const search_childs: ChildDefinition[] = 
[
	{
		element: "or"
	},
	{
		element: "and"
	},
	{
		element: "searchcolumn"
	},
	{
		element: "searchcolumn-submatch"
	},
	{
		element: "group"
	},
	{
		element: "in"
	},
	{
		element: "full-text-query"
	},
	child_include,
	child_merge_instruction,
	child_model_condition
];

export const event_childs: ChildDefinition[] = 
[
	{
		element: "action"
	},
	{
		element: "condition"
	},
	{
		element: "include-block",
		obsolete: true,
		obsoleteMessage: "Place include-block on a location where all include-blocks are grouped"
	},
	child_include,
	child_merge_instruction,
	child_model_condition
];

export function isViewArgument(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.getFirstParent()?.name == "view";
}

export function isOutputDeclaration(nodeContext: IXmlNodeContext): boolean {
	return (["rule", "infoset", "function"].includes(nodeContext.getFirstParent()?.name||"NONE"))
		|| (nodeContext.getFirstParent()?.name == "action" && nodeContext.hasParentTag("actions"));
}