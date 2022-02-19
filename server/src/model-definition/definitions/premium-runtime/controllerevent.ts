import { Definitions } from '../../symbolsAndReferences';
import { FRONTEND_DEFINITION } from '../frontend';
import { RULE_DEFINITION } from '../rules';

export const CONTROLLER_EVENT_DEFINITION: Definitions = {
	...RULE_DEFINITION,
	...FRONTEND_DEFINITION,
	"ControllerEvents": [{
		attributes: [],
		children: [
			{ element: "Functions" },
			{ element: "Rules" },
			{ element: "Hash" },
		]
	}],
	"Functions": [{
		attributes: [],
		children: [
			{ element: "Function" }
		]
	}],
	"Function": [{
		attributes: [],
		children: [
			{ element: "function" },
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