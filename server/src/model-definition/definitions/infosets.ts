import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { dev_comment_attribute, dev_description_attribute, target_namespace_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element, default_yes_no_attribute_type, dev_obsolete_attribute, dev_obsolete_message_attribute, dev_override_rights_attribute, dev_is_declaration_attribute, decorations_element, decorators_element, decorator_element, decoration_element, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute } from './shared';
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
			},
			{
				element: "include"
			}
		]
	}],
	"infoset": [{
		description: "A data query description.",
		type: ModelElementTypes.Infoset,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "name",
				description: "Unique name for the infoset.",
				required: true,
				validations: [
					{
						type: "regex",
						value: /^([A-Z][a-zA-Z]+\.)*[A-Za-z][A-Za-z0-9]*$/,
						message: "Mathematical symbols and punctuation are not allowed in model entity identifiers."
					}
				]
			},
			dev_obsolete_attribute,
			dev_obsolete_message_attribute,
			dev_override_rights_attribute,
			dev_is_declaration_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "input"
			},
			{
				element: "search",
				occurence: "once"
			},
			{
				element: "variable"
			},
			{
				element: "query",
				occurence: "once"
			},
			{
				element: "exists",
				occurence: "once"
			},
			{
				element: "count",
				occurence: "once"
			},
			{
				element: "min",
				occurence: "once"
			},
			{
				element: "max",
				occurence: "once"
			},
			{
				element: "sum",
				occurence: "once"
			},
			{
				element: "average",
				occurence: "once"
			},
			{
				element: "generate-interval",
				occurence: "once"
			},
			{
				element: "set-aggregate-query",
				occurence: "once"
			},
			{
				element: "single-aggregate-query",
				occurence: "once"
			},
		]
	}],
	"module": [{
		type: ModelElementTypes.Module,
		description: "Used for grouping model entities and model namespacing.",
		attributes: [
			{
				name: "name",
				description: "The name of the module"
			},
			target_namespace_attribute,
			dev_description_attribute,
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
				occurence: "once"
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
				type: default_yes_no_attribute_type
			},
			{
				name: "sort-column",
				description: "A single column on which the result is sorted.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute
				}
				,
				visibilityConditions: [
					{
						attribute: "sort",
						condition: "!=",
						value: "no"
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
				visibilityConditions: [
					{
						attribute: "sort-column",
						condition: "!=",
						value: ""
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
							default: true
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
							default: true
						}
					]
				}

			},
			{
				name: "filter",
				description: "The type filter to apply for search.",
				type: {
					type: AttributeTypes.Reference,
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
							default: true
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
		],
		childs: [
			{
				element: "searchcolumn"
			},
			{
				element: "searchcolumn-submatch"
			},
			{
				element: "group"
			},
			{
				element: "in"
			},
			{
				element: "full-text-query"
			},
			{
				element: "include"
			}
		]
	}],
	"searchcolumn": [{
		description: "Definition of the conditions of the search.",
		type: ModelElementTypes.SearchColumn,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "name",
				description: "The column to be searched.",
				required: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute,
				},
			},
			{
				name: "is-context-info",
				type: default_yes_no_attribute_type
			},
			{
				name: "search-relation-iids",
				description: "Only applicable to relation searchcolumns. Decides if the type will be searched by the specified display-as attribute (search-relation-iids = false) or by IId (search-relation-iids = true).",
				type: default_yes_no_attribute_type
			},
			{
				name: "condition",
				required: true,
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "xxx"
						}
					]
				}
			},
			{
				name: "value",
				description: "The column value to be searched. You can work with parameters in this query, by using the syntax {..}. For example: &lt;search type=\"Patientencounter\"&gt;&lt;searchcolumn name=\"patientID\" value=\"{@patientID}\" condition=\"IS\" /&gt;&lt;/search&gt;",
				visibilityConditions: [
					{
						attribute: "rule",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "match-searchfield",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "match-searchfield",
				description: "A field in the search query to match with.",
				visibilityConditions: [
					{
						attribute: "rule",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "value",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "match-searchfilter",
				description: "The search query to match the \"match-searchfield\" from. If empty, it will match from the current context search query.",
				visibilityConditions: [
					{
						attribute: "rule",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "value",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "rule",
				description: "A rule that computes the value to compare with. Only for rules with no required inputs.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Rule,
				},
				detailLevel: ModelDetailLevel.References,
				visibilityConditions: [
					{
						attribute: "value",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "match-searchfield",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "rule-output",
				description: "The name of the output argument of the rule to take for the value of this search column.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Output,
				},
				detailLevel: ModelDetailLevel.References,
				visibilityConditions: [
					{
						attribute: "rule",
						condition: "!=",
						value: ""
					}
				],
				requiredConditions: [
					{
						attribute: "rule",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "search-when-empty",
				description: "Whether to use this condition or not if the value is empty",
				type: default_yes_no_attribute_type,
			},
			{
				name: "sort",
				description: "The sequence in which multiple columns should be sorted.",
				type: {
					type: AttributeTypes.Numeric
				},
			},
			{
				name: "sort-order",
				description: "The order how the sort-column is ordered.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "ASC",
							description: "Sorts ascending."
						},
						{
							name: "DESC",
							description: "Sorts descending."
						},
						{
							name: "",
							description: "Takes the default sort order for this attribute."
						},
					]
				},
			},
		]
	}],
	"searchcolumn-submatch": [{}],
	"or": [{}],
	"and": [{}],
	"group": [{}],
	"in": [{
		type: ModelElementTypes.In,
		detailLevel: ModelDetailLevel.Declarations
	}],
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
				name: "name",
				required: true,
				description: "Unique name of the variable.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute,
				},
				detailLevel: ModelDetailLevel.SubReferences
			},
			{
				name: "attribute",
				description: "One of the attributes in the result data. If left empty, the 'iid' attribute will be fetched.",
				required: true,
				type: {		// TODO: add iid to the list of references since it is not a defined attribute of the type
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute,
				},
				detailLevel: ModelDetailLevel.SubReferences
			},
			{
				name: "operator",
				description: "May be used as a scalar over the result data. When left empty, the ''attribute'' value of the first record is returned.",
				required: true,
				type: {		
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "first non-empty attribute value"
						},
						{
							name: "PIPEDLIST",
							description: "piped list, the values of ''attribute'' in the records found as a piped list ('''1|2|3|4|'''), which can subsequently be used in another query"
						},
					]
				},
				detailLevel: ModelDetailLevel.SubReferences
			},
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_obsolete_attribute,
			dev_obsolete_message_attribute,
			dev_comment_attribute
		],
		childs: [ // HUH? ... WHY??
			{
				element: "input"
			},
			{
				element: "search"
			},
			{
				element: "query"
			},
			{
				element: "action"
			}
		]
	}],
	"decorators": [decorators_element],
	"decorator": [decorator_element],
	"decorations": [decorations_element],
	"decoration": [decoration_element],
	"action": [{
		type: ModelElementTypes.Action,
		description: "A functional action (thus one that takes data, and returns data) to apply to the calculated value.",
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
				visibilityConditions: [
					{
						"attribute": "name",
						"condition": "==",
						"value": "rule"
					}
				]
			}
		],
		childs: [
			{
				element: "input"
			},
			{
				element: "output"
			},
			{
				element: "graph-params"
			},
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