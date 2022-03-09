import { AttributeOption, AttributeTypes, ChildDefinition, Definition, Definitions, ModelDetailLevel, ModelElementSubTypes, ModelElementTypes } from '../types/definitions';
import { isIncludeBlockOfType } from './other';
import { and_element, comment_attribute, default_children, default_permission_attribute_type, default_startmode_attribute_type, default_yes_no_attribute_type, full_text_query_element, ignore_modelcheck_attribute, include_blocks_element, include_block_declaration_definition, include_element, in_element, model_condition_element, module_element, or_element, search_children, search_column_element, search_column_submatch_element, search_element, search_group_element } from './shared';

export const profile_include_element: Definition =
{
	description: "Grants the referenced profile to all users that have the current profile. It is possible to include more profiles into one profile.",
	type: ModelElementTypes.ProfileInclude,
	detailLevel: ModelDetailLevel.References,
	attributes: [
		{
			name: "profile",
			description: "The profile to grant to the user.",
			autoadd: true,
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Profile
			}
		},
		comment_attribute
	],
	children: []
};

const profile_type_element: Definition = {
	description: "Permission declaration for a specific type.",
	attributes: [
		{
			name: "name",
			autoadd: true,
			description: "The type reference.",
			required: true,
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Type
			}
		},
		{
			name: "read",
			autoadd: true,
			type: default_permission_attribute_type
		},
		{
			name: "update",
			type: default_permission_attribute_type
		},
		{
			name: "create",
			type: default_permission_attribute_type
		},
		{
			name: "delete",
			type: default_permission_attribute_type
		},
		{
			name: "inherit-base-type-filters",
			description: "inherit base type filters",
			type: default_yes_no_attribute_type
		},
		{
			name: "override-inherited",
			description: "override inherited",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "childs",
						description: "filters"
					},
					{
						name: "",
						description: "none"
					}]
			}
		},
		ignore_modelcheck_attribute],
	children: [
		{
			element: "filters",
			occurence: "once"
		},
		{
			element: "relation-filters",
			occurence: "once"
		},
		{
			element: "related-attribute-filter",
			occurence: "once"
		},
		...default_children
	]
};

const authenticator_element: Definition = {
	description: "Used to group authenticators.",
	attributes: [],
	children: [
		{
			element: "authenticator"
		},
		{
			element: "include"
		},
		...default_children
	]
};

const meta_name_attribute_options: AttributeOption[] = [
	{
		name: "attribute"
	},
	{
		name: "type"
	},
];

const meta_attribute_options: AttributeOption[] = [
	...meta_name_attribute_options,
	{
		name: "module"
	},
	{
		name: "profile"
	},
	{
		name: "rules"
	},
	{
		name: "rule"
	},
	{
		name: "types"
	},
	{
		name: "type"
	},
	{
		name: "views"
	},
	{
		name: "view"
	},
	{
		name: "search"
	},
];

const include_block_security_declaration_definition: Definition = {
	...include_block_declaration_definition,
	attributes: [
		...include_block_declaration_definition.attributes,
		{
			name: "meta-name",
			description: "For which element to apply security.",
			required: true,
			autoadd: true,
			type:
			{
				type: AttributeTypes.Enum,
				options: meta_attribute_options
			}
		},
		{
			name: "meta-index",
			description: "For which element to apply security.",
			type:
			{
				type: AttributeTypes.Enum,
				options: meta_attribute_options
			}
		}
	]
};

const type_children_base: ChildDefinition[] = [
	{
		element: "type"
	},
	{
		element: "types",
		occurence: "once"
	}
];

const type_children: ChildDefinition[] = [
	...type_children_base,
	...default_children
];

const rule_children_base: ChildDefinition[] = [
	{
		element: "rule"
	},
	{
		element: "rules",
		occurence: "once"
	}
];

const rule_children: ChildDefinition[] = [
	...rule_children_base,
	...default_children
];

const view_children_base: ChildDefinition[] = [
	{
		element: "view"
	},
	{
		element: "views",
		occurence: "once"
	}
];

const view_children: ChildDefinition[] = [
	...view_children_base,
	...default_children
];

const profile_children_base: ChildDefinition[] = [
	...type_children_base,
	...rule_children_base,
	...view_children_base,
];

const profile_children: ChildDefinition[] = [
	{
		element: "authenticators",
		occurence: "once"
	},
	{
		element: "sign-authenticators",
		occurence: "once"
	},
	{
		element: "filters"
	},
	...profile_children_base,
	...default_children
];

export const SECURITY_DEFINITION: Definitions = {
	"root": [{
		description: "Security model (defining the SAL).",
		attributes: [
			{
				name: "documentlocation",
				description: "relative location for the documents which are included in the profiles"
			},
			comment_attribute
		],
		children: [{
			element: "application",
			occurence: "once"
		}]
	}],
	"application": [{
		description: "Project root of the security model.",
		attributes: [],
		children: [
			{
				element: "include"
			},
			{
				element: "profiles",
				occurence: "at-least-once"
			},
			...include_blocks_element.children,
			...default_children
		]
	}],
	"include": [include_element],
	"module": [module_element],
	"profiles": [{
		description: "Profiles collection",
		type: ModelElementTypes.Module,
		attributes: [],
		children: [
			{
				element: "profile"
			},
			{
				element: "module"
			},
			...include_blocks_element.children,
			...default_children
		]
	}],
	"include-blocks": [include_blocks_element],
	"include-block": [
		{ // General
			...include_block_security_declaration_definition,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, ""),
			},
		},
		{ // module
			...include_block_security_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Module,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "module"),
			},
			children: [
				{
					element: "module"
				},
				{
					element: "profile"
				},
				...include_blocks_element.children,
				...default_children
			]
		},
		{ // profile
			...include_block_security_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_SecurityProfile,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "profile"),
			},
			children: [
				...profile_children_base,
				...default_children
			]
		},
		{ // type / types
			...include_block_security_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Type,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "type") || isIncludeBlockOfType(x, "types"),
			},
			children: [
				...type_children,
				...default_children
			]
		},
		{ // rule
			...include_block_security_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Rule,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "rule") || isIncludeBlockOfType(x, "rules"),
			},
			children: [
				...rule_children,
				...default_children
			]
		},
		{ // view
			...include_block_security_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_View,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "view") || isIncludeBlockOfType(x, "views"),
			},
			children: [
				...view_children,
				...default_children
			]
		},
		{ // search
			...include_block_security_declaration_definition,
			subtype: ModelElementSubTypes.IncludeBlock_Search,
			matchCondition: {
				matchFunction: (x) => isIncludeBlockOfType(x, "search"),
			},
			children: [
				...search_children,
				...default_children
			]
		},
		{ // general
			...include_block_security_declaration_definition
		},
	],
	"profile": [{ // TODO: 'include'
		description: "Definition of a profile",
		prefixNameSpace: true,
		type: ModelElementTypes.Profile,
		attributes: [
			{
				name: "name",
				description: "Unique name for the profile. The security profile without name is the 'default profile' and will be merged with all other profiles.",
				autoadd: true
			},
			{
				name: "caption",
				description: "Displays this caption in the UI."
			},
			{
				name: "profile",
				description: "The profile to inherit from. The contents will be merged to the current profile. To grant user permissions for a profile, use include profile instead."
			},
			{
				name: "start-date",
				description: "The date the profile will start to be active.",
				visibilityConditions: [{
					attribute: "name",
					condition: "!=",
					value: ""
				}]
			},
			{
				name: "end-date",
				description: "The date the profile will expire.",
				visibilityConditions: [{
					attribute: "name",
					condition: "!=",
					value: ""
				}]
			}],
		children: [
			...profile_children
		]
	}],
	"types": [{
		description: "Declaration of type permissions.",
		attributes: [comment_attribute],
		children: [
			{
				element: "type"
			},
			{
				element: "include"
			},
			...default_children
		]
	}],
	"filters": [{
		description: "Defines filters to apply to inserts, reads, updates, and deletes of this type. The filter restrictions are applied independently of the permissions set for the type.",
		attributes: [
			{
				name: "overwrite-relation-filter",
				description: "overwrite relation filter",
				type: default_yes_no_attribute_type
			},
			comment_attribute
		],
		children: [
			{
				element: "search",
				occurence: "once"
			},
			...default_children
		]
	}],
	"search": [{
		...search_element,
		description: "Default, any sub filter (e.g., in a where-in) is extended using the security filter of the type queried. To remove the default security filter from the sub filter, set this option to \"yes\".",
	}],
	"searchcolumn": [search_column_element],
	"searchcolumn-submatch": [search_column_submatch_element],
	"or": [or_element],
	"and": [and_element],
	"group": [search_group_element],
	"in": [in_element],
	"full-text-query": [full_text_query_element],
	"rules": [{
		description: "Collection of rule groups.",
		attributes: [comment_attribute],
		children: [
			{
				element: "rule"
			},
			{
				element: "include"
			},
			...default_children
		]
	}],
	"views": [{
		description: "Declaration of view specific permissions.",
		attributes: [comment_attribute],
		children: [
			{
				element: "view"
			},
			{
				element: "include"
			},
			...default_children
		]
	}],
	"authenticators": [authenticator_element],
	"sign-authenticators": [{
		...authenticator_element,
		description: "Used to group sign authenticators.",
	}],
	"relation-filters": [{ // TODO: 'include'
		description: "Specifies how to combine with SAL filters on relations.",
		attributes: [{
			name: "start-mode",
			autoadd: true,
			type: default_startmode_attribute_type
		}],
		children: [
			{
				element: "include", // TODO, 3rd type of include, relation-filter
				type: ModelElementTypes.RelationFilterInclude
			},
			{
				element: "exclude",
				type: ModelElementTypes.RelationFilterInclude
			},
			...default_children
		]
	}],
	"model-condition": [model_condition_element],
	"type": [profile_type_element],
	"search-type": [profile_type_element],
	"rule": [{
		description: "You call a rule (from the client side) by using this name. A rule answers by returning several (name, value) - pairs.",
		attributes: [
			{
				name: "name",
				required: true,
				autoadd: true,
				description: "Reference to the rule.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Rule
				}
			},
			{
				name: "external-invocable",
				autoadd: true,
				description: "Allow this rule to be invoked externally, e.g. from the frontend or a webservice. Setting this flag to 'yes' implies that a hacker can invoke the rule with any input.",
				type: default_yes_no_attribute_type
			},
			{
				name: "apply-sal",
				autoadd: true,
				description: "Apply SAL. Rule can be created to the placed in an unsafe environment by setting the flag apply-sal to 'no'. (Everything in this unsafe environment (inclusive events) got executed without sal checks!)",
				type: default_yes_no_attribute_type
			},
			ignore_modelcheck_attribute,
			comment_attribute],
		children: []
	}],
	"view": [{
		description: "View permissions declaration.",
		attributes: [
			{
				name: "view",
				description: "The view reference.",
				required: true,
				autoadd: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.View
				}
			},
			{
				name: "type",
				obsolete: true,
				description: "A specific data type for the view to declare permissions for."
			},
			{
				name: "read",
				type: default_permission_attribute_type
			},
			{
				name: "update",
				type: default_permission_attribute_type
			},
			{
				name: "create",
				type: default_permission_attribute_type
			},
			{
				name: "delete",
				type: default_permission_attribute_type
			},
			ignore_modelcheck_attribute],
		children: []
	}],
	"authenticator": [{
		description: "An authenticator",
		detailLevel: ModelDetailLevel.References,
		attributes: [
			{
				name: "name",
				description: "The name for the authenticator.",
				autoadd: true
			},
			{
				name: "username-expiration-minutes",
				description: "Sign authentication: The time that the user name is automatically pre-filled in minutes.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "expiration-minutes",
				description: "Sign authentication: The time the authentication of this authenticator remains valid in minutes.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "token-minimum-size",
				description: "Minimum length of the token allowed.",
				visibilityConditions: [{
					attribute: "name",
					condition: "==",
					value: "Token"
				}],
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "token-skip-verification-attributes",
				description: "Do not check an additional verification value with the token. For long tokens, the default is true, for short tokens, the default is false.",
				visibilityConditions: [{
					attribute: "verification-type",
					condition: "==",
					value: ""
				},
				{
					operator: "and",
					attribute: "name",
					condition: "==",
					value: "Token"
				}],
				type: default_yes_no_attribute_type
			},
			{
				name: "verification-type",
				description: "The data type to read from to check a passed verification value. Used together with `verification-attribute` and `verification-type-id-attribute-name`.",
				visibilityConditions: [{
					attribute: "token-skip-verification-attributes",
					condition: "!=",
					value: "yes"
				},
				{
					operator: "and",
					attribute: "name",
					condition: "==",
					value: "Token"
				}],
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				}
			},
			{
				name: "verification-type-id-attribute-name",
				description: "The name of the attribute containing the user ID to find the user-specific record containing the verification value. Used together with verification-type and verification-attribute.",
				visibilityConditions: [{
					attribute: "token-skip-verification-attributes",
					condition: "!=",
					value: "yes"
				},
				{
					operator: "and",
					attribute: "name",
					condition: "==",
					value: "Token"
				}],
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute // TODO: Limit to Attributes of verification-type
				}
			},
			{
				name: "verification-attribute",
				description: "The name of the attribute containing the verification value. Used together with verification-type and verification-type-id-attribute-name.",
				visibilityConditions: [{
					attribute: "token-skip-verification-attributes",
					condition: "!=",
					value: "yes"
				},
				{
					operator: "and",
					attribute: "name",
					condition: "==",
					value: "Token"
				}],
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute // TODO: Limit to Attributes of verification-type
				}
			},

		],
		children: []
	}],
	"related-attribute-filter": [{ // TODO: 'include'
		description: "Visibility filter for relation-fields and related-attributes",
		attributes: [],
		children: [
			{
				element: "include", // TODO, 3rd type of include, relation-filter
				type: ModelElementTypes.RelationFilterInclude
			},
			{
				element: "exclude",
				type: ModelElementTypes.RelationFilterInclude
			}
		]
	}],
	"exclude": [{ // TODO: Attribute reference, type reference
		description: "Excludes the relation (only applicable when start mode is 'all').",
		attributes: [{
			name: "relation", // Attr
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Attribute
			}
		}],
		children: [{
			element: "type" // TODO: Parent type reference
		}]
	}]

};
