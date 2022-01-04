import { AttributeTypes, ModelElementTypes, Definitions, ValidationLevels, ModelDetailLevel } from '../symbolsAndReferences';
import { dev_comment_attribute, dev_description_attribute, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute, target_namespace_attribute, include_blocks_element, include_element, isOutputDeclaration, merge_instruction_element, model_condition_element, default_yes_no_attribute_type, action_output_element, backend_action_element, dev_obsolete_attribute, dev_obsolete_message_attribute, dev_is_declaration_attribute, dev_override_rights_attribute, input_element } from './shared';
export const RULE_DEFINITION: Definitions = {
	"rules": [{
		type: ModelElementTypes.Rule,
		description: "",
		attributes: [
			{
				name: "comment",
				description: "Developer's comment on this element"
			}
		],
		childs: [
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
	}],
	"module": [{
		type: ModelElementTypes.Module,
		detailLevel: ModelDetailLevel.Declarations,
		description: "Used for grouping model entities and model namespacing.",
		attributes: [
			{
				name: "name",
				description: "The module name.",
				autoadd: true
			},
			target_namespace_attribute,
			dev_description_attribute,
			dev_comment_attribute,
		],
		childs: [
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
	}],
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
			dev_obsolete_attribute,
			dev_obsolete_message_attribute,
			dev_override_rights_attribute,
			dev_is_declaration_attribute,
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "input"
			},
			{
				element: "output"
			},
			{
				element: "action"
			},
			{
				element: "forloop"
			},
			{
				element: "set-var"
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
				element: "rule"
			},
			{
				element: "switch"
			},
			{
				element: "include"
			},
			{
				element: "model-condition"
			}
		]
	}],
	"action": [backend_action_element],
	"input": [input_element],
	"output": [{
		type: ModelElementTypes.Output,
		matchCondition: (nodeContext) => isOutputDeclaration(nodeContext),
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
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		]},
		action_output_element
	],
	"argument": [{
		type: ModelElementTypes.Argument,
		description: "An argument to pass to the action.",
		attributes: [
			{
				name: "local-name",
				autoadd: true
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
		]
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
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		]
	}],
	"clear-var": [{
		type: ModelElementTypes.SetVar,
		description: "Clears the local variable.",
		attributes: [
			{
				name: "name",
				description: "Name of the local variable to clear.",
				required: true,
				autoadd: true
			},
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		]
	}],
	"if": [{
		type: ModelElementTypes.If,
		description: "Starts a condition.",
		attributes: [
			{
				name: "description",
				description: "Developers' annotation.",
				autoadd: true
			},
			{
				name: "comment",
				description: "Developer's comment on this element."
			}
		],
		childs: [
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
		]
	}],
	"elseif": [{
		type: ModelElementTypes.ElseIf,
		description: "Indicates a new if statement in case the conditions of the current if statement are not fulfilled. Else-if elements have to be placed as siblings next to if elements or else-if elements, which themselves have no else element defined.",
		attributes: [
			{
				name: "description",
				description: "Developers' annotation.",
				autoadd: true
			},
			{
				name: "comment",
				description: "Developer's comment on this element."
			}
		],
		childs: [
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
		]
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
							"default": true
						},
						{
							name: "Like",
						},
						{
							name: "Greater",
						},
						{
							name: "Smaller",
						},
						{
							name: "GreaterOrEqual",
						},
						{
							name: "SmallerOrEqual",
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
			{
				name: "comment",
				description: "Developer's comment on this element."
			}
		]
	}],
	"then": [{
		type: ModelElementTypes.Unknown,
		description: "Indicates what should happen if the conditions are fulfilled.",
		attributes: [
			{
				name: "comment",
				description: "Developer's comment on this element."
			}
		],
		childs: [
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
				element: "rule"
			},
			{
				element: "forloop"
			},
			{
				element: "switch"
			},
			{
				element: "include"
			},
			{
				element: "model-condition"
			}
		]
	}],
	"else": [{
		type: ModelElementTypes.Unknown,
		description: "Else branch for the if 'statement'. What is below this element is executed if the condition of the if statement is not fulfilled.",
		attributes: [
			{
				name: "comment",
				description: "Developer's comment on this element."
			}
		],
		childs: [
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
				element: "rule"
			},
			{
				element: "forloop"
			},
			{
				element: "switch"
			},
		]
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
		childs: [
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
				element: "rule"
			},
			{
				element: "forloop"
			},
			{
				element: "switch"
			},
		]
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
			{
				name: "description",
				description: "Developers' annotation."
			},
			{
				name: "comment",
				description: "Developer's comment on this element."
			}
		],
		childs: [
			{
				element: "case",
				occurence: "at-least-once"
			},
			{
				element: "default",
				occurence: "once"
			}
		]
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
		childs: [
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
				element: "rule"
			},
			{
				element: "forloop"
			},
			{
				element: "switch"
			},
		]
	}],
	"default": [{
		type: ModelElementTypes.Unknown,
		description: "",
		childs: [
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
				element: "rule"
			},
			{
				element: "forloop"
			},
			{
				element: "switch"
			},
		]
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
		childs: [
			{
				element: "break"
			},
			{
				element: "return"
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
				element: "rule"
			},
			{
				element: "forloop"
			},
			{
				element: "switch"
			},
		]
	}],
	"break": [{
		type: ModelElementTypes.Unknown,
		description: "Terminates the current loop.",
	}],
	"return": [{
		type: ModelElementTypes.Unknown,
		description: "Terminates the current rule.",
	}],
	"include_blocks": [include_blocks_element],
	"include-block": [{
		type: ModelElementTypes.IncludeBlock,
		detailLevel: ModelDetailLevel.Declarations,
		description: "A model fragment that is included by includes.",
		attributes: [
			{
				name: "name",
				description: "Unique identifier",
				required: true,
				autoadd: true,
			},
			{
				name: "meta-name",
				description: "For which element to apply rules.",
				required: true,
				autoadd: true,
				type:
				{
					type: AttributeTypes.Enum,
					options: [
						{
							name: ModelElementTypes.Module
						},
						{
							name: ModelElementTypes.Rule
						},
						{
							name: ModelElementTypes.Action
						},
						{
							name: ModelElementTypes.If
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
					]
				}
			},
			{
				name: "meta-index",
				description: "For which element to apply rules."
			},
			dev_comment_attribute
		],
		childs: {
			matchElementFromAttribute: "meta-name"
		}
	}],
	"include": [include_element],
	"merge-instruction": [merge_instruction_element],
	"model-condition": [model_condition_element]
};