import { NewDefinition } from '../symbolsAndReferences';
import { dev_comment_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element } from './shared';
export const INFOSET_DEFINITION: NewDefinition[] = [
	{
		"element": "infosets",
		"description": "Collection of infosets.",
		"attributes" : [
			dev_comment_attribute
		],
		"childs": [
			{
				"element": "module"
			},
			{
				"element": "infoset"
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
				"element": "infoset"
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
		"element": "search",
		"description": "Data query.",
		"attributes": [
			{
				"name": "type",
				"description": "The data type of the query."
			},
			{
				"name": "sort",
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
				"name": "sort-column",
				"description": "A single column on which the result is sorted.",
				"types": [
					{
						"type": "enum",
						"options": [
							{
								"name": "$type/attribute/@name"	// TODO
							}
						]
					}
				],
				"conditions": [
					{
						"attribute": "sort",
						"condition": "!=",
						"value": "no"
					}
				] 

			},
			{
				"name": "sort-order",
				"description": "The order how the sort-column is ordered.",
				"types": [
					{
						"type": "enum",
						"options": [
							{
								"name": "",
								"description": "use platform default",
								"default": true
							},
							{
								"name": "ASC",
								"description": "sort order ascending"
							},
							{
								"name": "DESC",
								"description": "sort order descending"
							},
						]
					}
				],
				"conditions": [
					{
						"attribute": "sort-column",
						"condition": "!=",
						"value": ""
					}
				]
			},
			{
				"name": "add-count",
				"description": "Use add-count=\"no\" on infosets to gain performance if the count is not used. By default (when the setting default-add-count-in-search' is not defined), the count of the records is included when the infoset XML list is calculated, setting the attribute \"total-records\" on the XML list. However, this comes with a performance cost: the query to compute the total amount of records is heavy. (Notice this does not apply to a computed piped list of IIDs.) If the infoset is used in the frontend, the count is necessary if the total number of records has to be shown; this will be computed automatically. (Notice it is also possible to use the \"More\" button in a list view to avoid computing the total number of records.)",
				"types": [
					{
						"type": "enum",
						"options": [
							{
								"name": "",
								"description": "default"
							},
							{
								"name": "yes"
							},
							{
								"name": "no",
								"default": true
							}
						]
					}
				]
			},
			{
				"name": "add-relations",
				"description": "Select relation attributes too. Set to 'yes' if you want to link a variable to a related attribute.",
				"autoadd": true,
				"types": [
					{
						"type": "enum",
						"options": [
							{
								"name": "yes"
							},
							{
								"name": "no",
								"default": true
							}
						]
					}
				]
			},
			{
				"name": "filter",
				"description": "The type filter to apply for search.",
				"types": [
					{
						"type": "enum",
						"options": [
							{
								"name": "$type/filters/search/@name"	// TODO
							}
						]
					}
				]
			},
			{
				"name": "all-when-empty-filter",
				"description": "If 'no' the search returns nothing (matches no record) when the filter is empty or if all the parameter based search columns are left out; if 'yes' it returns all records (matches all records).",
				"types": [
					{
						"type": "enum",
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
				"name": "alias",
				"description": "An internal name for the search query which is available to use for 'match search field' purposes."
			},
			dev_comment_attribute
		]
	},
	{
		"element": "searchcolumn"
	},
	{
		"element": "searchcolumn-submatch"
	},
	{
		"element": "or"
	},
	{
		"element": "and"
	},
	{
		"element": "group"
	},
	{
		"element": "in"
	},
	{
		"element": "full-text-query"
	},
	{
		"element": "query"
	},
	{
		"element": "exists"
	},
	{
		"element": "count"
	},
	{
		"element": "min"
	},
	{
		"element": "max"
	},
	{
		"element": "average"
	},
	{
		"element": "generate-interval"
	},
	{
		"element": "set-aggregate-query"
	},
	{
		"element": "single-aggregate-query"
	},
	{
		"element": "aggregate-attribute"
	},
	{
		"element": "aggregate-function"
	},
	{
		"element": "grouping"
	},
	{
		"element": "grouping-item"
	},
	{
		"element": "grouping"
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
						"attribute": "name",
						"condition": "==",
						"value": "rule"
					}
				]
			}
		]
	},
	include_blocks_element,
	{
		"element": "include-block"
	}, 
	include_element,
	model_condition_element,
	{
		"element": "auto-key",
		"parent": {
			"element": "attribute"
		}
	},
	merge_instruction_element
];