import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { dev_comment_attribute, dev_description_attribute, target_namespace_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element, default_yes_no_attribute_type, dev_obsolete_attribute, dev_obsolete_message_attribute, dev_override_rights_attribute, dev_is_declaration_attribute, decorations_element, decorators_element, decorator_element, decoration_element, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute, search_condition_options_attribute_type, search_childs, search_attributes, input_element, default_true_false_attribute_type } from './shared';
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
				description: "The data type of the query.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				},
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
				},
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
		childs: search_childs
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
				type: default_true_false_attribute_type
			},
			{
				name: "condition",
				description: "The search condition.",
				required: true,
				type: search_condition_options_attribute_type
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
	"searchcolumn-submatch": [{
		description: "A condition that matches an attribute with sub query results.",
		attributes: [
			{
				name: "name",
				description: "The column to be searched.",
				required: true
			},
			{
				name: "is-context-info",
				type: default_yes_no_attribute_type
			},
			{
				name: "search-relation-iids",
				description: "Only applicable to relation searchcolumns. Decides if the type will be searched by the specified display-as attribute (search-relation-iids = false) or by IId (search-relation-iids = true).",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "true"
						},
						{
							name: "false"
						},
					]
				}
			},
			{
				name: "condition",
				description: "The search condition.",
				required: true,
				type: search_condition_options_attribute_type
			}
		],
		childs: [
			{
				element: "scalar-aggregate-query",
				occurence: "once"
			},
			{
				element: "set-aggregate-query",
				occurence: "once"
			}
		]
	}],
	"or": [{
		description: "The or-operator between search columns. Use the group element to specify brackets."
	}],
	"and": [{
		description: "The and-operator between search columns. In fact, and is the default, so it can be omitted."
	}],
	"group": [{
		description: "",
		childs: search_childs
	}],
	"in": [{
		description: "Applies a querying condition to a relation. This may be a relation from the queried type to another type, or vice versa. It may even be applied to non-relation attributes.",
		type: ModelElementTypes.In,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "field",
				description: "The name of the attribute defined at the type of which the value is compared with the set returned by the sub query.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute	// TODO filter on type + add iid to the list
				}
			},
			{
				name: "include-empty",
				description: "If results where the relation is empty are included too.",
				type: default_yes_no_attribute_type
			},
			{
				name: "condition",
				description: "The condition to apply for filtering the relation field using the filter applied to the relation instances.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "is included in",
							default: true
						},
						{
							name: "is not included in"
						}
					]
				}
			},
			{
				name: "search-when-empty",
				description: "Whether to drop this where-in condition if the filter is empty (if all the parameter based search columns are left out).",
				type: default_yes_no_attribute_type
			},
			{
				name: "sub-filter-select-field",
				description: "The attribute of the type queried in the sub query to match on. Default is the IID.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute	// TODO add iid to the list
				}
			}
		],
		childs: [
			{
				element: "search",
				required: true,
				occurence: "once"
			}
		]
	}],
	"full-text-query": [{
		description: "A full text search query criterion. This must be added at the root of a search filter. It may be combined with other search criteria.",
		attributes: [
			{
				name: "query",
				description: "The free text string to query on. Logical operators like AND/OR or quotes are ignored. Multiple values separated by pipe are note supported.",
				required: true
			}
		]
	}],
	"query": [{
		description: "A specific data query command.",
		childs: [
			{
				element: "select",
				occurence: "once"
			},
			{
				element: "delete",
				occurence: "once"
			}
		]
	}],
	"exists": [{
		description: "Evaluates if a selected data object exists.",
		attributes: search_attributes,
		childs: search_childs
	}],
	"count": [{
		description: "Evaluates the count over the selected data objects.",
		attributes: search_attributes,
		childs: search_childs
	}],
	"min": [{
		description: "Evaluates the minimal value of an attribute over the selected data objects.",
		attributes: search_attributes,
		childs: search_childs
	}],
	"max": [{
		description: "Evaluates the maximal value of an attribute over the selected data objects.",
		attributes: search_attributes,
		childs: search_childs
	}],
	"average": [{
		description: "Evaluates the average of an attribute over the selected data objects.",
		attributes: search_attributes,
		childs: search_childs
	}],
	"sum": [{
		description: "Evaluates the sum of an attribute over the selected data objects.",
		attributes: search_attributes,
		childs: search_childs
	}],
	"generate-interval": [{
		description: "Will generate a series of values for the attribute \"x\". See the type \"XType\" in the generic backend.",
		attributes: [
			{
				name: "min",
				description: "The first x-value of the series that has to be generated.",
				required: true,
				validations: [
					{
						type: "regex",
						value: /^\d+(\.\d+)?$/,
						message: "Invalid value given."
					}
				]
			},
			{
				name: "max",
				description: "The last x-value of the series that has to be generated.",
				required: true,
				validations: [
					{
						type: "regex",
						value: /^\d+(\.\d+)?$/,
						message: "Invalid value given."
					}
				]
			},
			{
				name: "steps",
				description: "Integer that specifies in how much steps to divide max-min x-values.",
				required: true,
				type: {
					type: AttributeTypes.Numeric
				}
			},
		]
	}],
	"set-aggregate-query": [{
		description: "Specifies an aggregate query that returns a set of aggregate result objects.",
		attributes: [
			{
				name: "type",
				description: "The type of the objects to apply the query to.",
				required: true
			},
			{
				name: "filter",
				description: "A reference to a filter on the type being queryed. May also be defined inline.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.TypeFilter // TODO: should not be visible if child group is added
				}
			},
			{
				name: "page-size",
				description: "The number of results per page. Default, no paging is used.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "page-number",
				description: "The number of the page to return. Default, the first page is returned.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "result-type",
				description: "The result type of the aggregate results. If not specified, returns results of the Platform.AggregateResults type.</summary>Define a type inheriting from Platform.AggregateResults. Relation attributes may be added to this type, and views can be created for it.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				}
			},
			{
				name: "grouping",
				description: "A reference to a grouping on the type being queryed. May also be defined inline."	// TODO: should not be visible if child group is added
			}
		],
		childs: [
			{
				element: "aggregate-attribute",
				occurence: "at-least-once",
				required: true
			},
			{
				element: "grouping",
				occurence: "once"
			},
			{
				element: "ordering",
				occurence: "once"
			},
			{
				element: "filter",
				occurence: "once"
			},
		]
	}],
	"single-aggregate-query": [{
		description: "Specifies an aggregate query that returns a single aggregate result object.",
		attributes: [
			{
				name: "type",
				description: "The type of the objects to apply the query to.",
				required: true
			},
			{
				name: "filter",
				description: "A reference to a filter on the type being queryed. May also be defined inline.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.TypeFilter // TODO: should not be visible if child group is added
				}
			},
			{
				name: "result-type",
				description: "The result type of the aggregate results. If not specified, returns results of the Platform.AggregateResults type.</summary>Define a type inheriting from Platform.AggregateResults. Relation attributes may be added to this type, and views can be created for it.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				}
			}
		],
		childs: [
			{
				element: "aggregate-attribute",
				occurence: "at-least-once",
				required: true
			},
			{
				element: "filter",
				occurence: "once"
			}
		]
	}],
	"aggregate-attribute": [{
		description: "Specifies an aggregate result.",
		attributes: [
			{
				name: "name",
				required: true,
				description: "Unique identifer. This name is used as output name."
			}
		], 
		childs: [
			{
				element: "aggregate-function"
			}
		]
	}],
	"aggregate-function": [{
		description: "Specifies the value of an aggregate.",
		attributes: [
			{
				name: "name",
				description: "The function to apply.",
				required: true,
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "common value"
						},
						{
							name: "sum"
						},
						{
							name: "maximum"
						},
						{
							name: "minimum"
						},
						{
							name: "average"
						},
						{
							name: "count"
						},
					]
				}
			},
			{
				name: "attribute",
				description: "The attribute parameter to the function.",
				requiredConditions: [
					{
						attribute: "name",
						condition: "==",
						value: "count"
					}
				]
			}
		]
	}],
	"ordering": [{
		description: "An ordering over sets of objects of a certain type.",
		childs: [
			{
				element: "sort",
				occurence: "at-least-once",
				required: true
			}
		]
	}],
	"sort": [{
		description: "Defines an ordering over a property of objects of a certain type. Multiple property orderings may be stacked.",
		attributes: [
			{
				name: "name",
				description: "Specifies an attribute of the type to order by.",
				required: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute
				}
			},
			{
				name: "order",
				description: "The type of ordering over the values of the property to order by.",
				autoadd: true,
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "asc",
							description: "Ascending",
							default: true
						},
						{
							name: "desc",
							description: "Descending"
						},
					]
				}
			},
		],
		childs: [
			{
				element: "sort",
				occurence: "at-least-once",
				required: true
			}
		]
	}],
	"grouping": [{
		description: "A grouping over sets of objects of a certain type.",
		childs: [
			{
				element: "grouping-item",
				occurence: "at-least-once",
				required: true
			}
		]
	}],
	"grouping-item": [{
		description: "A property of an object to group over.",
		attributes: [
			{
				name: "attribute",
				description: "Specifies a type attribute to use as grouping."
			}
		]
	}],
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
		type: ModelElementTypes.IncludeBlock,
		detailLevel: ModelDetailLevel.Declarations,
		description: "A model fragment that is included by includes.",
		attributes: [
			{
				name: "name",
				description: "Unique identifier",
				required: true,
				autoadd: true,
			},
			{
				name: "meta-name",
				description: "For which element to apply rules.",
				required: true,
				autoadd: true,
				type:
				{
					type: AttributeTypes.Enum,
					options: [
						{
							name: ModelElementTypes.Module
						},
						{
							name: ModelElementTypes.Infoset
						},
						{
							name: ModelElementTypes.Variable
						},
						{
							name: ModelElementTypes.Action
						},
						{
							name: "search"
						},
						{
							name: "searchcolumn"
						}
					]
				}
			},
			{
				name: "meta-index",
				description: "For which element to apply rules."
			},
			dev_comment_attribute
		],
		childs: {
			matchElementFromAttribute: "meta-name"
		}
	}],
	"include": [include_element],
	"model-condition": [model_condition_element],
	"auto-key": [{
		description: "Automatically generates a value, based on some counting method.</summary>This can be used e.g. for sequence numbers. The value of this attribute is automatically incremented with each new record.",
		attributes: [
			{
				name: "type",
				description: "The counter representation.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "numeric"
						}
					]
				}
			},
			{
				name: "places",
				description: "Length of string. Empty means: not restricted.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			dev_comment_attribute
		]
	}],
	"merge-instruction": [merge_instruction_element],
	"select": [{
		description: "Select a page or a single object.",
		attributes: [
			{
				name: "iid",
				description: "The instance identifier of the data object to fetch.",
				visibilityConditions: [
					{
						attribute: "iids",
						condition: "==",
						value: ""
					}
				],
				requiredConditions: [
					{
						attribute: "iids",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "iids",
				description: "A piped list to fetch a list of records.",
				visibilityConditions: [
					{
						attribute: "iid",
						condition: "==",
						value: ""
					}
				]
			},
			dev_comment_attribute
		]
	}],
	"input": [input_element]
	
};