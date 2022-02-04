import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel, ModelElementSubTypes, AttributeOption, Definition, ChildDefinition } from '../symbolsAndReferences';
import { isIncludeBlockOfType } from './other';
import { dev_comment_attribute, dev_description_attribute, target_namespace_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element, default_yes_no_attribute_type, dev_obsolete_attribute, dev_obsolete_message_attribute, dev_override_rights_attribute, dev_is_declaration_attribute, decorations_element, decorators_element, decorator_element, decoration_element, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute, search_children, search_attributes, input_element, infoset_single_aggregate_query, infoset_aggregate_attribute, infoset_aggregate_function, default_children, in_element, search_group_element, full_text_query_element, and_element, or_element, search_column_submatch_element, search_column_element, include_block_declaration_definition } from './shared';

const include_block_meta_options: AttributeOption[] = [
	{
		name: "module"
	},
	{
		name: "infoset"
	},
	{
		name: "search"
	},
	{
		name: "searchcolumn"
	}
];

const module_children: ChildDefinition[] = [
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
		element: "decorations",
		occurence: "once"
	},
	...default_children
];

const include_block_infoset_declaration_definition: Definition = {
	...include_block_declaration_definition,
	attributes: [
		...include_block_declaration_definition.attributes,
		{
			name: "meta-name",
			description: "For which element to apply rules.",
			required: true,
			autoadd: true,
			type:
			{
				type: AttributeTypes.Enum,
				options: include_block_meta_options
			}
		},
		{
			name: "meta-index",
			description: "For which element to apply rules.",
			type:
			{
				type: AttributeTypes.Enum,
				options: include_block_meta_options
			}
		}		
	]
};

export const INFOSET_DEFINITION: Definitions = {
	"infosets": [{
		description: "Collection of infosets.",
		attributes: [
			dev_comment_attribute
		],
		children: [
			{
				element: "module"
			},
			{
				element: "infoset"
			},
			{
				element: "include-blocks"
			},
			...default_children
		]
	}],
	"infoset": [{
		description: "A data query description.",
		type: ModelElementTypes.Infoset,
		prefixNameSpace: true,
		isSymbolDeclaration: true,
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
		children: [
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
			...default_children
		]
	}],
	"module": [{
		type: ModelElementTypes.Module,
		detailLevel: ModelDetailLevel.Declarations,
		isGroupingElement:true,
		description: "Used for grouping model entities and model namespacing.",
		attributes: [
			{
				name: "name",
				description: "The module name.",
				autoadd: true
			},
			target_namespace_attribute,
			dev_description_attribute,
			dev_comment_attribute,
		],
		children: module_children
	}],
	"search": [{
		type: ModelElementTypes.Search,
		detailLevel: ModelDetailLevel.Declarations,
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
		children: search_children
	}],
	"searchcolumn": [search_column_element],
	"searchcolumn-submatch": [search_column_submatch_element],
	"or": [or_element],
	"and": [and_element],
	"group": [search_group_element],
	"in": [in_element],
	"full-text-query": [full_text_query_element],
	"query": [{
		description: "A specific data query command.",
		attributes: [dev_comment_attribute],
		children: [
			{
				element: "select",
				occurence: "once"
			},
			{
				element: "delete",
				occurence: "once"
			},
			...default_children
		]
	}],
	"exists": [{
		description: "Evaluates if a selected data object exists.",
		attributes: search_attributes,
		children: search_children
	}],
	"count": [{
		description: "Evaluates the count over the selected data objects.",
		attributes: search_attributes,
		children: search_children
	}],
	"min": [{
		description: "Evaluates the minimal value of an attribute over the selected data objects.",
		attributes: search_attributes,
		children: search_children
	}],
	"max": [{
		description: "Evaluates the maximal value of an attribute over the selected data objects.",
		attributes: search_attributes,
		children: search_children
	}],
	"average": [{
		description: "Evaluates the average of an attribute over the selected data objects.",
		attributes: search_attributes,
		children: search_children
	}],
	"sum": [{
		description: "Evaluates the sum of an attribute over the selected data objects.",
		attributes: search_attributes,
		children: search_children
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
		],
		children: []
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
		children: [
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
			{
				element: "search",
				occurence: "once"
			},
			...default_children
		]
	}],
	"single-aggregate-query": [infoset_single_aggregate_query],
	"aggregate-attribute": [infoset_aggregate_attribute],
	"aggregate-function": [infoset_aggregate_function],
	"ordering": [{
		description: "An ordering over sets of objects of a certain type.",
		attributes: [dev_comment_attribute],
		children: [
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
		children: []
	}],
	"grouping": [{
		description: "A grouping over sets of objects of a certain type.",
		attributes: [dev_comment_attribute],
		children: [
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
		],
		children: []
	}],
	"variable": [{
		description: "An infoset can be based on one or more variables. The values of the contained infoset variables will be collected into the infoset. You can assign a fixed value to a variable, base it upon an aggregation, or base it upon a query.",
		type: ModelElementTypes.Output,
		isSymbolDeclaration: true,
		detailLevel: ModelDetailLevel.Declarations,
		prefixNameSpace: true,
		attributes: [
			{
				name: "name",
				required: true,
				description: "Unique name of the variable."
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
						{
							name: "COUNT",
							obsolete: true
						},
						{
							name: "SUM",
							obsolete: true
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
		children: [ // HUH? ... WHY??
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
		children: [
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
	"include-block": [
		{ // search
			...include_block_infoset_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Search,
			matchCondition: (x)=>isIncludeBlockOfType(x, "search"),
			children: [
				...search_children
			]
		}
	],
	"include": [include_element],
	"model-condition": [
		{
			...model_condition_element,
			subtype: ModelElementSubTypes.ModelCondition_Module,
			ancestors: [
				{ type: ModelElementTypes.Module},
				{ type: ModelElementTypes.Infosets}
			],
			children: module_children
		},
	],
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
		],
		children: []
	}],
	"merge-instruction": [merge_instruction_element],
	"select": [{
		description: "Select a page or a single object.",
		attributes: [
			{
				name: "type",
				required: true,
				description: "The type of the data object to delete.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				}
			},
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
			{
				name: "add-relations",
				description: "Select relation attributes too. Set to 'yes' if you want to link a variable to a related attribute.",
				type: default_yes_no_attribute_type
			},
			{
				name: "pagesize",
				description: "The number of occurrences in a page.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "pagenumber",
				description: "The page number to be retrieved.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "sort-column",
				description: "A single column on which the result is sorted.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute
				}
			},
			{
				name: "sort-order",
				description: "The order how the sort-column is ordered.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "ASC",
							description: "Ascending"
						},
						{
							name: "DESC",
							description: "Descending"
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
			dev_comment_attribute
		],
		children: []
	}],
	"delete": [{
		description: "Delete a data object.",
		attributes: [
			{
				name: "type",
				required: true,
				description: "The type of the data object to delete."
			},
			{
				name: "iid",
				description: "The instance identifier of the data object to fetch.",
				visibilityConditions: [
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
			{
				name: "all-when-empty-filter",
				description: "If 'no' the search returns nothing (matches no record) when the filter is empty or if all the parameter based search columns are left out; if 'yes' it returns all records (matches all records).",
				type: default_yes_no_attribute_type
			},
			{
				name: "add-relations",
				description: "Select relation attributes too. Set to 'yes' if you want to link a variable to a related attribute.",
				type: default_yes_no_attribute_type
			},
			{
				name: "filter",
				description: "The type filter to apply for search.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				}
			},
			{
				name: "alias",
				description: "An internal name for the search query which is available to use for 'match search field' purposes."
			},
			dev_comment_attribute
		],
		children: [
			{
				element: "searchcolumn"
			},
			{
				element: "searchcolumn-submatch"
			},
			{
				element: "or"
			},
			{
				element: "and"
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
			...default_children
		]
	}],
	"input": [input_element]	
};