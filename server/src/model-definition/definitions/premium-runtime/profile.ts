import { AttributeTypes, Definitions, ModelDetailLevel, ModelElementTypes } from '../../symbolsAndReferences';

export const PROFILE_DEFINITION: Definitions = {
	"Profile": [{
		attributes: [],
		children: [
			{element:"ProfileTypes"},
			{element:"ProfileViews"},
			{element:"ProfileRules"},
		]
	}],
	"ProfileTypes": [{
		attributes: [],
		children: [
			{element:"ProfileType"},
		]
	}],
	"ProfileViews": [{
		attributes: [],
		children: [
			{element:"ProfileView"},
		]
	}],
	"ProfileRules": [{
		attributes: [],
		children: [
			{element:"ProfileType"},
		]
	}],
	"ProfileType": [{
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			name: "TypeName",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Type,
			},
			detailLevel: ModelDetailLevel.References,
		}],
		children: []
	}],
	"ProfileView": [{
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			name: "ViewName",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.View,
			},
			detailLevel: ModelDetailLevel.References,
		}],
		children: []
	}],
	"ProfileRule": [{
		detailLevel: ModelDetailLevel.References,
		attributes: [{
			name: "RuleName",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
			detailLevel: ModelDetailLevel.References,
		}],
		children: []
	}],
	"Hash": [{
		attributes: [],
		children: []
	}]
};