import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { dev_comment_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element } from './shared';
export const INFOSET_DEFINITION: Definitions = {
	"infosets": [{
		description: "Collection of infosets.",
		attributes: [
			dev_comment_attribute
		],
		childs: [
			{
				element: "module"
			},
			{
				element: "infoset"
			}
		]
	}],
	"infoset": [{
		type: ModelElementTypes.Infoset,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"module": [{
		type: ModelElementTypes.Module,
		description: "Used for grouping model entities and model namespacing.",
		attributes: [
			{
				name: "name",
				description: "The name of the module"
			},
			{
				name: "target-namespace",
				description: "Target namespace of the contents of the module. A relative namespace may start with a +, e.g., \"+Preferences\" may result in, e.g., \"Platform.Preferences\". (The target namespace together with the module name makes the module unique.)",
				"validations": [
					{
						type: "regex",
						"value": "(\\+?[A-Z][a-zA-Z]+(\\.[A-Z][a-zA-Z]+)*)?",
						"message": "Only alphabetic, CamelCased words separated by dots are allowed."
					}
				]
			},
			{
				name: "description",
				description: "Description of contents and purpose."
			}
		],
		childs: [
			{
				element: "module"
			},
			{
				element: "infoset"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			},
			{
				element: "include"
			},
			{
				element: "model-condition"
			},
			{
				element: "merge-instruction"
			},
			{
				element: "decorations",
				"occurence": "once"
			}
		]
	}],
	"search": [{
		type: ModelElementTypes.Search,
		description: "Data query.",
		attributes: [
			{
				name: "type",
				description: "The data type of the query."
			},
			{
				name: "sort",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "yes"
						},
						{
							name: "no"
						}
					]
				}
			},
			{
				name: "sort-column",
				description: "A single column on which the result is sorted.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "$type/attribute/@name"	// TODO
						}
					]
				}
				,
				conditions: [
					{
						"attribute": "sort",
						"condition": "!=",
						"value": "no"
					}
				]

			},
			{
				name: "sort-order",
				description: "The order how the sort-column is ordered.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "use platform default",
							"default": true
						},
						{
							name: "ASC",
							description: "sort order ascending"
						},
						{
							name: "DESC",
							description: "sort order descending"
						},
					]
				},
				conditions: [
					{
						"attribute": "sort-column",
						"condition": "!=",
						"value": ""
					}
				]
			},
			{
				name: "add-count",
				description: "Use add-count=\"no\" on infosets to gain performance if the count is not used. By default (when the setting default-add-count-in-search' is not defined), the count of the records is included when the infoset XML list is calculated, setting the attribute \"total-records\" on the XML list. However, this comes with a performance cost: the query to compute the total amount of records is heavy. (Notice this does not apply to a computed piped list of IIDs.) If the infoset is used in the frontend, the count is necessary if the total number of records has to be shown; this will be computed automatically. (Notice it is also possible to use the \"More\" button in a list view to avoid computing the total number of records.)",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "default"
						},
						{
							name: "yes"
						},
						{
							name: "no",
							"default": true
						}
					]
				}

			},
			{
				name: "add-relations",
				description: "Select relation attributes too. Set to 'yes' if you want to link a variable to a related attribute.",
				autoadd: true,
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "yes"
						},
						{
							name: "no",
							"default": true
						}
					]
				}

			},
			{
				name: "filter",
				description: "The type filter to apply for search.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "$type/filters/search/@name"	// TODO
						}
					]
				}
			},
			{
				name: "all-when-empty-filter",
				description: "If 'no' the search returns nothing (matches no record) when the filter is empty or if all the parameter based search columns are left out; if 'yes' it returns all records (matches all records).",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "yes",
							"default": true
						},
						{
							name: "no"
						}
					]
				}
			},
			{
				name: "alias",
				description: "An internal name for the search query which is available to use for 'match search field' purposes."
			},
			dev_comment_attribute
		]
	}],
	"searchcolumn": [{
		type: ModelElementTypes.SearchColumn,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [{
			name: "name",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Attribute,
			},
		},
		{
			name: "rule",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Rule,
			},
			detailLevel: ModelDetailLevel.References,
		}]
	}],
	"searchcolumn-submatch": [{}],
	"or": [{}],
	"and": [{}],
	"group": [{}],
	"in": [{}],
	"full-text-query": [{}],
	"query": [{}],
	"exists": [{}],
	"count": [{}],
	"min": [{}],
	"max": [{}],
	"average": [{}],
	"generate-interval": [{}],
	"set-aggregate-query": [{}],
	"single-aggregate-query": [{}],
	"aggregate-attribute": [{}],
	"aggregate-function": [{}],
	"grouping": [{}],
	"grouping-item": [{}],
	"variable": [{
		description: "An infoset can be based on one or more variables. The values of the contained infoset variables will be collected into the infoset. You can assign a fixed value to a variable, base it upon an aggregation, or base it upon a query.",
		type: ModelElementTypes.Output,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "attribute",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute,
				},
				detailLevel: ModelDetailLevel.SubReferences
			}
		],
	}],
	"decorators": [{
		type: ModelElementTypes.Decorators
	}],
	"decorator": [{
		type: ModelElementTypes.Decorator
	}],
	"decoration": [{
		type: ModelElementTypes.Decorator
	}],
	"action": [{
		type: ModelElementTypes.Action,
		description: "The action to perform.",
		attributes: [
			{
				name: "name",
				type:
				{
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Action,
				}
			},
			{
				name: "input-all"
			},
			{
				name: "output-all"
			},
			{
				name: "dataless",
				description: "If the standard added data argument should be left out. It is now left out by default for performance (unless input-all is set). (Currently, only applicable for frontend calls to server actions.)"
			},
			{
				name: "rulename"
			},
			{
				name: "user-created",
				description: "Set this flag to yes in case the rule name is not hard-coded. In that case the platform will check whether the current user is allowed to invoke the rule (the rule should be marked as external-invocable in the security.xml).",
				conditions: [
					{
						"attribute": "name",
						"condition": "==",
						"value": "rule"
					}
				]
			}
		]
	}],
	"include-blocks": [include_blocks_element],
	"include-block": [{
		type: ModelElementTypes.IncludeBlock
	}],
	"include": [include_element],
	"model-condition": [model_condition_element],
	"auto-key": [{
		"parent": {
			element: "attribute"
		}
	}],
	"merge-instruction": [merge_instruction_element]
};