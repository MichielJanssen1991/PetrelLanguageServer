import { Definitions } from '../../symbolsAndReferences';
import { INFOSET_DEFINITION } from '../infosets';

export const CQUERY_DEFINITION: Definitions = {
	...INFOSET_DEFINITION,
	"CQueries": [{
		attributes: [],
		children: [
			{ element: "Infosets" },
			{ element: "Hash" },
		]
	}],
	"Infosets": [{
		attributes: [],
		children: [
			{ element: "Infoset" }
		]
	}],
	"Infoset": [{
		attributes: [],
		children: [
			{ element: "infoset" },
		]
	}],
	"Hash":[{
		attributes: [],
		children: []
	}]
};