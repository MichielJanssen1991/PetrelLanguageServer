import { AttributeOption, AttributeTypes, ChildDefinition, Definition, Definitions, ModelDetailLevel, ModelElementSubTypes, ModelElementTypes, ValidationLevels } from '../types/definitions';
import { isIncludeBlockOfType, isTypeOfAction } from './other';
import { comment_attribute, description_attribute, ignore_modelcheck_attribute, ignore_modelcheck_justification_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element, default_yes_no_attribute_type, action_call_output_elements, obsolete_attribute, obsolete_message_attribute, is_declaration_attribute, override_rights_attribute, input_element, include_block_declaration_definition, default_children, action_call_children, description_autoadd_attribute, module_element, clear_var_element, backend_action_call_elements } from './shared';

const switch_children: ChildDefinition[] = [
	{
		element: "case",
		occurence: "at-least-once"
	},
	{
		element: "default",
		occurence: "once"
	},
	...default_children
];

const then_else_children: ChildDefinition[] = [
	{
		element: "return"
	},
	{
		element: "break"
	},
	{
		element: "set-var"
	},
	{
		element: "action"
	},
	{
		element: "if"
	},
	{
		element: "elseif"
	},
	{
		element: "transaction"
	},
	{
		element: "clear-var"
	},
	{
		element: "rule",
		obsolete: true,
		obsoleteMessage: "Use action-call rule instead"
	},
	{
		element: "forloop"
	},
	{
		element: "switch"
	},
	{
		element: "output",
		type: ModelElementTypes.Output
	},
	...default_children
];

const rule_children: ChildDefinition[] = [
	{
		element: "input"
	},
	...then_else_children
];

const if_elseif_children: ChildDefinition[] = [
	{
		element: "condition",
		occurence: "at-least-once",
		required: true
	},
	{
		element: "then",
		occurence: "once",
		required: true
	},
	{
		element: "else",
		occurence: "once"
	},
	...default_children
];

const meta_attribute_options: AttributeOption[] = [
	{
		name: "module",
		obsolete: true
	},
	{
		name: "rule"
	},
	{
		name: "action"
	},
	{
		name: "if"
	},
	{
		name: "then"
	},
	{
		name: "else"
	},
	{
		name: "case"
	},
	{
		name: "switch"
	},
	{
		name: "forloop"
	},
	{
		name: "transaction"
	}
];

const include_block_rules_declaration_definition: Definition = {
	...include_block_declaration_definition,
	attributes: [
		...include_block_declaration_definition.attributes,
		{
			name: "meta-name",
			description: "For which element to apply rules.",
			required: true,
			autoadd: true,
			type:
			{
				type: AttributeTypes.Enum,
				options: meta_attribute_options
			}
		},
		{
			name: "meta-index",
			description: "For which element to apply rules.",
			type:
			{
				type: AttributeTypes.Enum,
				options: meta_attribute_options
			}
		}
	]
};

export const RULE_DEFINITION: Definitions = {
	"rules": [{
		type: ModelElementTypes.Rules,
		description: "",
		attributes: [comment_attribute],
		children: [
			{
				element: "module"
			},
			{
				element: "rule"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			},
			...default_children
		]
	}],
	"module": [module_element],
	"rule": [{
		type: ModelElementTypes.Rule,
		detailLevel: ModelDetailLevel.Declarations,
		prefixNameSpace: true,
		isSymbolDeclaration: true,
		description: "You call a rule (from the client side) by using this name. A rule answers by returning several (name, value) - pairs.",
		attributes: [
			{
				name: "name",
				description: "Unique identifier for the rule.",
				autoadd: true,
				validations: [
					{
						type: "regex",
						value: /^[\w_]+$/,
						message: "The name should only contain letters or underscore",
						level: ValidationLevels.Fatal
					}],
				visibilityConditions: [
					{
						attribute: "import",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "cache-level",
				description: "cache-level could be set to increase performance. If the cache-level is User, it will cache the output value based on the rule name, the project/application/company/user and the inputs that were passed to the rule. Setting the cache-level is only valid if this combined key always returns the same output. See [Caching rule invocations].",
				type:
				{
					type: AttributeTypes.Enum,
					options: [
						{
							name: "None",
							description: ""
						},
						{
							name: "User",
							description: ""
						},
						{
							name: "Company",
							description: ""
						},
						{
							name: "Application",
							description: ""
						}
					]
				},
				visibilityConditions: [
					{
						attribute: "import",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "max-cache-duration-minutes",
				description: "The maximum duration that the invocations will be cached. Only valid in case the cache-level has been set. By default it will be 1 to 5 minutes, depending on how often the rule is invoked with that input.",
				visibilityConditions: [
					{
						attribute: "import",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "ignore-empty-action-outputs",
				description: "Whether to ignore empty action outputs when used for variable assignments, or allow them to overwrite filled variables. By default these empty action outputs are ignored, i.e. not allowed to overwrite a filled variable.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "import",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "import",
				description: "Refers to a different rule.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Rule
				},
				visibilityConditions: [
					{
						attribute: "name",
						condition: "==",
						value: ""
					}
				]
			},
			obsolete_attribute,
			obsolete_message_attribute,
			override_rights_attribute,
			is_declaration_attribute,
			ignore_modelcheck_attribute,
			ignore_modelcheck_justification_attribute,
			comment_attribute
		],
		children: rule_children
	}],
	"action": [...backend_action_call_elements],
	"input": [input_element],
	"output": [
		{
			type: ModelElementTypes.Output,
			matchCondition: {
				matchFunction: (x) => isTypeOfAction(x, "Rule"),
				ancestors: [{
					type: ModelElementTypes.Rule
				},
				{
					type: ModelElementTypes.Unknown
				},
				{
					type: ModelElementTypes.IncludeBlock,
					subtypes: [
						ModelElementSubTypes.IncludeBlock_Rule,
						ModelElementSubTypes.IncludeBlock_Then,
						ModelElementSubTypes.IncludeBlock_Else,
						ModelElementSubTypes.IncludeBlock_ElseIf
					]
				}]
			},
			isSymbolDeclaration: true,
			detailLevel: ModelDetailLevel.Declarations,
			description: "Output of the rule. The rule will return (name, expression) as one of its value pairs. Any valid C# expression can be used; the syntax for parameters is {..}.",
			attributes: [
				{
					name: "name",
					description: "Unique identifier for the output.",
					required: true,
					autoadd: true
				},
				{
					name: "attribute",
					description: "A local variable name, a constant, or a data element (not supported in drop-down).",
					autoadd: true,
					type: {
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.RuleContext,
						options: [
							{
								name: ModelElementTypes.Input
							},
							{
								name: ModelElementTypes.SetVar
							},
							{
								name: ModelElementTypes.Output
							}
						]
					},
					requiredConditions: [
						{
							attribute: "expression",
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
					name: "expression",
					description: "Expression value.",
					visibilityConditions: [
						{
							attribute: "attribute",
							condition: "==",
							value: ""
						}
					]
				},
				{
					name: "value",
					description: "Fixed value.",
					visibilityConditions: [
						{
							attribute: "attribute",
							condition: "==",
							value: ""
						}
					]
				},
				{
					name: "format",
					description: "Indicates how numeric values will be formatted; for example '0.00'."
				},
				{
					name: "postcondition",
					description: "A condition to check the value with."
				},
				ignore_modelcheck_attribute,
				ignore_modelcheck_justification_attribute,
				comment_attribute
			],
			children: []
		},
		...action_call_output_elements
	],
	"argument": [{
		type: ModelElementTypes.Argument,
		description: "An argument to pass to the action.",
		attributes: [
			{
				name: "local-name",
				autoadd: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.RuleContext
				}
			},
			{
				name: "remote-name",
				autoadd: true
			},
			{
				name: "value",
				autoadd: true
			},
			{
				name: "parseType",
				description: "The type to which the argument value should be parsed.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "Petrel.ModelPath"
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
							name: "is not empty"
						}
					]
				}
			},
		],
		children: []
	}],
	"set-var": [{
		type: ModelElementTypes.SetVar,
		description: "A variable assignment.",
		attributes: [
			{
				name: "name",
				description: "Name under which the output is stored locally.",
				required: true,
				autoadd: true
			},
			{
				name: "expression",
				description: "A value expression.",
				autoadd: true
			},
			{
				name: "infoset",
				description: "An infoset which' contents to return.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Infoset
				}
			},
			{
				name: "infoset-variable",
				description: "A variable from an infoset to be returned. If the rule engine wants to use a variable that is defined in the infosets.xml file, first all {..} parameters in the search query are resolved. Then Petrel is called with this query. The records are returned, one by one: from each record, the attribute with the defined name is taken, and on all of these values, an aggregation like operator is used",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Variable
				}
			},
			{
				name: "value",
				description: "A fixed value."
			},
			ignore_modelcheck_attribute,
			ignore_modelcheck_justification_attribute,
			comment_attribute
		],
		children: []
	}],
	"clear-var": [clear_var_element],
	"if": [{
		type: ModelElementTypes.If,
		description: "Starts a condition.",
		attributes: [
			description_autoadd_attribute,
			comment_attribute
		],
		children: if_elseif_children
	}],
	"elseif": [{
		type: ModelElementTypes.ElseIf,
		description: "Indicates a new if statement in case the conditions of the current if statement are not fulfilled. Else-if elements have to be placed as siblings next to if elements or else-if elements, which themselves have no else element defined.",
		attributes: [
			description_autoadd_attribute,
			comment_attribute
		],
		children: if_elseif_children
	}],
	"condition": [{
		type: ModelElementTypes.Condition,
		description: "Condition item. One or more lines compose a condition.",
		attributes: [
			{
				name: "prefix",
				description: "Used to group conditions.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: ""
						},
						{
							name: "("
						},
						{
							name: "(("
						},
						{
							name: "((("
						},
						{
							name: "(((("
						},
						{
							name: "NOT"
						},
						{
							name: "NOT("
						},
						{
							name: "NOT(("
						},
						{
							name: "NOT((("
						},
						{
							name: "NOT(((("
						},
						{
							name: "AND"
						},
						{
							name: "AND("
						},
						{
							name: "AND(("
						},
						{
							name: "AND((("
						},
						{
							name: "AND(((("
						},
						{
							name: "AND NOT("
						},
						{
							name: "AND NOT(("
						},
						{
							name: "AND NOT((("
						},
						{
							name: "AND NOT(((("
						},
						{
							name: "OR"
						},
						{
							name: "OR("
						},
						{
							name: "OR(("
						},
						{
							name: "OR((("
						},
						{
							name: "OR(((("
						},
						{
							name: "OR NOT("
						},
						{
							name: "OR NOT(("
						},
						{
							name: "OR NOT((("
						},
						{
							name: "OR NOT(((("
						},
					]
				}
			},
			{
				name: "variable",
				description: "Left hand side of condition. Can be an expression as well (using {}).",
				required: true,
				autoadd: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.RuleContext,
					options: [
						{
							name: ModelElementTypes.Input,
						},
						{
							name: ModelElementTypes.SetVar,
						},
						{
							name: ModelElementTypes.Output,
						}
					]
				}
			},
			{
				name: "operator",
				required: true,
				autoadd: true,
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "==",
							default: true
						},
						{
							name: "=",
							obsolete: true
						},
						{
							name: "Like",
						},
						{
							name: ">",
						},
						{
							name: "<",
						},
						{
							name: ">=",
						},
						{
							name: "<=",
						},
						{
							name: "!=",
						},
						{
							name: "StartsWith",
						},
						{
							name: "WildCard",
							description: "Any wildcard search that is supported by the persistence, e.g., \"%[A-Z]_[0-9]\""
						},
						{
							name: "in-range",
							description: "check whether variable is in the range mentioned in value or constant (includes lowerbound excludes upperbound)"
						},
						{
							name: "below-range",
							description: "check whether variable is below the lower bound of the range mentioned in value or constant"
						},
						{
							name: "above-range",
							description: "check whether variable is equal or larger than the higher bound of the range mentioned in value or constant"
						},
						{
							name: "contains",
							description: "Checking multiple values is also supported (;-separated string as right hand side)."
						},
						{
							name: "misses",
							description: "Checking multiple values is also supported (;-separated string as right hand side)."
						},

					]
				}
			},
			{
				name: "value",
				description: "A right hand side value."
			},
			{
				name: "constant",
				description: "A constant as right hand side.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Constant
				}
			},
			{
				name: "expression",
				description: "An expression as right hand side."
			},
			{
				name: "postfix",
				description: "Used to group conditions.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: ")"
						},
						{
							name: "))"
						},
						{
							name: ")))"
						},
						{
							name: "))))"
						},
					]
				}
			},
			comment_attribute
		],
		children: []
	}],
	"then": [{
		type: ModelElementTypes.Unknown,
		description: "Indicates what should happen if the conditions are fulfilled.",
		attributes: [comment_attribute],
		children: then_else_children
	}],
	"else": [{
		type: ModelElementTypes.Unknown,
		description: "Else branch for the if 'statement'. What is below this element is executed if the condition of the if statement is not fulfilled.",
		attributes: [comment_attribute],
		children: then_else_children
	}],
	"transaction": [{
		type: ModelElementTypes.Unknown,
		description: "Combines the set of actions executed inside it into one transaction, that will succeed or fail as a whole. NOTE: Currently only data actions will be rolled back when a transaction fails.",
		attributes: [
			{
				name: "scope-option",
				description: "The meaning of the transaction scope change.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "Ensures the content to take part in a transaction. If there is already a transaction running, the content is added to that transaction and will roll back with that transaction."
						},
						{
							name: "Suppress",
							description: "Suppresses the content to take part in any outside transaction. This is useful for logging or audit, when you don't want to roll back the logging but only the data."
						},
						{
							name: "RequiresNew",
							description: "Starts a new transaction, even if there is already an outer transaction running. Effectively the same as suppress + required."
						}
					]
				}
			}
		],
		children: then_else_children
	}],
	"switch": [{
		type: ModelElementTypes.Switch,
		description: "",
		attributes: [
			{
				name: "variable",
				description: "A local variable name, a constant, or a data element (not supported in drop-down).",
				autoadd: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.RuleContext,
					options: [
						{
							name: ModelElementTypes.Input
						},
						{
							name: ModelElementTypes.SetVar
						},
						{
							name: ModelElementTypes.Output
						},
					]
				}
			},
			{
				name: "expression",
				description: "Expression value."
			},
			description_attribute,
			comment_attribute
		],
		children: switch_children
	}],
	"case": [{
		type: ModelElementTypes.Unknown,
		description: "",
		attributes: [
			{
				name: "value",
				required: true,
				autoadd: true
			}
		],
		children: then_else_children
	}],
	"default": [{
		type: ModelElementTypes.Unknown,
		description: "",
		attributes: [comment_attribute],
		children: then_else_children
	}],
	"forloop": [{
		type: ModelElementTypes.Unknown,
		description: "",
		attributes: [
			{
				name: "loopvar",
				description: "The variable to increment during the loop. The variable is set to the start value at initialize.",
				autoadd: true,
				required: true
			},
			{
				name: "start",
				description: "The start value for the loop variable. If not specified, the start value will be one.",
				required: true,
				autoadd: true
			},
			{
				name: "end",
				description: "The last value of the loop variable before the loop ends. (The condition of ending the loop is: loop variable &lt;= end value.)",
				required: true,
				autoadd: true
			},
		],
		children: then_else_children
	}],
	"break": [{
		type: ModelElementTypes.Unknown,
		description: "Terminates the current loop.",
		attributes: [comment_attribute],
		children: []
	}],
	"return": [{
		type: ModelElementTypes.Unknown,
		description: "Terminates the current rule.",
		attributes: [comment_attribute],
		children: []
	}],
	"include-blocks": [include_blocks_element],
	"include-block": [
		{ // rule
			...include_block_rules_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Rule,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "rule"),
			},
			children: [
				...rule_children
			]
		},
		{ // action
			...include_block_rules_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Action,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "action"),
			},
			children: [
				...action_call_children
			]
		},
		{ // if
			...include_block_rules_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_If,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "if"),
			},
			children: [
				...if_elseif_children
			]
		},
		{ // then
			...include_block_rules_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Then,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "then"),
			},
			children: [
				...then_else_children
			]
		},
		{ // else
			...include_block_rules_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Else,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "else"),
			},
			children: [
				...then_else_children
			]
		},
		{ // elseif
			...include_block_rules_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_ElseIf,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "elseif"),
			},
			children: [
				...if_elseif_children
			]
		},
		{ // switch
			...include_block_rules_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Switch,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "switch"),
			},
			children: [
				...switch_children
			]
		},
		{ // case
			...include_block_rules_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Case,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "case"),
			},
			children: [
				...then_else_children
			]
		},
		{ // General
			...include_block_rules_declaration_definition
		}
	],
	"include": [include_element],
	"merge-instruction": [merge_instruction_element],
	"model-condition": [model_condition_element]
};