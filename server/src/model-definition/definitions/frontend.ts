import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { dev_comment_attribute, include_blocks_element, include_element, view_argument_element } from './shared';

export const FRONTEND_DEFINITION: Definitions = {
	"root": [{}],
	"application": [{}],
	"include-block": [include_blocks_element],
	"include": [include_element],
	"main-view": [{}],
	"module": [{}],
	"trees": [{}],
	"tree": [{}],
	"toolbars": [{}],
	"toolbar": [{}],
	"views": [{}],
	"view": [{}],
	"argument": [view_argument_element],
	"events": [{}],
	"server-events": [{}],
	"event": [{}],
	"attribute": [{}],
	"group": [{}],
	"button": [{}],
	"tabber": [{}],
	"tab": [{}],
	"titlebar": [{}],
	"dropdown": [{}],
	"menu": [{}],
	"text": [{}],
	"icon": [{}],
	"format": [{}],
	"action": [{}],
	"output": [{}],
	"condition": [{}],
	"field": [{}],
	"or": [{}],
	"and": [{}],
	"then": [{}],
	"else": [{}],
	"option": [{}],
	"validations": [{}],
	"validation": [{}],
	"sort": [{}],
	"list": [{}],
	"node": [{}],
	"attachments": [{}],
	"layout": [{}],
	"column": [{}],
	"row": [{}],
	"IconConditions": [{}],
	"IconCondition": [{}],
	"design": [{}],
	"units": [{}],
	"appointments": [{}],
	"filters": [{}],
	"filter": [{}],
	"agenda-view": [{}],
	"month-view": [{}],
	"timeline-view": [{}],
	"units-view": [{}],
	"week-view": [{}],
	"year-view": [{}],
	"report-parameters": [{}],
	"report-parameter": [{}],
	"style-variable": [{}],
	"functions": [{}],
	"function": [{
		type: ModelElementTypes.Function,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"resources": [{}],
	"script": [{}],
	"stylesheet": [{}],
	"decorations": [{
		description: "Group decorators applications of this element.",
		attributes: [
			dev_comment_attribute
		],
		childs: [
			{
				element: "decoration"
			}
		]
	}],
	"decoration": [{
		description: "Apply a decorator to this target element.",
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
	}],
	"decoration-argument": [{
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
	}],
	"decorators": [{
		type: ModelElementTypes.Decorators,
		description: "Use to group decorator definitions.",
		childs: [
			{
				element: "decorator"
			}
		]
	}],
	"decorator": [{
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
				occurence: "once",
				required: true
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
	}],
	"decorator-input": [{
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
	}],
	"target": [{
		description: "This element is mandatory and is a 'placeholder' for the element on which the decorator is applied. It can be extended with attributes and elements. Elements outside this element will occur outside the target element also.",
		attributes: [
			{
				name: "meta-name",
				description: "For which element to apply rules.",
				type:
				{
					type: AttributeTypes.Reference,
					options: [
						{
							name: "@backend-definition/element/@element"
						}
					]
				}
			}
		],
		childs: [
			// depends on meta-name attribute
		]
	}],
	"decorator-context-entity": [{
		description: "Some summary",
		attributes: [
			{
				name: "meta-name",
				description: "For which element to apply rules.",
				type:
				{
					type: AttributeTypes.Reference,
					options: [
						{
							name: "@backend-definition/element/@element"
						}
					]
				}
			}
		],
		childs: [
			// depends on meta-name attribute
		]
	}]
};