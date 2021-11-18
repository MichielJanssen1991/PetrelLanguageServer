import { NewDefinition } from '../symbolsAndReferences';
export const BACKEND_DEFINITION: NewDefinition[] = [
	{
		"element": "root",
		"attributes" : [
			{
				"name": "documentlocation",
				"description": "relative location for the documents which are included in the rules"
			}
		],
		"childs": [
			{
				"element": "application",
				"occurence": "once"
			}
		]
	}, 
	{
		"element": "application",
		"attributes": [
			{
				"name": "name",
				"description": "The unique name of the application"
			}
		],
		"childs": [
			{
				"element": "module"
			},
			{
				"element": "type"
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
				"element": "decorators"
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
		"attributes": [
			{
				"name": "name",
				"description": "The name of the module"
			},
			{
				"name": "target-namespace",
				"description": "Target namespace of the contents of the module. A relative namespace may start with a +, e.g., \"+Preferences\" may result in, e.g., \"Platform.Preferences\". (The target namespace together with the module name makes the module unique.)",
				"validations": [
					{
						"type": "regex",
						"value": "(\\+?[A-Z][a-zA-Z]+(\\.[A-Z][a-zA-Z]+)*)?",
						"message": "Only alphabetic, CamelCased words separated by dots are allowed."
					}
				]
			},
			{
				"name": "description",
				"description": "Description of contents and purpose."
			}
		],
		"childs": [
			{
				"element": "module"
			},
			{
				"element": "type"
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
		"element": "type",
		"description": "",
		"attributes": [
			{
				"name": "persistence",
				"description": "The way the data for this type is retrieved and saved.",
				"types": [
					{
						"type": "enum",
						"options": [
							{
								"name": "Virtual",
								"description": "This persistence saves and gets the data from a different type (specified with the attribute \"persistent-in-type\"). This is a technical solution that may be used for more purposes.</summary>One use is that subclasses of a type may be represented, such as PhlegmaticPatient as a subclass of Patients. A \"virtual filter\" may be added in this case to filter the Patients on the property \"suffers-from\" with the value \"Phlegmatism\". Another use is to provide different views on a type for performance reasons. You can e.g. provide a simple Patient type and a Patient type with also contains some relation fields."
							},
							{	
								"name": "CompanyInspecific",
								"description": "A table multiple companies share."
							}
						]
					}
				]
			},
			{
				"name": "persistent-in-type",
				"description": "The type on which the virtual persistence is based.",
				"types": [
					{
						"type": "relation",
						"relatedTo": "backend-types"
					}
				],
				"required": true,
				"conditions": [
					{
						"attribute": "persistence",
						"condition": "==",
						"value": "Virtual"
					}
				]
			},
			{
				"name": "virtual-filter",
				"description": "A filter from the base type to select. It is also possible to define a virtual-filter under this type instead.",
				"conditions": [
					{
						"attribute": "persistence",
						"condition": "==",
						"value": "Virtual"
					}
				]
			},
			{
				"name": "include-persistencetype-checks",
				"description": "If the server events on the type that is used for persistence should be executed. This is only of technical use to provide a lightweight view of a type, e.g. skipping validation and other default loading actions.",
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
						"attribute": "persistence",
						"condition": "==",
						"value": "Virtual"
					}
				]
			},
			{
				"name": "audit-trail",
				"description": "Specifies if changes to the type instances should be logged in an audit log table.</summary>The audit log includes timestamp, user, and the change.",
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
		]
	}, 
	{
		"element": "attribute"
	}, 
	{
		"element": "option"
	}, 
	{
		"element": "keys"
	}, 
	{
		"element": "key"
	}, 
	{
		"element": "keyfield"
	}, 
	{
		"element": "format"
	}, 
	{
		"element": "image"
	}, 
	{
		"element": "text"
	},
	{
		"element": "server-events"
	},
	{
		"element": "server-event"
	},
	{
		"element": "decorators"
	},
	{
		"element": "decorator"
	},
	{
		"element": "decoration"
	},
	{	
		"element": "action",
		"description": "The action to perform.",
		"attributes": [
			{
				"name": "name",
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
				"name": "input-all"
			},
			{
				"name": "output-all"
			},
			{
				"name": "dataless",
				"description": "If the standard added data argument should be left out. It is now left out by default for performance (unless input-all is set). (Currently, only applicable for frontend calls to server actions.)"
			},
			{
				"name": "rulename"
			},
			{
				"name": "user-created",
				"description": "Set this flag to yes in case the rule name is not hard-coded. In that case the platform will check whether the current user is allowed to invoke the rule (the rule should be marked as external-invocable in the security.xml).",
				"conditions":[
					{
						"name": "name",
						"condition": "==",
						"value": "rule"
					}
				]
			}
		]	

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
		"element": "auto-key",
		"parent": {
			"element": "attribute"
		}
	},
	{
		"element": "merge-instruction"
	}
];