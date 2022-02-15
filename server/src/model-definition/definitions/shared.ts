import { NAMES } from '../constants';
import { AttributeTypes, ElementAttribute, ModelElementTypes, Definition, ModelDetailLevel, IXmlNodeContext, ValidationLevels, AttributeType, ChildDefinition, ModelElementSubTypes } from '../symbolsAndReferences';

// export const guidelines
// <name_element>_element e.g. module_element

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

export const comment_attribute: ElementAttribute =
	{
		name: "comment",
		description: "Developer's comment on this element."
	};

export const obsolete_attribute: ElementAttribute =
	{
		name: "obsolete",
		description: "Set to yes if this model entity is obsolete. This means another way of modeling is prefered and this old functionality may be removed in the next version.",
		type: default_yes_no_attribute_type
	};

export const obsolete_message_attribute: ElementAttribute =
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

export const override_rights_attribute: ElementAttribute =
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
	
export const is_declaration_attribute: ElementAttribute =
	{
		name: "is-declaration",
		description: "May be used to have a metadata item which only specifies override rights and not specifies an instance.",
		type: default_yes_no_attribute_type
	};

export const is_public_attribute: ElementAttribute =
	{
		name: "is-public",
		description: "Indicates whether this entity is part of the public API and exposed to other models using it. NOTE: There is currently no validation of the contract, and this property is only used for the unused entities model check, but features may be added later.",
		type: default_yes_no_attribute_type
	};
	
export const description_attribute: ElementAttribute =
	{
		name: "description",
		description: "Description of contents and purpose."
	};

export const ignore_modelcheck_attribute: ElementAttribute =
	{
		name: "ignore-modelcheck",
		description: "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
	};

export const ignore_modelcheck_justification_attribute: ElementAttribute =
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
				value: /^(\+?[A-Z][a-zA-Z0-9]+(\.[A-Z][a-zA-Z0-9]+)*)?$/,
				message: "Only alphabetic and/or numeric namespacing (start with a letter), CamelCased words separated by dots are allowed.",
				level: ValidationLevels.Fatal
			}
		]
	};

export const default_children: ChildDefinition[] = [
		{
			element: "include"
		},
		{
			element: "merge-instruction",
			occurence: "once"
		},
		{
			element: "model-condition"
		}
	];

export const action_call_children: ChildDefinition[] =[
	{
		element: "argument"
	},
	{
		element: "output",
		type: ModelElementTypes.ActionCallOutput
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
	...default_children
];

export const input_element: Definition = {
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
		ignore_modelcheck_attribute,
		ignore_modelcheck_justification_attribute,
		comment_attribute
	],
	children: []
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
			comment_attribute
		],
		children: [
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
			comment_attribute
		],
		children: []
	};

export const single_aggregate_query_element: Definition = 
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
		children: [
			{
				element: "aggregate-attribute",
				occurence: "at-least-once",
				required: true
			},
			{
				element: "filter",
				occurence: "once"
			},
			{
				element: "search",
				occurence: "once"
			}
		]
	};

export const aggregate_attribute_element: Definition = 
	{
		description: "Specifies an aggregate result.",
		attributes: [
			{
				name: "name",
				required: true,
				description: "Unique identifer. This name is used as output name."
			}
		], 
		children: [
			{
				element: "aggregate-function"
			}
		]
	};

export const aggregate_function_element: Definition = 
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
		],
		children: []
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
			ignore_modelcheck_attribute,
			ignore_modelcheck_justification_attribute,
			comment_attribute
		],
		children: action_call_children
	};

export const model_condition_element: Definition =
	{
		type: ModelElementTypes.ModelCondition,
		isGroupingElement: true,
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
		children: []
	};

export const include_element: Definition =
	{
		description: "Includes a file or an include block. The included model fragment is merged with the contents of the parent node of the include.",
		type: ModelElementTypes.Include,
		detailLevel: ModelDetailLevel.References,	
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
				description: "If the included block moves children that the included block and the current context have in common up to the include point. Default, merged children are moved.",
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
			comment_attribute
		],
		children: []
	};

export const decorations_element: Definition = 
{
	type: ModelElementTypes.Decorations,
	description: "Group decorators applications of this element.",
	//isGroupingElement: true,
	attributes: [
		comment_attribute
	],
	children: [
		{
			element: "decoration"
		}
	]
};

export const decoration_element: Definition = 
{
	type: ModelElementTypes.Decoration,
	description: "Apply a decorator to this target element.",
	isSymbolDeclaration: true,
	detailLevel: ModelDetailLevel.References,
	attributes: [
		{
			name: "name",
			required: true,
			autoadd: true,
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Decorator
			}
		},
		comment_attribute
	],
	children: [
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
		comment_attribute
	],
	children: []
};

export const decorators_element: Definition = 
{
	type: ModelElementTypes.Decorators,
	description: "Use to group decorator definitions.",
	attributes: [comment_attribute],
	children: [
		{
			element: "decorator"
		},
		{
			element: "include-blocks"
		}
	]
};

export const decorator_element: Definition = 
{
	type: ModelElementTypes.Decorator,
	isSymbolDeclaration: true,
	detailLevel: ModelDetailLevel.Declarations,
	description: "Definition to decorate a target element with extra elements or attributes. It will always get a default argument, named \"TargetName\", which contains the name attribute of the element on which this decorator is applied.",
	attributes: [
		{
			name: "name",
			required: true,
			autoadd: true
		}
	],
	children: [
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
	],
	children: []
};

export const target_element_partial: Partial<Definition> = {
	type: ModelElementTypes.Target,
	description: "This element is mandatory and is a 'placeholder' for the element on which the decorator is applied. It can be extended with attributes and elements. Elements outside this element will occur outside the target element also.",
	attributes: [
		comment_attribute
	]
};

export const decorator_context_entity_element_partial: Partial<Definition> = 
{
	type: ModelElementTypes.DecoratorContextEntity,
	description: "Some summary"
};

export const view_argument_element: Definition = {
	description: "Filter arguments for the view or attribute.",
	type: ModelElementTypes.Argument,
	detailLevel: ModelDetailLevel.SubReferences,
	ancestors: [{
		type: ModelElementTypes.View
	},
	{
		type: ModelElementTypes.SubView
	}, 
	{
		type: ModelElementTypes.Attribute
	}, 
	{
		type: ModelElementTypes.IncludeBlock, 
		subtypes: [
			ModelElementSubTypes.IncludeBlock_View,
			ModelElementSubTypes.IncludeBlock_ListView,
			ModelElementSubTypes.IncludeBlock_ObjectView,
			ModelElementSubTypes.IncludeBlock_ViewContainer,
			ModelElementSubTypes.IncludeBlock_TreeView
		]
	}],
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
		ignore_modelcheck_attribute,
		ignore_modelcheck_justification_attribute,
		comment_attribute
	],
	children: []
};

export const action_argument_element: Definition = {
	description: "An argument to pass to the action.",
	type: ModelElementTypes.Argument,
	detailLevel: ModelDetailLevel.SubReferences,
	ancestors: [{
		type: ModelElementTypes.ActionCall
	},
	{
		type: ModelElementTypes.IncludeBlock,
		subtypes: [ModelElementSubTypes.IncludeBlock_Action]
	}],
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
		ignore_modelcheck_attribute,
		ignore_modelcheck_justification_attribute,
		comment_attribute
	],
	children: []
};

export const action_call_output_element: Definition =
{
	description: "Output of the action.",
	ancestors: [{
		type: ModelElementTypes.ActionCall
	},
	{
		type: ModelElementTypes.IncludeBlock,
		subtypes: [ModelElementSubTypes.IncludeBlock_Action]
	}],
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
		comment_attribute,
		ignore_modelcheck_attribute,
		ignore_modelcheck_justification_attribute
	],
	children: []
};

export const include_block_declaration_definition: Definition = {
	type: ModelElementTypes.IncludeBlock,
	detailLevel: ModelDetailLevel.Declarations,
	isSymbolDeclaration: true,
	description: "A model fragment that is included by includes.",
	attributes: [
		comment_attribute,
		{
			name: "name",
			description: "Unique identifier",
			required: true,
			autoadd: true,
		}
	],
	children: []
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
	comment_attribute
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
	override_rights_attribute,
	ignore_modelcheck_attribute,
	ignore_modelcheck_justification_attribute,
	comment_attribute
];

export const search_children: ChildDefinition[] = 
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
	...default_children
];

export const event_children: ChildDefinition[] = 
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
	...default_children
];

export const in_element: Definition = 
{
	description: "Applies a querying condition to a relation. This may be a relation from the queried type to another type, or vice versa. It may even be applied to non-relation attributes.",
	type: ModelElementTypes.In,
	detailLevel: ModelDetailLevel.Declarations,
	attributes: [
		{
			name: "field",
			description: "The name of the attribute defined at the type of which the value is compared with the set returned by the sub query.",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Attribute	// TODO filter on type + add iid to the list
			}
		},
		{
			name: "include-empty",
			description: "If results where the relation is empty are included too.",
			type: default_yes_no_attribute_type
		},
		{
			name: "condition",
			description: "The condition to apply for filtering the relation field using the filter applied to the relation instances.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "",
						description: "is included in"
					},
					{
						name: "not",
						description: "is not included in"
					}
				]
			}
		},
		{
			name: "search-when-empty",
			description: "Whether to drop this where-in condition if the filter is empty (if all the parameter based search columns are left out).",
			type: default_yes_no_attribute_type
		},
		{
			name: "sub-filter-select-field",
			description: "The attribute of the type queried in the sub query to match on. Default is the IID.",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Attribute	// TODO add iid to the list
			}
		}
	],
	children: [
		{
			element: "search",
			required: true,
			occurence: "once"
		},
		...default_children
	]
};

export const search_group_element: Definition = 
{
	isGroupingElement:true,
	description: "",
	attributes: [comment_attribute],
	children: search_children
};

export const full_text_query_element: Definition = 
{
	description: "A full text search query criterion. This must be added at the root of a search filter. It may be combined with other search criteria.",
	attributes: [
		{
			name: "query",
			description: "The free text string to query on. Logical operators like AND/OR or quotes are ignored. Multiple values separated by pipe are note supported.",
			required: true
		}
	],
	children: []
};

export const and_element: Definition = 
{
	description: "The and-operator between search columns. In fact, and is the default, so it can be omitted.",
	attributes: [comment_attribute],
	children: []
};

export const or_element: Definition = 
{
	description: "The or-operator between search columns. Use the group element to specify brackets.",
	attributes: [comment_attribute],
	children: []
};

export const search_column_element: Definition = 
{
	description: "Definition of the conditions of the search.",
	type: ModelElementTypes.SearchColumn,
	detailLevel: ModelDetailLevel.Declarations,
	attributes: [
		{
			name: "name",
			description: "The column to be searched.",
			required: true,
			detailLevel: ModelDetailLevel.References,
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Attribute
			},
		},
		{
			name: "is-context-info",
			type: default_yes_no_attribute_type
		},
		{
			name: "search-relation-iids",
			description: "Only applicable to relation searchcolumns. Decides if the type will be searched by the specified display-as attribute (search-relation-iids = false) or by IId (search-relation-iids = true).",
			type: default_yes_no_attribute_type
		},
		{
			name: "condition",
			description: "The search condition.",
			type: search_condition_options_attribute_type
		},
		{
			name: "value",
			description: "The column value to be searched. You can work with parameters in this query, by using the syntax {..}. For example: &lt;search type=\"Patientencounter\"&gt;&lt;searchcolumn name=\"patientID\" value=\"{@patientID}\" condition=\"IS\" /&gt;&lt;/search&gt;",
			visibilityConditions: [
				{
					attribute: "rule",
					condition: "==",
					value: ""
				},
				{
					operator: "and",
					attribute: "match-searchfield",
					condition: "==",
					value: ""
				}
			]
		},
		{
			name: "match-searchfield",
			description: "A field in the search query to match with.",
			visibilityConditions: [
				{
					attribute: "rule",
					condition: "==",
					value: ""
				},
				{
					operator: "and",
					attribute: "value",
					condition: "==",
					value: ""
				}
			]
		},
		{
			name: "match-searchfilter",
			description: "The search query to match the \"match-searchfield\" from. If empty, it will match from the current context search query.",
			visibilityConditions: [
				{
					attribute: "rule",
					condition: "==",
					value: ""
				},
				{
					operator: "and",
					attribute: "value",
					condition: "==",
					value: ""
				}
			]
		},
		{
			name: "rule",
			description: "A rule that computes the value to compare with. Only for rules with no required inputs.",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
			detailLevel: ModelDetailLevel.References,
			visibilityConditions: [
				{
					attribute: "value",
					condition: "==",
					value: ""
				},
				{
					operator: "and",
					attribute: "match-searchfield",
					condition: "==",
					value: ""
				}
			]
		},
		{
			name: "rule-output",
			description: "The name of the output argument of the rule to take for the value of this search column.",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Output,
			},
			detailLevel: ModelDetailLevel.References,
			visibilityConditions: [
				{
					attribute: "rule",
					condition: "!=",
					value: ""
				}
			],
			requiredConditions: [
				{
					attribute: "rule",
					condition: "!=",
					value: ""
				}
			]
		},
		{
			name: "search-when-empty",
			description: "Whether to use this condition or not if the value is empty",
			type: default_yes_no_attribute_type,
		},
		{
			name: "sort",
			description: "The sequence in which multiple columns should be sorted.",
			type: {
				type: AttributeTypes.Numeric
			},
		},
		{
			name: "sort-order",
			description: "The order how the sort-column is ordered.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "ASC",
						description: "Sorts ascending."
					},
					{
						name: "DESC",
						description: "Sorts descending."
					},
					{
						name: "",
						description: "Takes the default sort order for this attribute."
					},
				]
			},
		},
	],
	children: []
};

export const search_column_submatch_element: Definition = 
{
	description: "A condition that matches an attribute with sub query results.",
	attributes: [
		{
			name: "name",
			description: "The column to be searched.",
			required: true
		},
		{
			name: "is-context-info",
			type: default_yes_no_attribute_type
		},
		{
			name: "search-relation-iids",
			description: "Only applicable to relation searchcolumns. Decides if the type will be searched by the specified display-as attribute (search-relation-iids = false) or by IId (search-relation-iids = true).",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "true"
					},
					{
						name: "false"
					},
				]
			}
		},
		{
			name: "condition",
			description: "The search condition.",
			required: true,
			type: search_condition_options_attribute_type
		}
	],
	children: [
		{
			element: "scalar-aggregate-query",
			occurence: "once"
		},
		{
			element: "set-aggregate-query",
			occurence: "once"
		},
		{
			element: "single-aggregate-query",
			occurence: "once"
		},
		...default_children
	]
};

export function isViewArgument(nodeContext: IXmlNodeContext): boolean {
	return nodeContext.getParent()?.tag == "view";
}

export function isOutputDeclaration(nodeContext: IXmlNodeContext): boolean {
	return (["rule", "infoset", "function"].includes(nodeContext.getParent()?.tag||"NONE"))
		|| (nodeContext.getParent()?.tag == "action" && nodeContext.hasParentTag("actions"));
}