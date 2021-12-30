import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { decorations_element, decoration_argument_element, decoration_element, decorators_element, decorator_context_entity_element, decorator_element, decorator_input_element, dev_comment_attribute, include_blocks_element, include_element, target_element, view_argument_element } from './shared';

export const FRONTEND_DEFINITION: Definitions = {
	"root": [{}],
	"application": [{}],
	"include-block": [include_blocks_element],
	"include": [include_element],
	"main-view": [{}],
	"module": [{
		type:ModelElementTypes.Module,
		detailLevel: ModelDetailLevel.Declarations
	}],
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
	"decorations": [decorations_element],
	"decoration": [decoration_element],
	"decoration-argument": [decoration_argument_element],
	"decorators": [decorators_element],
	"decorator": [decorator_element],
	"decorator-input": [decorator_input_element],
	"target": [target_element],
	"decorator-context-entity": [decorator_context_entity_element]
};