import { NewDefinition } from './symbolsAndReferences';
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
			},
			{
				"element": "decorations",
				"occurence": "once"
			}
		]
	},
	{ 
		"element": "module",		
		"description": "Used for grouping model entities and model namespacing.",
		"attributes" : [
			{
				"name": "name",
				"description": "The module name."
			},
			{
				"name": "target-namespace",
				"description": "Target namespace of the contents of the module. A relative namespace may start with a +, e.g., \"+Preferences\" may result in, e.g., \"Platform.Preferences\". (The target namespace together with the module name makes the module unique.)",
				"validations": [
					{
						"type": "regex",
						"value": "(\\+?[A-Z][a-zA-Z]+(\\.[A-Z][a-zA-Z]+)*)?",		
						"message": "Only alphabetic, CamelCased words separated by dots are allowed.",
						"level": "fatal"
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
			},
			{
				"element": "decorations",
				"occurence": "once"
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
				"validations": [
					{
						"type": "regex",
						"value": "[\\w_]+",		
						"message": "The name should only contain letters or underscore",
						"level": "fatal"
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
						"type": "enum",
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
						"type": "enum",
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
						"type": "relation",
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
						"type": "enum",
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
						"type": "enum",
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
			{
				"name": "override-rights",
				"description": "May restrict which layers can override / extend this declaration.",
				"types": [
					{
						"type": "enum",
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
						"type": "enum",
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
				"required": true,
				"types": [
					{
						"type": "enum",
						"options": [
							{
								"name": "rule"
							},
							{
								"name": "infoset"
							}	
						]
					},
					{
						"type": "relation",
						"relatedTo": "backend-actions"
					}
				]
			},
			{
				"name": "input-all",
				"description": "If yes, all available local variables (in the frontend, the non-data bound as well as the data bound variables) will be passed to the action. Default is no.",
				"types": [
					{
						"type": "enum",
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
						"type": "enum",
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
						"type": "enum",
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
						"type": "enum",
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
			},
			{
				"name": "@backend-actions.attribute",
				"description": "@backend-actions.annotation.documentation.summary",
				"required": "@backend-actions.attribute[required]",
				"types": [
					{
						"type": "@backend-actions.attribute[type]",
						"options": [
							{
								"name": "@backend-actions.attribute.option[value]",
								"description": "@backend-actions.attribute.option[comment]"
							}
						]
					}
				],
				"conditions": [
					{
						"attribute": "action",
						"condition": "contains",
						"value": "@backend-actions.name"
					}
				]		
			},
			{
				"name": "rulename",
				"description": "The name of the rule to call.",
				"types": [
					{
						"type": "relation",
						"relatedTo": "backend-rules",
						"namespaced": true
					}
				],
				"conditions": [
					{
						"attribute": "name",
						"condition": "contains",
						"value": "@backend-actions.attribute-rule"
					}
				]		
			},
			{
				"name": "type",
				"description": "Reference to a Backend type.",
				"types": [
					{
						"type": "relation",
						"relatedTo": "backend-types",
						"namespaced": true
					}
				],
				"conditions": [
					{
						"attribute": "name",
						"condition": "contains",
						"value": "@backend-actions.attribute-type"
					}
				]	
			},
			{
				"name": "typename",
				"description": "Reference to a Backend type.",
				"types": [
					{
						"type": "relation",
						"relatedTo": "backend-types",
						"namespaced": true
					}
				],
				"conditions": [
					{
						"attribute": "name",
						"condition": "contains",
						"value": "@backend-actions.attribute-typename"
					}
				]	
			},
			{
				"name": "folderpath",
				"description": "The folder path, relative to WWWRoot, of the target file(s).",
				"types": [
					{
						"type": "path",
						"pathHints": [
							{
								"name": "{resources}",
								"description": "path relative from resource folder"
							},
							{
								"name": "{{user}}",
								"description": "path relative from user temp folder"
							}
						]						
					}
				],
				"conditions": [
					{
						"attribute": "name",
						"condition": "contains",
						"value": "@backend-actions.attribute-folderpath"
					}
				]	
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
								"attribute": "remote-name",
								"condition": "misses",
								"value": "@backend-rules.outputs[name]"				
							},
							{
								"operator": "OR",
								"attribute": "local-name",
								"condition": "misses",
								"value": "@backend-rules.outputs[name]"					
							}
						],
						"message": "Missing defined output ${@backend-rules.output[name]} for rule ${@parent[rulename]}",			
						"level": "info",
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
								"value": "@backend-rules.outputs[name]"				
							},
							{
								"attribute": "local-name",
								"condition": "not-in",
								"value": "@backend-rules.outputs[name]"					
							}
						],
						"message": "Output ${@name} is not defined in rule ${@rulename}",			
						"level": "error",
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
						"level": "warning",
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
		"description": ""
	},
	{ 
		"element": "output",		
		"description": ""
	},
	{ 
		"element": "action",		
		"description": ""
	},
	{ 
		"element": "argument",		
		"description": "",
		"attributes": [
			{"name":"local-name"}, 
			{"name":"remote-name"}, 
			{"name":"value"}
		]
	},
	{ 
		"element": "set-var",		
		"description": ""
	},
	{ 
		"element": "if",		
		"description": ""
	},
	{ 
		"element": "condition",		
		"description": ""
	},
	{ 
		"element": "then",		
		"description": ""
	},
	{ 
		"element": "else",		
		"description": ""
	},
	{ 
		"element": "elseif",		
		"description": ""
	}
];