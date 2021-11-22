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
		"element": "search"
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