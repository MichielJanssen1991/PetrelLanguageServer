import { Definitions, ModelElementTypes } from '../../symbolsAndReferences';
import { BACKEND_DEFINITION } from '../backend';
import { FRONTEND_DEFINITION } from '../frontend';

export const CFORM_DEFINITION: Definitions = {
	...BACKEND_DEFINITION,
	...FRONTEND_DEFINITION,
	"CForms": [{
		attributes: [],
		children: [
			{ element: "Layouts" },
			{ element: "Types" },
			{ element: "Views" },
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
		type: ModelElementTypes.Views,//By using Views as type it allows view subelements
		children: [
			{ element: "view" },
		]
	}],
	"Hash":[{
		attributes: [],
		children: []
	}]
};