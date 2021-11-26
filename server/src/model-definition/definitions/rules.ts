import { AttributeTypes, JsonElementVariable, NewDefinition, ValidationLevels } from '../symbolsAndReferences';
import { dev_comment_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element } from './shared';
export const RULE_DEFINITION: NewDefinition[] = [
	{ 
		"element": "rules",		
		"description": "",
		"attributes" : [
			{
				"name": "comment",
				"description": "Developer's comment on this element"
			}
		],
		"childs": [
			{
				"element": "module"
			},
			{
				"element": "rule"
			},
			{
				"element": "include-blocks"
			},
			{
				"element": "include-block"
			},
			{
				"element": "include"
			},
			{
				"element": "model-condition"
			},
			{
				"element": "merge-instruction"
			}
		]
	},
	{ 
		"element": "module",
		"description": "Used for grouping model entities and model namespacing.",
		"attributes" : [
			{
				"name": "name",
				"description": "The module name.",
				"autoadd": true
			},
			{
				"name": "target-namespace",
				"description": "Target namespace of the contents of the module. A relative namespace may start with a +, e.g., \"+Preferences\" may result in, e.g., \"Platform.Preferences\". (The target namespace together with the module name makes the module unique.)",
				"autoadd": true,
				"validations": [
					{
						"type": "regex",
						"value": "(\\+?[A-Z][a-zA-Z]+(\\.[A-Z][a-zA-Z]+)*)?",		
						"message": "Only alphabetic, CamelCased words separated by dots are allowed.",
						"level": ValidationLevels.Fatal
					}
				]
			},
			{
				"name": "description",
				"description": "Description of contents and purpose."
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element"
			}
		],
		"childs": [
			{
				"element": "module"
			},
			{
				"element": "rule"
			},
			{
				"element": "include-blocks"
			},
			{
				"element": "include-block"
			},
			{
				"element": "include"
			},
			{
				"element": "model-condition"
			},
			{
				"element": "merge-instruction"
			}
		]
	},
	{ 
		"element": "rule",		
		"description": "You call a rule (from the client side) by using this name. A rule answers by returning several (name, value) - pairs.",
		"attributes":[
			{
				"name": "name",
				"description": "Unique identifier for the rule.",
				"autoadd": true,
				"validations": [
					{
						"type": "regex",
						"value": "[\\w_]+",		
						"message": "The name should only contain letters or underscore",
						"level": ValidationLevels.Fatal
					}
				],
				"conditions": [
					{
						"attribute": "import",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				"name": "cache-level",
				"description": "cache-level could be set to increase performance. If the cache-level is User, it will cache the output value based on the rule name, the project/application/company/user and the inputs that were passed to the rule. Setting the cache-level is only valid if this combined key always returns the same output. See [Caching rule invocations].",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "None",
								"description": ""
							},
							{
								"name": "User",
								"description": ""
							},
							{
								"name": "Company",
								"description": ""
							},
							{
								"name": "Application",
								"description": ""
							}							
						]
					}
				],
				"conditions": [
					{
						"attribute": "import",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				"name": "max-cache-duration-minutes",
				"description": "The maximum duration that the invocations will be cached. Only valid in case the cache-level has been set. By default it will be 1 to 5 minutes, depending on how often the rule is invoked with that input.",
				"conditions": [
					{
						"attribute": "import",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				"name": "ignore-empty-action-outputs",
				"description": "Whether to ignore empty action outputs when used for variable assignments, or allow them to overwrite filled variables. By default these empty action outputs are ignored, i.e. not allowed to overwrite a filled variable.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "yes",
								"description": ""
							},
							{
								"name": "no",
								"description": ""
							}						
						]
					}
				],
				"conditions": [
					{
						"attribute": "import",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				"name": "import",
				"description": "Refers to a different rule.",
				"types": [
					{
						"type": AttributeTypes.Reference,
						"relatedTo": "backend-rules"
					}
				],
				"conditions": [
					{
						"attribute": "name",
						"condition": "==",
						"value": ""
					}
				]
			},
			{
				"name": "obsolete",
				"description": "Set to yes if this model entity is obsolete. This means another way of modeling is prefered and this old functionality may be removed in the next version.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "yes",
								"description": ""
							},
							{
								"name": "no",
								"description": ""
							}						
						]
					}
				]
			},
			{
				"name": "obsolete-message",
				"description": "Indicate what to use as an alternative.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "yes",
								"description": ""
							},
							{
								"name": "no",
								"description": ""
							}						
						]
					}
				],
				"conditions": [
					{
						"attribute": "obsolete",
						"condition": "==",
						"value": "yes"
					}
				]
			},
			{
				"name": "override-rights",
				"description": "May restrict which layers can override / extend this declaration.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "All",
								"description": "Full"
							},
							{
								"name": "User",
								"description": "Allowed until User layer"
							},
							{
								"name": "Company",
								"description": "Allowed until Company layer"
							},
							{
								"name": "General",
								"description": "Allowed until General layer"
							},				
							{
								"name": "None",
								"description": "No override allowed, not even on the same level"
							}		
						]
					}
				]
				
			},
			{
				"name": "is-declaration",
				"description": "May be used to have a metadata item which only specifies override rights and not specifies an instance.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "yes"
							},
							{
								"name": "no"
							}	
						]
					}
				]
				
			},
			{
				"name": "ignore-modelcheck",
				"description": "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."				
			},
			{
				"name": "ignore-modelcheck-justification",
				"description": "If \"ignore-modelcheck\" was set, a justification why those model checks were ignored.",
				"conditions": [
					{
						"attribute": "ignore-modelcheck",
						"condition": "!=",
						"value": ""
					}
				]		
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		],
		"childs": [
			{
				"element": "input"
			},
			{
				"element": "output"
			},
			{
				"element": "action"
			},
			{
				"element": "forloop"
			},
			{
				"element": "set-var"
			},
			{
				"element": "if"
			},
			{
				"element": "elseif"
			},
			{
				"element": "transaction"
			},
			{
				"element": "clear-var"
			},
			{
				"element": "rule"
			},
			{
				"element": "switch"
			}
		]
	},
	{ 
		"element": "action",		
		"description": "An action.",
		"checkObsolete": true,
		"attributes":[
			{
				"name": "name",
				"description": "The action to perform.",
				"autoadd": true,
				"required": true,
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "@backend-actions/action/@name"
							}							
						]
					}
				]
			},
			{
				"name": "input-all",
				"description": "If yes, all available local variables (in the frontend, the non-data bound as well as the data bound variables) will be passed to the action. Default is no.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "yes"
							},
							{
								"name": "no"
							}	
						]
					}
				]
			},
			{
				"name": "output-all",
				"description": "If yes, all outputs returned by the action will be made available locally (in the frontend as non-data bound variables). Default is no.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "yes"
							},
							{
								"name": "no"
							}	
						]
					}
				]
			},
			{
				"name": "dataless",
				"description": "If the standard added data argument should be left out. It is now left out by default for performance (unless input-all is set). (Currently, only applicable for frontend calls to server actions.)",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "default"
							},
							{
								"name": "yes"
							},
							{
								"name": "no"
							}	
						]
					}
				]
			},
			{
				"name": "user-created",
				"description": "Set this flag to yes in case the rule name is not hard-coded. In that case the platform will check whether the current user is allowed to invoke the rule (the rule should be marked as external-invocable in the security.xml).",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "yes"
							},
							{
								"name": "no"
							}	
						]
					}
				],
				"conditions": [
					{
						"attribute": "name",
						"condition": "==",
						"value": "rule"
					}
				]		
			},
			{
				"name": "ignore-modelcheck",
				"description": "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
			},
			{
				"name": "ignore-modelcheck-justification",
				"description": "If \"ignore-modelcheck\" was set, a justification why those model checks were ignored.",
				"conditions": [
					{
						"attribute": "ignore-modelcheck",
						"condition": "!=",
						"value": ""
					}
				]		
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}			
		],
		"childs": [
			{
				"element": "argument"
			},
			{
				"element": "output",
				"validations":[
					{
						"identifier": "RULE00001",
						"name": "action-outputs-missing",
						"matches": [
							{
								"attribute": "(remote/local)-name",
								"condition": "misses",
								"value": new JsonElementVariable("backend-rules", "/output[@name]")
							},
							{
								"operator": "or",
								"attribute": "local-name",
								"condition": "misses",
								"value": new JsonElementVariable("backend-rules", "/output[@name]")			
							}
						],
						"message": "Missing defined output ${@backend-rules.output[name]} for rule ${@parent[rulename]}",			
						"level": ValidationLevels.Info,
						"conditions":[
							{
								"attribute": "@parent[name]",
								"condition": "==",
								"value": "rule"
							}
						]
					},
					{
						"identifier": "RULE00002",
						"name": "rule-outputs-notdefined",
						"matches": [
							{
								"attribute": "remote-name",
								"condition": "not-in",
								"value": new JsonElementVariable("backend-rules", "/output[@name]")			
							},
							{
								"attribute": "local-name",
								"condition": "not-in",
								"value": new JsonElementVariable("backend-rules", "/output[@name]")		
							}
						],
						"message": "Output ${@name} is not defined in rule ${@rulename}",			
						"level": ValidationLevels.Error,
						"conditions":[
							{
								"attribute": "@parent[name]",
								"condition": "==",
								"value": "rule"
							}
						]
					},
					{
						"identifier": "RULE00003",
						"name": "rule-outputs-not-used",
						"matches": [
							{
								"attribute": "(local/remote)-name",
								"condition": "not-in",
								"value": "@parent-rule-definition.arguments"
							},
							{
								"attribute": "(local/remote)-name",
								"condition": "not-in",
								"value": "@parent-rule-definition.condition[variable]"
							},
							{
								"attribute": "(local/remote)-name",
								"condition": "not-in-like",
								"value": "@parent-rule-definition.condition[expression]"
							},
							{
								"attribute": "(local/remote)-name",
								"condition": "not-in-like",
								"value": "@parent-rule-definition.set-var[expression]"
							},
							{
								"attribute": "(local/remote)-name",
								"condition": "not-in",
								"value": "@parent-rule-definition.output[variable]"	
							},
							{
								"attribute": "(local/remote)-name",
								"condition": "not-in-like",
								"value": "@parent-rule-definition.output[expression]"
							}							
						],
						"message": "Output ${@name} is outputted, but not used in rule ${@parent-rule-definition[name]}",			
						"level": ValidationLevels.Warning,
						"conditions":[
							{
								"attribute": "@parent[name]",
								"condition": "==",
								"value": "rule"
							}
						]
					}
				]
			},
			{
				"element": "graph-params"
			},
			{
				"element": "include-blocks"
			},
			{
				"element": "include-block"
			},
			{
				"element": "include"
			},
			{
				"element": "model-condition"
			},
			{
				"element": "merge-instruction"
			}
			
		]
	},
	{ 
		"element": "input",		
		"description": "Specifies an input argument.",
		"attributes": [
			{
				"name": "name",
				"description": "Unique name for the input.",
				"required": true,
				"autoadd": true
			},
			{
				"name": "required",
				"description": "If required is set to yes, an exception will be thrown if the input argument is not present.",
				"autoadd": true,
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "yes",
								"default": true
							},
							{
								"name": "no"
							}
						]
					}
				]			
			},
			{
				"name": "ignore-modelcheck",
				"description": "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
			},
			{
				"name": "ignore-modelcheck-justification",
				"description": "If \"ignore-modelcheck\" was set, a justification why those model checks were ignored.",
				"conditions": [
					{
						"attribute": "ignore-modelcheck",
						"condition": "!=",
						"value": ""
					}
				]		
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			},
		],		
	},
	{ 
		"element": "output",		
		"description": "Output of the rule. The rule will return (name, expression) as one of its value pairs. Any valid C# expression can be used; the syntax for parameters is {..}.",
		"attributes": [
			{
				"name": "name",
				"description": "Unique identifier for the output.",
				"required": true,
				"autoadd": true
			},
			{
				"name": "attribute",
				"description": "A local variable name, a constant, or a data element (not supported in drop-down).",
				"required": true,
				"autoadd": true,
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "$rule/input/@name"		// TODO
							},
							{
								"name": "$rule//set-var/@name"	// TODO
							},	
							{
								"name": "$rule//action/output/@local-name" // TODO
							}	
						]
					}
				]
			},
			{
				"name": "expression",
				"description": "Expression value."
			},
			{
				"name": "value",
				"description": "Fixed value."
			},
			{
				"name": "format",
				"description": "Indicates how numeric values will be formatted; for example '0.00'."
			},
			{
				"name": "postcondition",
				"description": "A condition to check the value with."				
			},
			{
				"name": "ignore-modelcheck",
				"description": "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
			},
			{
				"name": "ignore-modelcheck-justification",
				"description": "If \"ignore-modelcheck\" was set, a justification why those model checks were ignored.",
				"conditions": [
					{
						"attribute": "ignore-modelcheck",
						"condition": "!=",
						"value": ""
					}
				]		
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			},
		],		
	},
	{ 
		"element": "argument",		
		"description": "An argument to pass to the action.",
		"attributes": [
			{
				"name":"local-name",
				"autoadd": true
			}, 
			{
				"name":"remote-name",
				"autoadd": true
			}, 
			{
				"name":"value",
				"autoadd": true
			},
			{
				"name":"parseType",
				"description":"The type to which the argument value should be parsed.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "Petrel.ModelPath"
							}
						]
					}
				]
			},
			{
				"name":"precondition",
				"description":"A condition to check the value with.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "is not empty"
							}
						]
					}
				]
			},
			
		]
	},
	{ 
		"element": "set-var",		
		"description": "A variable assignment.",
		"attributes": [
			{
				"name": "name",
				"description": "Name under which the output is stored locally.",
				"required": true,
				"autoadd": true
			},
			{
				"name": "expression",
				"description": "A value expression.",
				"autoadd": true			
			},
			{
				"name": "infoset",
				"description": "An infoset which' contents to return.",
				"types": [
					{
						"type": AttributeTypes.Reference,
						"options": [
							{
								"name": "document(infosets)//infoset" // TODO
							}
						]
					}
				]
			},
			{
				"name": "infoset-variable",
				"description": "A variable from an infoset to be returned. If the rule engine wants to use a variable that is defined in the infosets.xml file, first all {..} parameters in the search query are resolved. Then Petrel is called with this query. The records are returned, one by one: from each record, the attribute with the defined name is taken, and on all of these values, an aggregation like operator is used",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "$infoset/variable/@name" // TODO
							}
						]
					}
				]
			},
			{
				"name": "value",
				"description": "A fixed value."
			},
			{
				"name": "ignore-modelcheck",
				"description": "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
			},
			{
				"name": "ignore-modelcheck-justification",
				"description": "If \"ignore-modelcheck\" was set, a justification why those model checks were ignored.",
				"conditions": [
					{
						"attribute": "ignore-modelcheck",
						"condition": "!=",
						"value": ""
					}
				]		
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		]
	},
	{ 
		"element": "clear-var",		
		"description": "Clears the local variable.",
		"attributes": [
			{
				"name": "name",
				"description": "Name of the local variable to clear.",
				"required": true,
				"autoadd": true
			},
			{
				"name": "ignore-modelcheck",
				"description": "A space separated list of modelchecks that should be ignored. When there is a model validation error or warning, the warning can be suppressed by using \"ignore-modelcheck\" property in the model code and put the validation error names from \"ModelCheck\" column as its values that can be found in modelchecker file output. When adding ignored model checks, make sure to document a justification in the \"ignore-modelcheck-justification\" field."
			},
			{
				"name": "ignore-modelcheck-justification",
				"description": "If \"ignore-modelcheck\" was set, a justification why those model checks were ignored.",
				"conditions": [
					{
						"attribute": "ignore-modelcheck",
						"condition": "!=",
						"value": ""
					}
				]		
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		]
	},
	{ 
		"element": "if",		
		"description": "Starts a condition.",
		"attributes": [
			{
				"name": "description",
				"description": "Developers' annotation.",
				"autoadd": true
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		],
		"childs": [
			{
				"element": "condition",
				"occurence": "at-least-once",
				"required": true
			},
			{
				"element": "then",
				"occurence": "once",
				"required": true
			},
			{
				"element": "else",
				"occurence": "once"
			},
		]
	},
	{ 
		"element": "elseif",		
		"description": "Indicates a new if statement in case the conditions of the current if statement are not fulfilled. Else-if elements have to be placed as siblings next to if elements or else-if elements, which themselves have no else element defined.",
		"attributes": [
			{
				"name": "description",
				"description": "Developers' annotation.",
				"autoadd": true
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		],
		"childs": [
			{
				"element": "condition",
				"occurence": "at-least-once",
				"required": true
			},
			{
				"element": "then",
				"occurence": "once",
				"required": true
			},
			{
				"element": "else",
				"occurence": "once"
			},
		]
	},
	{ 
		"element": "condition",		
		"description": "Condition item. One or more lines compose a condition.",
		"attributes": [
			{
				"name": "prefix",
				"description": "Used to group conditions.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": ""
							},
							{
								"name": "("
							},
							{
								"name": "(("
							},
							{
								"name": "((("
							},
							{
								"name": "(((("
							},							
							{
								"name": "NOT"
							},
							{
								"name": "NOT("
							},
							{
								"name": "NOT(("
							},
							{
								"name": "NOT((("
							},
							{
								"name": "NOT(((("
							},
							{
								"name": "AND"
							},
							{
								"name": "AND("
							},
							{
								"name": "AND(("
							},
							{
								"name": "AND((("
							},
							{
								"name": "AND(((("
							},							
							{
								"name": "AND NOT("
							},
							{
								"name": "AND NOT(("
							},
							{
								"name": "AND NOT((("
							},
							{
								"name": "AND NOT(((("
							},
							{
								"name": "OR"
							},
							{
								"name": "OR("
							},
							{
								"name": "OR(("
							},
							{
								"name": "OR((("
							},
							{
								"name": "OR(((("
							},
							{
								"name": "OR NOT("
							},
							{
								"name": "OR NOT(("
							},
							{
								"name": "OR NOT((("
							},
							{
								"name": "OR NOT(((("
							},					
						]
					}
				]
			},
			{
				"name": "variable",
				"description": "Left hand side of condition. Can be an expression as well (using {}).",
				"required": true,
				"autoadd": true,
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "@current-rule/input/@name",
							},												
							{
								"name": "@current-rule/set-var/@name",
							},											
							{
								"name": "@current-rule/action/output/@local-name",
							}												
						]
					}
				]
			},
			{
				"name": "operator",
				"required": true,
				"autoadd": true,
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "Is",
								"default": true
							},												
							{
								"name": "Like",
							},												
							{
								"name": "Greater",
							},												
							{
								"name": "Smaller",
							},												
							{
								"name": "GreaterOrEqual",
							},												
							{
								"name": "SmallerOrEqual",
							},												
							{
								"name": "Not",
							},												
							{
								"name": "StartsWith",
							},												
							{
								"name": "WildCard",
								"description": "Any wildcard search that is supported by the persistence, e.g., \"%[A-Z]_[0-9]\""
							},												
							{
								"name": "in-range",
								"description": "check whether variable is in the range mentioned in value or constant (includes lowerbound excludes upperbound)"
							},												
							{
								"name": "below-range",
								"description": "check whether variable is below the lower bound of the range mentioned in value or constant"
							},											
							{
								"name": "above-range",
								"description": "check whether variable is equal or larger than the higher bound of the range mentioned in value or constant"
							},											
							{
								"name": "contains",
								"description": "Checking multiple values is also supported (;-separated string as right hand side)."
							},											
							{
								"name": "misses",
								"description": "Checking multiple values is also supported (;-separated string as right hand side)."
							},											
																		
						]
					}
				]
			},
			{
				"name": "value",
				"description": "A right hand side value."			
			},
			{
				"name": "constant",
				"description": "A constant as right hand side.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "document(constants)/constants//variable/@name" // TODO
							}
						]
					}
				]
			},
			{
				"name": "expression",
				"description": "An expression as right hand side."
			},
			{
				"name": "postfix",
				"description": "Used to group conditions.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": ")"
							},
							{
								"name": "))"
							},
							{
								"name": ")))"
							},
							{
								"name": "))))"
							},
						]
					}
				]
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		]
	},
	{ 
		"element": "then",		
		"description": "Indicates what should happen if the conditions are fulfilled.",
		"attributes": [
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		],
		"childs": [
			{
				"element": "return"
			},
			{
				"element": "break"
			},
			{
				"element": "set-var"
			},
			{
				"element": "action"
			},
			{
				"element": "if"
			},
			{
				"element": "elseif"
			},
			{
				"element": "transaction"
			},
			{
				"element": "clear-var"
			},
			{
				"element": "rule"
			},
			{
				"element": "forloop"
			},
			{
				"element": "switch"
			},
		]
	},
	{ 
		"element": "else",		
		"description": "Else branch for the if 'statement'. What is below this element is executed if the condition of the if statement is not fulfilled.",
		"attributes": [
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		],
		"childs": [
			{
				"element": "return"
			},
			{
				"element": "break"
			},
			{
				"element": "set-var"
			},
			{
				"element": "action"
			},
			{
				"element": "if"
			},
			{
				"element": "elseif"
			},
			{
				"element": "transaction"
			},
			{
				"element": "clear-var"
			},
			{
				"element": "rule"
			},
			{
				"element": "forloop"
			},
			{
				"element": "switch"
			},
		]
	},
	{ 
		"element": "transaction",		
		"description": "Combines the set of actions executed inside it into one transaction, that will succeed or fail as a whole. NOTE: Currently only data actions will be rolled back when a transaction fails.",
		"attributes": [
			{
				"name": "scope-option",
				"description": "The meaning of the transaction scope change.",
				"types": [
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "",
								"description": "Ensures the content to take part in a transaction. If there is already a transaction running, the content is added to that transaction and will roll back with that transaction."
							},
							{
								"name": "Suppress",
								"description": "Suppresses the content to take part in any outside transaction. This is useful for logging or audit, when you don't want to roll back the logging but only the data."
							},
							{
								"name": "RequiresNew",
								"description": "Starts a new transaction, even if there is already an outer transaction running. Effectively the same as suppress + required."
							}
						]
					}
				]
			}
		],
		"childs": [
			{
				"element": "set-var"
			},
			{
				"element": "action"
			},
			{
				"element": "if"
			},
			{
				"element": "elseif"
			},
			{
				"element": "transaction"
			},
			{
				"element": "clear-var"
			},
			{
				"element": "rule"
			},
			{
				"element": "forloop"
			},
			{
				"element": "switch"
			},
		]
	},
	{ 
		"element": "switch",		
		"description": "",
		"attributes": [
			{
				"name": "variable",
				"description": "A local variable name, a constant, or a data element (not supported in drop-down).",
				"autoadd": true,
				"types":[
					{
						"type": AttributeTypes.Enum,
						"options" : [
							{
								"name": "$rule/input/@name"	// TODO
							},
							{
								"name": "$rule//set-var/@name"	// TODO
							},
							{
								"name": "$rule//action/output/@local-name"	// TODO
							},
						]
					}
				]
			},
			{
				"name": "expression",
				"description": "Expression value."
			},
			{
				"name": "description",
				"description": "Developers' annotation."
			},
			{
				"name": "comment",
				"description": "Developer's comment on this element."
			}
		],
		"childs": [
			{
				"element": "case",
				"occurence": "at-least-once"
			},
			{
				"element": "default",
				"occurence": "once"
			}
		]
	},
	{ 
		"element": "case",		
		"description": "",
		"attributes": [
			{
				"name": "value",
				"required": true,
				"autoadd": true
			}
		],
		"childs": [
			{
				"element": "set-var"
			},
			{
				"element": "action"
			},
			{
				"element": "if"
			},
			{
				"element": "elseif"
			},
			{
				"element": "transaction"
			},
			{
				"element": "clear-var"
			},
			{
				"element": "rule"
			},
			{
				"element": "forloop"
			},
			{
				"element": "switch"
			},
		]
	},
	{ 
		"element": "default",		
		"description": "",
		"childs": [
			{
				"element": "set-var"
			},
			{
				"element": "action"
			},
			{
				"element": "if"
			},
			{
				"element": "elseif"
			},
			{
				"element": "transaction"
			},
			{
				"element": "clear-var"
			},
			{
				"element": "rule"
			},
			{
				"element": "forloop"
			},
			{
				"element": "switch"
			},
		]
	},
	{ 
		"element": "forloop",		
		"description": "",
		"attributes": [
			{
				"name": "loopvar",
				"description": "The variable to increment during the loop. The variable is set to the start value at initialize.",
				"autoadd": true,
				"required": true
			},
			{
				"name": "start",
				"description": "The start value for the loop variable. If not specified, the start value will be one.",
				"required": true,
				"autoadd": true
			},
			{
				"name": "end",
				"description": "The last value of the loop variable before the loop ends. (The condition of ending the loop is: loop variable &lt;= end value.)",
				"required": true,
				"autoadd": true
			},
		],
		"childs": [
			{
				"element": "break"
			},
			{
				"element": "return"
			},
			{
				"element": "set-var"
			},
			{
				"element": "action"
			},
			{
				"element": "if"
			},
			{
				"element": "elseif"
			},
			{
				"element": "transaction"
			},
			{
				"element": "clear-var"
			},
			{
				"element": "rule"
			},
			{
				"element": "forloop"
			},
			{
				"element": "switch"
			},
		]
	},
	{ 
		"element": "break",		
		"description": "Terminates the current loop.",
	},
	{ 
		"element": "return",		
		"description": "Terminates the current rule.",
	},
	include_blocks_element,
	{
		"element": "include-block",
		"description": "A model fragment that is included by includes.",
		"attributes": [
			{
				"name": "name",
				"description": "Unique identifier",
				"required": true,
				"autoadd": true,
			},
			{
				"name": "meta-name",
				"description": "For which element to apply rules.",
				"required": true,
				"autoadd": true,
				"types":[
					{
						"type": AttributeTypes.Enum,
						"options": [
							{
								"name": "@backend-definition/element/@element"
							}
						]
					}
				]
			},
			{
				"name": "meta-index",
				"description": "For which element to apply rules."
			},
			dev_comment_attribute
		],
		"childs": [
			// depends on meta-name attribute
		]
	}, 
	include_element,
	merge_instruction_element,
	model_condition_element
];