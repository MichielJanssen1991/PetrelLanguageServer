import { Definitions, ModelElementTypes } from '../../types/definitions';
import { BACKEND_DEFINITION } from '../backend';
import { FRONTEND_DEFINITION } from '../frontend';
import { RULE_DEFINITION } from '../rules';

export const CFORM_DEFINITION: Definitions = {
	...FRONTEND_DEFINITION,
	...BACKEND_DEFINITION,
	...RULE_DEFINITION,
	"CForms": [{
		attributes: [],
		children: [
			{ element: "Layouts" },
			{ element: "Types" },
			{ element: "Views" },
			{ element: "Rules" },
			{ element: "Hash" },
		]
	}],
	"Layouts": [{
		attributes: [],
		children: []
	}],
	"Types": [{
		attributes: [],
		children: [
			{ element: "Type" }
		]
	}],
	"Type": [{
		attributes: [],
		children: [
			{ element: "type" },
		]
	}],
	"Views": [{
		attributes: [],
		children: [
			{ element: "View" },
		]
	}],
	"View": [{
		attributes: [],
		type: ModelElementTypes.Views, //By using Views as type it matches for view subelements
		children: [
			{ element: "view" },
		]
	}],
	"Rules": [{
		attributes: [],
		children: [
			{ element: "Rule" },
		]
	}],
	"Rule": [{
		attributes: [],
		children: [
			{ element: "rule" },
		]
	}],
	"Hash":[{
		attributes: [],
		children: []
	}]
};