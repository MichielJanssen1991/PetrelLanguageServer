import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { decorations_element, decoration_argument_element, decoration_element, decorators_element, decorator_context_entity_element, decorator_element, decorator_input_element, default_yes_no_attribute_type, dev_comment_attribute, dev_description_attribute, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute, include_blocks_element, include_element, target_element, target_namespace_attribute, view_argument_element } from './shared';

export const FRONTEND_DEFINITION: Definitions = {
	"root": [{
		description: "Project root of the frontend model.",
		childs: [
			{
				element: "application",
				occurence: "at-least-once"
			},
			{
				element: "resources",
				occurence: "once"
			},
			{
				element: "document"
			}
		]
	}],
	"application": [{
		description: "",
		attributes: [
			{
				name: "appearance",
				description: "Main style, as defined in styles.xml.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Style
				}
			}
		],
		childs: [
			{
				element: "views",
				occurence: "once"
			},
			{
				element: "toolbars",
				occurence: "once"
			},
			{
				element: "trees",
				occurence: "once"
			},
			{
				element: "tree",
				occurence: "once"
			},
			{
				element: "functions",
				occurence: "once"
			},
			{
				element: "module"
			},
			{
				element: "resources",
				occurence: "once"
			}
		]
	}],
	"include-block": [include_blocks_element],
	"include": [include_element],
	"main-view": [{
		description: "A page framework in which views are to be rendered.",
		attributes: [
			{
				name: "name",
				description: "Unique view name.",
				required: true,
			},
			{
				name: "file",
				description: "A URL of an HTML file to render inside.",
				type: {
					type: AttributeTypes.URL,
					default: "main.html"
				}
			},
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		]
	}],
	"module": [{
		type: ModelElementTypes.Module,
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
			},
			{
				element: "view"
			},
			{
				element: "main-view"
			}			
		]
	}],
	"trees": [{
		description: "Used to group navigation trees.",
		childs: [
			{
				element: "tree"
			},
			{
				element: "module"
			}
		]
	}],
	"tree": [{
		description: "Navigation tree.",
		attributes: [
			{
				name: "name",
				description: "The unique name of the tree."
			},
			{
				name: "caption",
				description: "The title to display above the tree."
			},
			{
				name: "show",
				description: "If the node is initially visible.",
				type: default_yes_no_attribute_type
			},
			{
				name: "target-view",
				description: "Refers to a screen-active view to refresh with the views specified under the nodes of this tree when they are clicked.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.TargetView
				}
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "node",
				occurence: "at-least-once",
				required: true
			}
		]
	}],
	"node": [{
		description: "Navigation tree node, which may be expandable into more nodes.",
		attributes: [
			{
				name: "name",
				description: "Unique identifier. If no caption is specified, the name is used as caption.",
				required: true
			},
			{
				name: "caption",
				description: "The text to display on the node."
			},
			{
				name: "info",
				description: "Will appear as tooltip of the node."
			},
			{
				name: "target-view",
				description: "Refers to a screen-active view to refresh with the view specified under this node when this node is clicked.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.TargetView
				}
			},
			{
				name: "view",
				description: "The view to show when the node is clicked.",
				visibilityConditions: [
					{
						attribute: "childnode-view",	// TODO: check on childnodes instead of attribute
						condition: "==",
						value: "empty"
					}
				]
			},
			{
				name: "open",
				description: "if the node is expanded initially.",
				type: default_yes_no_attribute_type
			},
			{
				name: "url",
				description: "The URL to load in the target view when clicking this node."
			},
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "node"
			},
			{
				element: "events",
				occurence: "once"
			},
			{
				element: "view",
				occurence: "once"
			},
		]
	}],
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
	"decorations": [decorations_element],
	"decoration": [decoration_element],
	"decoration-argument": [decoration_argument_element],
	"decorators": [decorators_element],
	"decorator": [decorator_element],
	"decorator-input": [decorator_input_element],
	"target": [target_element],
	"decorator-context-entity": [decorator_context_entity_element]
};