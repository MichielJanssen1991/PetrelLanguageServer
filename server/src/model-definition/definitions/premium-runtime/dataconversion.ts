import { AttributeTypes, Definitions, ModelDetailLevel, ModelElementTypes } from '../../types/definitions';

export const DATACONVERSION_DEFINITION: Definitions = {
	"DataConversion": [{
		type: ModelElementTypes.Rule,
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			name: "RuleName",
			types: [{
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			}],
			detailLevel: ModelDetailLevel.References,
		}],
		children: []
	}],
	"Hash": [{
		attributes: [],
		children: []
	}]
};