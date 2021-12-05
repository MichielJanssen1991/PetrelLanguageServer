import { Definitions, ModelDetailLevel, ModelElementTypes } from '../symbolsAndReferences';

export const BACKEND_ACTIONS_DEFINITION: Definitions = {
	"actions": [{}],
	"action": [{
		type: ModelElementTypes.Action,
		isSymbolDeclaration: true,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations
	}],
	"annotation": [{}],
	"attribute": [{
		type: ModelElementTypes.Attribute,
		isSymbolDeclaration: true,
		detailLevel: ModelDetailLevel.Declarations
	}]
};