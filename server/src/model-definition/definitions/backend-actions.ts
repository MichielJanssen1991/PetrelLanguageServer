import { Definitions, ModelDetailLevel, ModelElementTypes } from '../symbolsAndReferences';

export const BACKEND_ACTIONS_DEFINITION: Definitions = {
	"actions": [{}],
	"action": [{
		type: ModelElementTypes.Action,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"annotation": [{}],
	"attribute": [{
		type: ModelElementTypes.Attribute,
		detailLevel: ModelDetailLevel.Declarations
	}]
};