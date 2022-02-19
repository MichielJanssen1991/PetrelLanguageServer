import { AttributeTypes, Definitions, ModelDetailLevel, ModelElementTypes } from '../../symbolsAndReferences';

export const DATACONVERSION_DEFINITION: Definitions = {
	"DataConversion": [{
		type: ModelElementTypes.Rule,
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
			detailLevel: ModelDetailLevel.References,
			name: "RuleName"
		}],
		children: []
	}],
	"Hash": [{
		attributes: [],
		children: []
	}]
};