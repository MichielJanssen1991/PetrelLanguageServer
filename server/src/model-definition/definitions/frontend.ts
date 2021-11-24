import { NewDefinition } from '../symbolsAndReferences';
import { dev_comment_attribute, include_blocks_element, include_element } from './shared';

export const FRONTEND_DEFINITION: NewDefinition[] = [
	{
		"element": "root"
	},
	{
		"element": "application"
	},
	include_blocks_element,
	include_element,
	{
		"element": "main-view"
	},
	{
		"element": "module"
	},
	{
		"element": "trees"
	},
	{
		"element": "tree"
	},
	{
		"element": "toolbars"
	},
	{
		"element": "toolbar"
	},
	{
		"element": "views"
	},
	{
		"element": "view"
	},
	{
		"element": "argument"
	},
	{
		"element": "events"
	},
	{
		"element": "server-events"
	},
	{
		"element": "event"
	},
	{
		"element": "attribute"
	},
	{
		"element": "group"
	},
	{
		"element": "button"
	},
	{
		"element": "tabber"
	},
	{
		"element": "tab"
	},
	{
		"element": "titlebar"
	},
	{
		"element": "dropdown"
	},
	{
		"element": "menu"
	},
	{
		"element": "text"
	},
	{
		"element": "icon"
	},
	{
		"element": "format"
	},
	{
		"element": "action"
	},
	{
		"element": "output"
	},
	{
		"element": "condition"
	},
	{
		"element": "field"
	},
	{
		"element": "or"
	},
	{
		"element": "and"
	},
	{
		"element": "group"	// waahhh... duplicate!!!! View-group and Condition-group are named the same!!!
	},
	{
		"element": "then"
	},
	{
		"element": "else"
	},
	{
		"element": "option"
	},
	{
		"element": "validations"
	},
	{
		"element": "validation"
	},
	{
		"element": "sort"
	},
	{
		"element": "list"
	},
	{
		"element": "node"
	},
	{
		"element": "attachments"
	},
	{
		"element": "layout"
	},
	{
		"element": "column"
	},
	{
		"element": "row"
	},
	{
		"element": "IconConditions"
	},
	{
		"element": "IconCondition"
	},
	{
		"element": "design"
	},
	{
		"element": "units"
	},
	{
		"element": "appointments"
	},
	{
		"element": "filters"
	},
	{
		"element": "filter"
	},
	{
		"element": "agenda-view"
	},
	{
		"element": "month-view"
	},
	{
		"element": "timeline-view"
	},
	{
		"element": "units-view"
	},
	{
		"element": "week-view"
	},
	{
		"element": "year-view"
	},
	{
		"element": "report-parameters"
	},
	{
		"element": "report-parameter"
	},
	{
		"element": "style-variable"
	},
	{
		"element": "functions"
	},
	{
		"element": "function"
	},
	{
		"element": "resources"
	},
	{
		"element": "script"
	},
	{
		"element": "stylesheet"
	},
	{ 
		"element": "decorations",		
		"description": "Group decorators applications of this element.",
		"attributes": [
			dev_comment_attribute
		],
		"childs": [
			{
				"element": "decoration"
			}
		]
	},
	{ 
		"element": "decoration",		
		"description": "Apply a decorator to this target element.",
		"attributes": [
			{
				"name": "name",
				"required": true,
				"autoadd": true
			},
			dev_comment_attribute
		],
		"childs": [
			{
				"element": "decoration-argument"
			}
		]
	},
	{ 
		"element": "decoration-argument",		
		"description": "Pass an input value to the decorator.",
		"attributes": [
			{
				"name": "name",
				"required": true,
				"autoadd": true
			},
			{
				"name": "value",
				"autoadd": true
			},
			dev_comment_attribute
		]
	},
	{ 
		"element": "decorators",		
		"description": "Use to group decorator definitions.",
		"childs": [
			{
				"element": "decorator"
			}
		]
	},
	{ 
		"element": "decorator",		
		"description": "Definition to decorate a target element with extra elements or attributes. It will always get a default argument, named \"TargetName\", which contains the name attribute of the element on which this decorator is applied.",
		"attributes": [
			{
				"name": "name",
				"required": true,
				"autoadd": true
			}
		],
		"childs": [
			{
				"element": "decorator-input",
				"occurence": "once",
				"required": true
			},
			{
				"element": "target",
				"occurence": "once",
				"required": true
			},
			{
				"element": "decorator-context-entity",
				"occurence": "once"
			},
		]
	},
	{ 
		"element": "decorator-input",		
		"description": "Declare an input for the decorator. This input can be used in an expression inside the decorator.",
		"attributes": [
			{
				"name": "name",
				"required": true,
				"autoadd": true
			},
			{
				"name": "required",
				"autoadd": true,
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
		]
	},
	{ 
		"element": "target",		
		"description": "This element is mandatory and is a 'placeholder' for the element on which the decorator is applied. It can be extended with attributes and elements. Elements outside this element will occur outside the target element also.",
		"attributes": [
			{
				"name": "meta-name",
				"description": "For which element to apply rules.",
				"types":[
					{
						"type": "enum",
						"options": [
							{
								"name": "@backend-definition/element/@element"
							}
						]
					}
				]
			}
		],
		"childs": [
			// depends on meta-name attribute
		]
	},
	{ 
		"element": "decorator-context-entity",		
		"description": "Some summary",
		"attributes": [
			{
				"name": "meta-name",
				"description": "For which element to apply rules.",
				"types":[
					{
						"type": "enum",
						"options": [
							{
								"name": "@backend-definition/element/@element"
							}
						]
					}
				]
			}
		],
		"childs": [
			// depends on meta-name attribute
		]
	}
];