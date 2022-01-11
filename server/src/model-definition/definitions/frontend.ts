import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel, ElementAttribute, ChildDefinition, AttributeOption, Definition } from '../symbolsAndReferences';
import { isViewControl, isViewDeclaration } from './other';
import { action_argument_element, action_call_output_element, child_include, child_merge_instruction, child_model_condition, decorations_element, decoration_argument_element, decoration_element, decorators_element, decorator_context_entity_element, decorator_element, decorator_input_element, default_yes_no_attribute_type, dev_comment_attribute, dev_description_attribute, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute, dev_is_declaration_attribute, dev_is_public_attribute, dev_override_rights_attribute, event_childs, include_blocks_element, include_element, input_element, merge_instruction_element, model_condition_element, search_condition_options_attribute_type, target_element, target_namespace_attribute, view_argument_element, view_group_attributes, view_group_childs } from './shared';

const button_attributes: ElementAttribute[] =
	[
		{
			name: "name",
			description: "Unique, required identifier.",
			required: true
		},
		{
			name: "catpion",
			description: "The text to display on the button."
		},
		{
			name: "info",
			description: "Will appear as tooltip of the button."
		},
		{
			name: "url",
			description: "An URL to go to when the button is clicked."
		},
		{
			name: "width",
			description: "Width of the button."
		},
		{
			name: "height",
			description: "Height of the button."
		},
		{
			name: "appearance-class",
			description: "The appearance of the button or link."
		},
		{
			name: "accesskey",
			description: "A key to access the button."
		},
		{
			name: "enabled",
			description: "If the button is initially enabled.",
			type: default_yes_no_attribute_type
		},
		{
			name: "show",
			description: "If the button is initially visible.",
			type: default_yes_no_attribute_type
		},
		{
			name: "show-in-listview",
			description: "Specify to show the button in the list view.",
			type: default_yes_no_attribute_type
		},
		{
			name: "disablable",
			description: "Specify to enable/disable the button according to the view mode.",
			type: default_yes_no_attribute_type
		},
		{
			name: "submit",
			description: "If true, the event of this button is fired when the 'Enter' is pressed on the form.",
			type: default_yes_no_attribute_type
		},
		{
			name: "top",
			description: "The vertical position of the button in volatile mode."
		},
		{
			name: "vertical",
			description: "The horizontal position of the button in volatile mode."
		},
		{
			name: "icon",
			description: "The icon to display on the button. If omitted, only the caption is displayed."
		},
		{
			name: "icon-width",
			description: "Width of the button icon."
		},
		{
			name: "icon-position",
			description: "The position of the button icon.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "left"
					},
					{
						name: "right"
					},
				]
			}
		},
		{
			name: "float",
			description: "Whether the button is floated",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "none"
					},
					{
						name: "left"
					},
					{
						name: "right"
					}
				]
			}
		},
		{
			name: "clear",
			description: "Specifies the sides of the view where other floating elements are not allowed.",
			type: {
				type: AttributeTypes.Enum,
				options: [
					{
						name: "both"
					},
					{
						name: "left"
					},
					{
						name: "right"
					}
				]
			}
		},
		dev_override_rights_attribute,
		dev_ignore_modelcheck_attribute,
		dev_ignore_modelcheck_justification_attribute,
		dev_comment_attribute
	];

const button_childs: ChildDefinition[] =
	[
		{
			element: "icon"
		},
		{
			element: "text"
		},
		{
			element: "events"
		},
		{
			element: "format"
		},
		child_include,
		child_merge_instruction,
		child_model_condition
	];

const view_attribute_name_required: ElementAttribute = {
	name: "name",
	description: "Unique name for the view. The name is in most cases the outside identifier (views can be retrieved by name). For nested views, the name is not used as an outside identifier, but only for inner identifier. Using same inner identifiers merges subviews on inheritance.",
	required: true,
	validations: [
		{
			type: "regex",
			value: /^[a-zA-Z]+[0-9a-zA-Z_\-.]*$/,
			message: "1) Special characters (except '_', '-', '.') are not allowed in the name of the view. 2) A name should start with a letter"
		}
	]
};

const view_attribute_target_uri: ElementAttribute = {
	name: "target-uri",
	description: "The target identifier for the item used in frontend actions, etcetera.",
	autoadd: true
};

const view_control_options: AttributeOption[] = [
	{
		name: "ObjectView"
	},
	{
		name: "ListView"
	},
	{
		name: "ViewContainer"
	},
	{
		name: "Tabber"
	},
	{
		name: "Tree"
	},
	{
		name: "DataTree"
	},
	{
		name: "Graph"
	},
	{
		name: "HtmlFile"
	},
	{
		name: "Organizer"
	},
	{
		name: "MediaPlayer"
	},
	{
		name: "Iframe"
	},
	{
		name: "Empty"
	},
	{
		name: "AnnotationTool"
	}
];

const view_attribute_control_required: ElementAttribute = {
	name: "control",
	description: "View control type.",
	required: true,
	type: {
		type: AttributeTypes.Enum,
		options: view_control_options
	}
};

const view_attribute_control: ElementAttribute = {
	name: "control",
	description: "View control type.",
	type: {
		type: AttributeTypes.Enum,
		options: view_control_options
	}
};

const view_attribute_title: ElementAttribute = {
	name: "title",
	description: "The title to display above the view (in the title bar).",
	visibilityConditions: [
		{
			attribute: "control",
			condition: "!=",
			value: "HtmlFile"
		},
		{
			operator: "and",
			attribute: "control",
			condition: "!=",
			value: "Empty"
		},
	]
};

const view_attribute_type: ElementAttribute = {
	name: "type",
	description: "The backend data type to which the view is linked.",
	type: {
		type: AttributeTypes.Reference,
		relatedTo: ModelElementTypes.Type
	}
};

const view_attribute_view: ElementAttribute = {
	name: "view",
	description: "A view to inherit from. An inherited view copies all characteristics of the source view unless the attributes are changed in the inherited view. Supplements are also possible.",
	type: {
		type: AttributeTypes.Reference,
		relatedTo: ModelElementTypes.View
	}
};

const view_attribute_toolbar: ElementAttribute = {
	name: "toolbar",
	description: "The toolbar used in the view.",
	type: {
		type: AttributeTypes.Reference,
		relatedTo: ModelElementTypes.Toolbar
	},
	visibilityConditions: [
		{
			attribute: "child-element",	// TODO check on child elements instead of attribute
			condition: "misses",
			value: "toolbar"
		}
	]
};

const view_attribute_bounded: ElementAttribute = {
	name: "bounded",
	description: "If the view is data bound, that is, presents and saves instances from the data type.</summary>It is possible to us a not data bound view for e.g. filtering purposes.",
	type: default_yes_no_attribute_type
};

const view_attribute_mode: ElementAttribute = {
	name: "mode",
	description: "The mode in which the view has to be started.</summary>Startup mode: how to initialize (with or without loading data, ...). Only applicable for object or list control views.",
	type: {
		type: AttributeTypes.Enum,
		options: [
			{
				name: "view"
			},
			{
				name: "new"
			},
			{
				name: "edit"
			},
			{
				name: "viewdefaults",
				obsolete: true
			},
			{
				name: "design",
				obsolete: true
			}
		]
	}
};

const view_attribute_parent_connection: ElementAttribute = {
	name: "parent-connection",
	description: "Creates a header-lines relation between the parent view and this view.",
	type: {
		type: AttributeTypes.Reference,
		relatedTo: ModelElementTypes.Attribute
	},
	visibilityConditions: [
		{
			attribute: "parent-node",	// Todo This should be a check on parent node not an attribut
			condition: "==",
			value: "view"
		}
	]
};

const view_attribute_portlet: ElementAttribute = {
	name: "portlet",
	description: "If the view can be added to a portal view.",
	type: default_yes_no_attribute_type
};

const view_attribute_slide_position: ElementAttribute = {
	name: "slide-position",
	description: "The position of the screen or direction to which the view may slide in to.",
	type: {
		type: AttributeTypes.Enum,
		options: [
			{
				name: "bottom"
			},
			{
				name: "left"
			},
			{
				name: "right"
			},
			{
				name: "top"
			},
		]
	}
};

const view_attribute_start_slided_in: ElementAttribute = {
	name: "start-slided-in",
	description: "If the view should start up slided in.",
	type: default_yes_no_attribute_type,
	visibilityConditions: [
		{
			attribute: "slide-position",
			condition: "!=",
			value: ""
		}
	]
};

const view_attribute_infoset: ElementAttribute = {
	name: "infoset",
	description: "The data set to display in the view. This is usefull when the data is not exactly the same as in the persistence, for example some calculated values. Only applicable for list control views.",
	type: {
		type: AttributeTypes.Reference,
		relatedTo: ModelElementTypes.Infoset
	},
	visibilityConditions: [
		{
			attribute: "control",
			condition: "==",
			value: "ListView"
		},
		{
			operator: "or",
			attribute: "control",
			condition: "==",
			value: "ObjectView"
		},
	]
};

const view_attribute_filter: ElementAttribute = {
	name: "filter",
	description: "A filter to apply to the type that is viewed.",
	type: {
		type: AttributeTypes.Reference,
		relatedTo: ModelElementTypes.TypeFilter
	},
	visibilityConditions: [
		{
			attribute: "type",
			condition: "!=",
			value: ""
		}
	]
};

const view_attribute_appearance: ElementAttribute = {
	name: "appearance",
	description: "The style of this view.",
	obsolete: true,	// appearance is something that is hardly used, so it should be deprecated
	obsoleteMessage: "use something else :)",
	type: {
		type: AttributeTypes.Reference,
		relatedTo: ModelElementTypes.Appearance
	}
};

const view_attribute_appearance_class: ElementAttribute = {
	name: "appearance-class",
	description: "A specific style for the view element.",
	type: {
		type: AttributeTypes.Reference,
		relatedTo: ModelElementTypes.AppearanceClass
	}
};

const attribute_float: ElementAttribute = {
	name: "float",
	description: "Whether the element is floated",
	type: {
		type: AttributeTypes.Enum,
		options: [
			{
				name: "",
				description: "none"
			},
			{
				name: "left"
			},
			{
				name: "right"
			}
		]
	}
};

const attribute_clear: ElementAttribute = {
	name: "clear",
	description: "Specifies the sides of the element where other floating elements are not allowed.",
	type: {
		type: AttributeTypes.Enum,
		options: [
			{
				name: "both"
			},
			{
				name: "left"
			},
			{
				name: "right"
			}
		]
	}
};

const attribute_background_image: ElementAttribute = {
	name: "background-image",
	description: "A background image for the view. (TIP: use SCSS instead of this attribute)"
};

const attribute_background_position: ElementAttribute = {
	name: "background-position",
	description: "Background position for the view. See: http://www.w3.org/TR/CSS2/colors.html (TIP: use SCSS instead of this attribute)"
};

const attribute_detail_height: ElementAttribute = {
	name: "detail-height",
	description: "The height of the view in object view. Useful when object view is of different height than the list view.",
	visibilityConditions: [
		{
			attribute: "control",
			condition: "==",
			value: "ListView"
		},
		{
			operator: "or",
			attribute: "control",
			condition: "==",
			value: "ObjectView"
		}
	]
};

const attribute_skip_history: ElementAttribute = {
	name: "skip-history",
	description: "If set to true, the Back button will skip this view.",
	type: default_yes_no_attribute_type
};

const attribute_readonly: ElementAttribute = {
	name: "readonly",
	description: "Set yes if view suppose to be view only is. No data can be saved from this view.",
	type: default_yes_no_attribute_type
};

const attribute_help_code: ElementAttribute = {
	name: "help-code",
	description: "The tag of the Help page to show when displaying help. When not specified, the view name is used as tag."
};

const attribute_designable: ElementAttribute = {
	name: "designable",
	description: "Whether the view is designable by a user having designer rights.",
	obsolete: true,
	obsoleteMessage: "This shouldn't be a feature",
	type: default_yes_no_attribute_type
};

const attribute_lookup_width: ElementAttribute = {
	name: "lookup-width",
	description: "The width of the view in lookup dialog state."
};

const attribute_lookup_height: ElementAttribute = {
	name: "lookup-height",
	description: "The height of the view in lookup dialog state."
};

const attribute_lookup_top: ElementAttribute = {
	name: "lookup-top",
	description: "The vertical position of the view in lookup dialog state."
};

const attribute_lookup_left: ElementAttribute = {
	name: "lookup-left",
	description: "The horizontal position of the view in lookup dialog state."
};

const attribute_position: ElementAttribute = {
	name: "position",
	description: "Positioning of the view",
	type: {
		type: AttributeTypes.Enum,
		options: [
			{
				name: "absolute",
				description: "absolute (relative to parent)"
			},
			{
				name: "fixed",
				description: "fixed (relative to document.body)"
			},
		]
	}
};

const attribute_top: ElementAttribute = {
	name: "top",
	description: "",
	visibilityConditions: [
		{
			attribute: "position",
			condition: "!=",
			value: ""
		}
	]
};

const attribute_right: ElementAttribute = {
	name: "right",
	description: "",
	visibilityConditions: [
		{
			attribute: "position",
			condition: "!=",
			value: ""
		}
	]
};

const attribute_bottom: ElementAttribute = {
	name: "bottom",
	description: "",
	visibilityConditions: [
		{
			attribute: "position",
			condition: "!=",
			value: ""
		}
	]
};

const attribute_left: ElementAttribute = {
	name: "left",
	description: "",
	visibilityConditions: [
		{
			attribute: "position",
			condition: "!=",
			value: ""
		}
	]
};

const attribute_width: ElementAttribute = {
	name: "width",
	description: ""
};

const attribute_height: ElementAttribute = {
	name: "height",
	description: ""
};

const attribute_log_access: ElementAttribute = {
	name: "log-access",
	description: "Determines whether all access that is requested for this view (at runtime) has to be logged or not.",
	type: default_yes_no_attribute_type
};

const attribute_log_attributes: ElementAttribute = {
	name: "log-attributes",
	description: "A pipe-separated list of attributes (from the arguments or the data of the view) to log with access logging.",
	visibilityConditions: [
		{
			attribute: "log-access",
			condition: "==",
			value: "yes"
		}
	]
};

const default_view_attributes: ElementAttribute[] = [
	view_attribute_title,
	view_attribute_type,
	view_attribute_view,
	view_attribute_toolbar,
	view_attribute_bounded,
	view_attribute_mode,
	view_attribute_parent_connection,
	view_attribute_portlet,
	view_attribute_slide_position,
	view_attribute_start_slided_in,
	view_attribute_infoset,
	view_attribute_filter,
	view_attribute_appearance,
	view_attribute_appearance_class,
	attribute_float,
	attribute_clear,
	attribute_background_image,
	attribute_background_position,
	attribute_skip_history,
	attribute_readonly,
	attribute_help_code,
	attribute_designable,
	attribute_lookup_width,
	attribute_lookup_height,
	attribute_lookup_top,
	attribute_lookup_left,
	attribute_position,
	attribute_top,
	attribute_right,
	attribute_bottom,
	attribute_left,
	attribute_width,
	attribute_height,
	attribute_log_access,
	attribute_log_attributes
];

const default_definition_view_attributes: ElementAttribute[] = [
	view_attribute_name_required,
	view_attribute_control_required,
];

const default_reference_view_attributes: ElementAttribute[] = [
	view_attribute_target_uri,
	view_attribute_control,
];

const default_view_childs: ChildDefinition[] = [
	{
		element: "events"
	},
	{
		element: "argument"
	},
	{
		element: "toolbar"
	},
	{
		element: "titlebar"
	},
	{
		element: "server-events",
		occurence: "once"
	},
	{
		element: "metadata-initialize",
		occurence: "once"
	},

];

// const default_view_unknown_childs: ChildDefinition[] = [
// 	{
// 		element: "layout",			// not in use
// 		occurence: "once"
// 	},
// 	{
// 		element: "design"			// not in use
// 	},
// 	{
// 		element: "column"			// for portlets
// 	},
// 	{
// 		element: "row"				// for portlets
// 	},
// 	{
// 		element: "function" 		// TODO: remove... this is a bad practice. Define functions in the functions part
// 	},
// 	{
// 		element: "IconConditions"	// TODO: remove; not in use
// 	},
// 	{
// 		element: "source"			// no idea what this is....
// 	},
// 	{
// 		element: "report-parameters",	// for Graph?
// 		occurence: "once"
// 	}
// ];

const default_view_record_childs: ChildDefinition[] = [
	{
		element: "attribute"
	},
	{
		element: "group"
	},
	{
		element: "button"
	},
	{
		element: "view"
	},
	{
		element: "attachments",
		occurence: "once"
	},
];

const frontend_events_base_definition: Definition = {
	description: "Frontend event registrations.\"Events\":[EventsAndActions_ActionsOverview] are the predefined events at the client side. These trigger a server side or client side action, as a result of which an operation (on the server or in the screen) is initiated.",
	attributes: [dev_comment_attribute],
	childs: [
		{
			element: "event",
			occurence: "at-least-once"
		},
		child_include,
		child_merge_instruction,
		child_model_condition
	]
};

const objectview_base_definition: Definition = {
	subtype: ModelElementTypes.View_ObjectView, 
	attributes: [
		...default_view_attributes,
		attribute_detail_height,	// object/list
		{
			name: "layoutable",
			description: "Whether or not a layout can be created by the Inspector. If set to 'yes' then the view should also have a name.",
			type: default_yes_no_attribute_type
		},
		{
			name: "layout",
			description: "The explicit name of the layout in the layout.xml file. Usually this value is empty, because layoutable='yes' will compute a name automatically. If the layout is set then the view should also have a name."
		},
		{
			name: "focus-field",
			description: "The field to give initial focus when the object view loads.",
			type: {
				type: AttributeTypes.Reference,
				relatedTo: ModelElementTypes.Attribute	// TODO: filter attributes current view
			}
		},
		{
			name: "save-to-parent",
			description: "",
			type: default_yes_no_attribute_type
		},
	],
	childs: [
		...default_view_childs,
		...default_view_record_childs,
		{
			element: "separator"
		},
		{
			element: "tabber"
		},
	]
};

export const FRONTEND_DEFINITION: Definitions = {
	"view": [
		{ // General (no control type)
			type: ModelElementTypes.View,
			description: "Add new view",
			matchCondition: (nodeContext) => isViewControl(nodeContext, ""),
			attributes: [
				...default_view_attributes,
				...default_definition_view_attributes,
			],
			childs: [
				...default_view_childs
			]
		},
		{ // ObjectView
			...objectview_base_definition,
			type: ModelElementTypes.View,
			detailLevel: ModelDetailLevel.Declarations,
			description: "ObjectView as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "ObjectView"),
			ancestors: [ModelElementTypes.Views],
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...objectview_base_definition.attributes,
				...default_definition_view_attributes,
			]
		},
		{ // ObjectView ref
			...objectview_base_definition,
			description: "ObjectView as a child",
			type: ModelElementTypes.SubView,
			matchCondition: (nodeContext) => isViewControl(nodeContext, "ObjectView"),
			ancestors: [ModelElementTypes.View, ModelElementTypes.Action, ModelElementTypes.MainView],
			attributes: [
				...objectview_base_definition.attributes,
				...default_reference_view_attributes
			]
		},
		{ // ListView
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_ListView,
			description: "ListView as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "ListView") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_view_attributes,
				attribute_detail_height,	// object/list
				{
					name: "show-favorites-column",
					description: "Whether to show a favorites column.",
					type: default_yes_no_attribute_type
				},
				{
					name: "favorites-column-position",
					description: "Where the favorites column is located. Can be 'begin', 'end', or a column number.",
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "",
								description: "use default"
							},
							{
								name: "begin",
								description: "Put column at the begin of the listview"
							},
							{
								name: "end",
								description: "Put column at the end of the listview"
							},
							{
								name: "*",
								description: "any number"
							},
						]
					}
				},
				{
					name: "page-size",
					description: "The number of rows per page. If the value is 'auto' then the number of records shown will depend on the specified height.</summary>Only applicable to list control views.",
					type: {
						type: AttributeTypes.Numeric
					}
				},
				{
					name: "multiple-select",
					description: "Enables/disables selecting more records in a list view.",
					type: default_yes_no_attribute_type
				},
				{
					name: "searchcolumn",
					description: "The default attribute to start list search with.</summary>Only applicable for list control views.",
					type: {
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.Attribute
					}
				},
				{
					name: "objectview",
					description: "To change the view that is opened when this list view changes to object view.",
					type: {
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.View	// TODO filter on type object views
					}
				},
				{
					name: "objectview-toolbar",
					description: "To change the toolbar when this view changes to object view.",
					type: {
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.Toolbar
					}
				},
				{
					name: "all-when-empty-filter",
					description: "If yes and all filter arguments are empty it will show all the data (paged), if no, it will show nothing in that case.",
					type: default_yes_no_attribute_type
				},
				{
					name: "show-new-record-in-listview",
					description: "Whether a row has to be displayed in the list view for entering a new record.",
					type: default_yes_no_attribute_type
				},
				{
					name: "list-height",
					description: "The height of textareas in the list.",
					type: {
						type: AttributeTypes.Numeric
					}
				},
				{
					name: "more-pagination",
					description: "If the list view has a paging record at the bottom (showing the text 'More...') which can be clicked to get the next page of the list and append it to the bottom.",
					type: default_yes_no_attribute_type
				},
				{
					name: "row-details-view",
					description: "The view to show row details with. See [Row details in a list view].",
					type: {
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.View
					}
				},
				{
					name: "style",
					description: "The style of the list view.",
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "vertical"
							}
						]
					}
				},
				{
					name: "no-results-found-row",
					description: "Show a row if no result are found. It will display the text as specified with the option 'no result found text'.",
					type: default_yes_no_attribute_type
				},
				{
					name: "no-results-found-text",
					description: "The text to show when no results are found. Defaults to 'No results found'. This value will be translated.",
					visibilityConditions: [
						{
							operator: "and",
							attribute: "no-results-found-text",
							condition: "==",
							value: "yes"
						}
					]
				},

			],
			childs: [
				...default_view_childs,
				...default_view_record_childs,
				{
					element: "sort"
				}
			]
		},
		{ // Tree
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_Tree,
			description: "Tree as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "Tree") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes,
				{
					name: "tree",
					description: "The navigation tree to display. Only applicable for tree control views.",
					type: {
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.Tree
					}
				}
			],
			childs: [
				...default_view_childs
			]
		},
		{ // DataTree
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_DataTree,
			description: "DataTree as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "DataTree") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes
			],
			childs: [
				...default_view_childs,
				{
					element: "list",
					occurence: "once"
				},
				{
					element: "node",
					occurence: "once"
				}
			]
		},
		{ // HtmlFile
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_HTML,
			description: "HTMLFile as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "HtmlFile") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes,
				{
					name: "file",
					description: "The HTML file rendered. Only applicable for HTML control views.",
					visibilityConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "HtmlFile"
						}
					]
				}
			],
			childs: [
				...default_view_childs
			]
		},
		{ // Organizer
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_Organizer,
			description: "Organizer as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "Organizer") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes,
				{
					name: "organizer-mode",
					description: "Name of initial view.",
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "agenda"
							},
							{
								name: "day"
							},
							{
								name: "month"
							},
							{
								name: "week"
							},
							{
								name: "year"
							},
							{
								name: "timeline"
							},
							{
								name: "unit"
							}
						]
					}
				},
				{
					name: "start-day",
					description: "The date of the day to start with. It's the initial day.",
					type: {
						type: AttributeTypes.Date
					}
				},
				{
					name: "first-hour",
					description: "Minimum value for the hour scale. Default 0.",
					type: {
						type: AttributeTypes.Numeric
					},
					validations: [
						{
							type: "regex",
							value: /^(?:[0-9]|1[0-9]|2[0-3])$/,
							message: "Only numbers from 0-23 are allowed"
						}
					]
				},
				{
					name: "last-hour",
					description: "Maximum value for the hour scale. Default 24.",
					type: {
						type: AttributeTypes.Numeric
					},
					validations: [
						{
							type: "regex",
							value: /^(?:[0-9]|1[0-9]|2[0-3])$/,
							message: "Only numbers from 0-23 are allowed"
						}
					]
				},
				{
					name: "scroll-hour",
					description: "Initial position vertical scroll. Default '0'",
					type: {
						type: AttributeTypes.Numeric
					},
					validations: [
						{
							type: "regex",
							value: /^(?:[0-9]|1[0-9]|2[0-3])$/,
							message: "Only numbers from 0-23 are allowed"
						}
					]
				},
				{
					name: "hour-scale",
					description: "Hour scale. Specifies minutes per vertical compartment. Default 30.",
					type: {
						type: AttributeTypes.Numeric
					},
					validations: [
						{
							type: "regex",
							value: /^([1-9]|[1-5][0-9]|60)$/,
							message: "Only numbers from 1-60 are allowed"
						}
					]
				},
				{
					name: "time-step",
					description: "Time step in minutes. Default 5.",
					type: {
						type: AttributeTypes.Numeric
					},
					validations: [
						{
							type: "regex",
							value: /^([1-9]|[1-5][0-9]|60)$/,
							message: "Only numbers from 1-60 are allowed"
						}
					]
				},
				{
					name: "hour-format",
					description: "Hours in 12 or 24-hour format.",
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "12"
							},
							{
								name: "24"
							}
						]
					}
				},
				{
					name: "mark-now",
					description: "Marker displaying current time.",
					type: default_yes_no_attribute_type
				},
				{
					name: "create",
					description: "Possibility to disable adding appointments.",
					type: default_yes_no_attribute_type
				},
				{
					name: "day-tab-visible",
					description: "Shows day tab.",
					type: default_yes_no_attribute_type
				},
				{
					name: "week-tab-visible",
					description: "Shows week tab.",
					type: default_yes_no_attribute_type
				},
				{
					name: "next-button-visible",
					description: "Shows next button.",
					type: default_yes_no_attribute_type
				},
				{
					name: "previous-button-visible",
					description: "Shows previous button.",
					type: default_yes_no_attribute_type
				},
				{
					name: "today-button-visible",
					description: "Shows today button.",
					type: default_yes_no_attribute_type
				},
				{
					name: "meridian",
					description: "Meridian (AM/PM notation).",
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "%a",
								description: "am/pm"
							},
							{
								name: "%A",
								description: "AM/PM"
							},
						]
					},
					visibilityConditions: [
						{
							attribute: "hour-format",
							condition: "==",
							value: "12"
						}
					]
				},
				{
					name: "multi-day",
					description: "Enables rendering multi-day events.",
					type: default_yes_no_attribute_type
				},
			],
			childs: [
				...default_view_childs,
				{
					element: "units",
					occurence: "once"
				},
				{
					element: "appointments",
					occurence: "once"
				},
				{
					element: "agenda-view",
					occurence: "once"
				},
				{
					element: "month-view",
					occurence: "once"
				},
				{
					element: "timeline-view",
					occurence: "once"
				},
				{
					element: "units-view",
					occurence: "once"
				},
				{
					element: "week-view",
					occurence: "once"
				},
				{
					element: "year-view",
					occurence: "once"
				}
			]
		},
		{ // MediaPlayer
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_MediaPlayer,
			description: "MediaPlayer as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "MediaPlayer") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes,
				{
					name: "video",
					description: "",
					visibilityConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "MediaPlayer"
						}
					],
					requiredConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "MediaPlayer"
						}
					]
				},
				{
					name: "posterpath",
					description: "",
					visibilityConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "MediaPlayer"
						}
					]
				},
			],
			childs: [
				...default_view_childs
			]
		},
		{ // AnnotationTool
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_AnnotationTool,
			description: "AnnotationTool as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "AnnotationTool") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes,
				{
					name: "annotation-tool-background-image",
					description: "Annotation tool background image url",
					visibilityConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "AnnotationTool"
						}
					]
				},
				{
					name: "annotation-tool-selection-shadow",
					description: "The shadow color of the selected object in the annotation tool.",
					visibilityConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "AnnotationTool"
						}
					]
				},
			],
			childs: [
				...default_view_childs
			]
		},
		{ // Tabber
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_Tabber,
			description: "Tabber as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "Tabber") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes,
				{
					name: "overflow-dropdown",
					description: "Move components to a dropdown when they do not fit.",
					type: default_yes_no_attribute_type,
					visibilityConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "Tabber"
						}
					]
				},
				{
					name: "active",
					description: "The active subview.</summary>For view tabbers, specifies the tabber view that starts the default when starting the view.",
					type: {
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.TargetView // TODO filter on childs/siblings
					},
					visibilityConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "Tabber"
						}
					]
				},
				{
					name: "enabled",
					description: "If this view is enabled. Only usefull when this view is a tab. For view tabber tabs, determines whether the view tab is visible or not.",
					type: default_yes_no_attribute_type,
					visibilityConditions: [
						{
							attribute: "parent-control",	// TODO fix parent check
							condition: "==",
							value: "Tabber"
						}
					]
				},
				{
					name: "render",
					description: "If this view is loaded immediately when starting up the page.</summary>For view tabber tabs, this can be used for lazy loading of tabs. The view is loaded when the tab is clicked.",
					type: default_yes_no_attribute_type,
					visibilityConditions: [
						{
							attribute: "parent-control",	// TODO fix parent check
							condition: "==",
							value: "Tabber"
						}
					]
				},
				{
					name: "tab-appearance",
					description: "The target identifier for the item used in frontend actions, etcetera.",
					type: {
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.AppearanceClass
					},
					visibilityConditions: [
						{
							attribute: "parent-control",	// TODO fix parent check
							condition: "==",
							value: "Tabber"
						}
					]
				},
			],
			childs: [
				...default_view_childs
			]
		},
		{ // ViewContainer
			type: ModelElementTypes.View,
			subtype: ModelElementTypes.View_Container,
			description: "ViewContainer as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "ViewContainer") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes,
				{
					name: "expand-by-hover",
					description: "Expands the view when hovering over it.",
					type: default_yes_no_attribute_type,
					visibilityConditions: [
						{
							attribute: "parent-control",	// TODO fix parent check
							condition: "==",
							value: "ViewContainer"
						}
					]
				},
				{
					name: "collapsable",
					description: "Makes the view collapsable.",
					type: default_yes_no_attribute_type,
					visibilityConditions: [
						{
							attribute: "parent-control",	// TODO fix parent check
							condition: "==",
							value: "ViewContainer"
						}
					]
				},
				{
					name: "collapsed",
					description: "Shows the view initially collapsed.",
					type: default_yes_no_attribute_type,
					visibilityConditions: [
						{
							attribute: "parent-control",	// TODO fix parent check
							condition: "==",
							value: "ViewContainer"
						},
						{
							operator: "and",
							attribute: "collapsable",
							condition: "==",
							value: "yes"
						}
					]
				},
			],
			childs: [
				...default_view_childs,
				{
					element: "view"
				}
			]
		},
		{ // Iframe
			type: ModelElementTypes.View, 
			subtype: ModelElementTypes.View_IFrame, 
			description: "Iframe as a definition",
			matchCondition: (nodeContext) => isViewControl(nodeContext, "Iframe") && isViewDeclaration(nodeContext),
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			prefixNameSpace: true,
			attributes: [
				...default_definition_view_attributes,
				{
					name: "src",
					description: "",
					visibilityConditions: [
						{
							attribute: "control",
							condition: "==",
							value: "Iframe"
						}
					]
				}
			],
			childs: [
				{
					element: "style-variables",
					occurence: "once"
				},
				...default_view_childs,

			]
		}],
	"root": [{
		description: "Project root of the frontend model.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "application",
				occurence: "at-least-once"
			},
			{
				element: "resources",
				occurence: "once"
			},
			{
				element: "document"
			}
		]
	}],
	"application": [{
		description: "",
		attributes: [
			{
				name: "appearance",
				description: "Main style, as defined in styles.xml.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Style
				}
			}
		],
		childs: [
			{
				element: "views",
				occurence: "once"
			},
			{
				element: "toolbars",
				occurence: "once"
			},
			{
				element: "trees",
				occurence: "once"
			},
			{
				element: "tree",
				occurence: "once"
			},
			{
				element: "functions",
				occurence: "once"
			},
			{
				element: "module"
			},
			{
				element: "resources",
				occurence: "once"
			},
			{
				element: "decorators",
				occurence: "once"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"include-blocks": [include_blocks_element],
	"include-block": [{
		type: ModelElementTypes.IncludeBlock,
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
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
							name: ModelElementTypes.View
						},
						{
							name: ModelElementTypes.Attribute
						},
						{
							name: ModelElementTypes.Group
						},
						{
							name: ModelElementTypes.Button
						},
						{
							name: ModelElementTypes.Action
						},
						{
							name: ModelElementTypes.Tree
						},
						{
							name: "condition"
						},
						{
							name: "node"
						},
						{
							name: "events"
						},
						{
							name: "event"
						},
						{
							name: "server-events"
						},
						{
							name: "server-event"
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
	"main-view": [{
		description: "A page framework in which views are to be rendered.",
		type:ModelElementTypes.MainView,
		attributes: [
			{
				name: "name",
				description: "Unique view name.",
				required: true,
			},
			{
				name: "file",
				description: "A URL of an HTML file to render inside.",
				type: {
					type: AttributeTypes.URL,
					default: "main.html"
				}
			},
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "view"
			},
			{
				element: "style-variables",
				occurence: "once"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"module": [{
		type: ModelElementTypes.Module,
		detailLevel: ModelDetailLevel.Declarations,
		isGroupingElement: true,
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
		childs: [
			{
				element: "module"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			},
			{
				element: "toolbar"
			},
			{
				element: "functions"
			},
			{
				element: "function"
			},
			{
				element: "tree"
			},
			{
				element: "views"
			},
			{
				element: "view"
			},
			{
				element: "main-view"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"model-condition": [model_condition_element],
	"trees": [{
		description: "Used to group navigation trees.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "tree"
			},
			{
				element: "module"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"tree": [{
		description: "Navigation tree.",
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		attributes: [
			{
				name: "name",
				description: "The unique name of the tree."
			},
			{
				name: "caption",
				description: "The title to display above the tree."
			},
			{
				name: "show",
				description: "If the node is initially visible.",
				type: default_yes_no_attribute_type
			},
			{
				name: "target-view",
				description: "Refers to a screen-active view to refresh with the views specified under the nodes of this tree when they are clicked.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.TargetView
				}
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "node"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"node": [{
		description: "Navigation tree node, which may be expandable into more nodes.",
		type: ModelElementTypes.Node,
		attributes: [
			{
				name: "name",
				description: "Unique identifier. If no caption is specified, the name is used as caption.",
				required: true
			},
			{
				name: "caption",
				description: "The text to display on the node."
			},
			{
				name: "info",
				description: "Will appear as tooltip of the node."
			},
			{
				name: "target-view",
				description: "Refers to a screen-active view to refresh with the view specified under this node when this node is clicked.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.TargetView
				}
			},
			{
				name: "view",
				description: "The view to show when the node is clicked.",
				visibilityConditions: [
					{
						attribute: "childnode-view",	// TODO: check on childnodes instead of attribute
						condition: "==",
						value: "empty"
					}
				]
			},
			{
				name: "open",
				description: "if the node is expanded initially.",
				type: default_yes_no_attribute_type
			},
			{
				name: "url",
				description: "The URL to load in the target view when clicking this node."
			},
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "node"
			},
			{
				element: "events",
				occurence: "once"
			},
			{
				element: "view",
				occurence: "once"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"toolbars": [{
		description: "Used to group toolbars.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "toolbar"
			},
			{
				element: "module"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"toolbar": [{
		description: "View toolbar.",
		isSymbolDeclaration: true,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "name",
				description: "Unique identifier of the toolbar.",
			},
			{
				name: "toolbar",
				description: "A toolbar this toolbar is based on.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Toolbar
				}
			},
			{
				name: "overflow-dropdown",
				description: "Move components to a dropdown when they do not fit.",
				type: default_yes_no_attribute_type
			},
			{
				name: "override-inherited",
				description: "Can be used to redefine the contents of an inherited toolbar.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "no"
						},
						{
							name: "children"
						},
						{
							name: "all"
						},
					]
				}
			},
			dev_comment_attribute,
			dev_override_rights_attribute,
			dev_is_declaration_attribute,
			dev_is_public_attribute,
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute
		],
		childs: [
			{
				element: "toolbarbutton"
			},
			{
				element: "separator"
			},
			{
				element: "search"
			},
			{
				element: "pagenumbers"
			},
			{
				element: "dropdown"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"toolbarbutton": [{
		description: "Client side scripting predefined tool.",
		type: ModelElementTypes.ToolbarButton,
		attributes: [
			{
				name: "name",
				description: "Unique identifier of the toolbar item."
			},
			{
				name: "caption",
				description: "Caption of the button."
			},
			{
				name: "icon",
				description: "Icon of the button."
			},
			{
				name: "disabled-icon",
				description: "Icon to show when the button is disabled."
			},
			{
				name: "info",
				description: "Tooltip text."
			},
			{
				name: "width",
				description: "Width of the button icon."
			},
			{
				name: "border-right",
				description: "Whether there is a border at the right of the button.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "default"
						},
						{
							name: "none",

						},
					]
				}
			},
			{
				name: "border-left",
				description: "Whether there is a border at the left of the button.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "default"
						},
						{
							name: "none",

						},
					]
				}
			},
			{
				name: "float",
				description: "If the button is floated right or left in the toolbar.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "none"
						},
						{
							name: "left"
						},
						{
							name: "right"
						}
					]
				}
			},
			{
				name: "icon-position",
				description: "Position of the icon. Left is default.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "none"
						},
						{
							name: "left"
						},
						{
							name: "right"
						}
					]
				}
			},
			{
				name: "action",
				description: "The tool function."
			},
			{
				name: "accesskey",
				description: "A key to access the button."
			},
			{
				name: "show",
				description: "If the button is initially visible.",
				type: default_yes_no_attribute_type
			},
			{
				name: "more",
				description: "If a \"more\" button has to be added, calling a drop down menu for this toolbarbutton.",
				type: default_yes_no_attribute_type
			},
			{
				name: "enabled",
				description: "If the button should be enabled or not",
				type: default_yes_no_attribute_type
			},
			{
				name: "fire-ondatachange",
				description: "If this toolbarbutton is dependent on the data loaded in the view which belongs to this toolbar. This can be usefull by e.g. FileLinks and Remarks",
				type: default_yes_no_attribute_type
			},
			{
				name: "data-dependent",
				description: "If the button is dependent on the selected data of the control.",
				type: default_yes_no_attribute_type
			},
			{
				name: "single-record",
				description: "If the button is dependent on one and only one data record.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "data-dependent",
						condition: "==",
						value: "yes"
					}
				]
			},
			dev_override_rights_attribute,
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "events"
			},
			{
				element: "format"
			},
			{
				element: "icon"
			},
			{
				element: "text"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"pagenumbers": [{
		description: "Toolbar item for paged navigation.",
		attributes: [dev_comment_attribute],
	}],
	"views": [{
		description: "Used for grouping views.",
		type:ModelElementTypes.Views,
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "view"
			},
			{
				element: "module"
			},
			{
				element: "main-view"
			},
			{
				element: "include-blocks"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"argument": [
		view_argument_element,
		action_argument_element
	],
	"events": [
		{
			type: ModelElementTypes.Events_Attribute,
			ancestors: [ModelElementTypes.Attribute],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_Button,
			ancestors: [ModelElementTypes.Button],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_Action,
			ancestors: [ModelElementTypes.Action],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_ToolBarButton,
			ancestors: [ModelElementTypes.ToolbarButton],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_Group,
			ancestors: [ModelElementTypes.Event_Group],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_MenuItem,
			ancestors: [ModelElementTypes.MenuItem],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_Node,
			ancestors: [ModelElementTypes.Node],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_Tab,
			ancestors: [ModelElementTypes.Tab],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_ToolBarButton,
			ancestors: [ModelElementTypes.ToolbarButton],
			...frontend_events_base_definition
		},
		{
			type: ModelElementTypes.Events_View,
			ancestors: [ModelElementTypes.View],
			...frontend_events_base_definition
		},
	],
	"server-events": [{
		description: "",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "server-event"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"server-event": [{
		description: "A server event registration.",
		attributes: [
			{
				name: "name",
				required: true,
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "oninitializedview",
							description: "When the view is initialized on the server",
							default: true
						}
					]
				}
			}
		],
		childs: [
			{
				element: "server-event"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"event": [
		{
			type: ModelElementTypes.Events_Attribute,
			ancestors: [ModelElementTypes.Event_Attribute],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "onchange",
								description: "When the field changes",
								default: true
							},
							{
								name: "onlookup",
								description: "When the lookup button is clicked"
							},
							{
								name: "onkeyup",
								description: "When a key is pressed"
							},
							{
								name: "onclick",
								description: "When the field is clicked (image/input)"
							},
							{
								name: "onfocus",
								description: "When the field has focus(string)"
							},
							{
								name: "onerror",
								description: "When an error occurs in the field"
							}
						]
					},
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
		{
			type: ModelElementTypes.Event_Button,
			ancestors: [ModelElementTypes.Events_Button],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "onclick",
								description: "When clicked",
								default: true
							},
							{
								name: "onmouseover",
								description: "On mouseover"
							}
						]
					},
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
		{
			type: ModelElementTypes.Event_ToolBarButton,
			ancestors: [ModelElementTypes.Events_ToolBarButton],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "onclick",
								description: "When clicked",
								default: true
							},
							{
								name: "onmouseover",
								description: "On mouseover"
							}
						]
					},
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
		{
			type: ModelElementTypes.Event_Node,
			ancestors: [ModelElementTypes.Events_Node],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "onclick",
								description: "When the node is clicked",
								default: true
							}
						]
					},
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
		{
			type: ModelElementTypes.Event_Group,
			ancestors: [ModelElementTypes.Events_Group],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "oncollapsegroup",
								description: "When the group is collapsed",
								default: true
							},
							{
								name: "onexpandgroup",
								description: "When the group is expanded"
							},
						]
					},
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
		{
			type: ModelElementTypes.Event_Tab,
			ancestors: [ModelElementTypes.Events_Tab],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "onactivatetab",
								description: "On activating the tab",
								default: true
							},
							{
								name: "ondeactivatetab",
								description: "On deactivating the tab"
							},
						]
					},
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
		{
			type: ModelElementTypes.Event_Action,
			ancestors: [ModelElementTypes.Events_Action],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "ontick",
								description: "On timer tick"
							}
						]
					},
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
		{
			type: ModelElementTypes.Event_MenuItem,
			ancestors: [ModelElementTypes.Events_MenuItem],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "onclick",
								description: "When clicked"
							}
						]
					},
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
		{
			type: ModelElementTypes.Event_View,
			ancestors: [ModelElementTypes.Events_View],
			description: "A specific event registration.",
			attributes: [
				{
					name: "name",
					description: "The type of event to listen to.",
					required: true,
					type: {
						type: AttributeTypes.Enum,
						options: [
							{
								name: "onbeforesave",
								description: "Before save"
							},
							{
								name: "onaftersave",
								description: "After save"
							},
							{
								name: "onbeforenewmode",
								description: "Before going to New mode"
							},
							{
								name: "onafterback",
								description: "When view is placed back from history"
							},
							{
								name: "onafternewmode",
								description: "After going to New mode"
							},
							{
								name: "onbeforedelete",
								description: "Before delete"
							},
							{
								name: "onafterdelete",
								description: "After delete"
							},
							{
								name: "onbeforeinsert",
								description: "Before saving a new record"
							},
							{
								name: "onafterinsert",
								description: "After saving a new record"
							},
							{
								name: "onbeforeeditmode",
								description: "Before going to Edit mode"
							},
							{
								name: "onbeforeloaddata",
								description: "Before loading the data"
							},
							{
								name: "onafterloaddata",
								description: "After loading the data"
							},
							{
								name: "oninitializedview",
								description: "When view is initialized"
							},
							{
								name: "onunloadview",
								description: "When unloading the view"
							},
							{
								name: "onselectediidchange",
								description: "When selecting an item in the list"
							},
							{
								name: "onlisttodetailmode",
								description: "When the list goes to object view"
							},
							{
								name: "onlisttonewmode",
								description: "When the list goes to New mode"
							},
							{
								name: "ontoviewmode",
								description: "When a view is going from Edit to View mode."
							},
							{
								name: "onunload",
								description: "When closing a popup, fires on the first view in de popup"
							},
							{
								name: "ontick",
								description: "On timer ticks"
							},
							{
								name: "onslidein",
								description: "On slide in"
							},
							{
								name: "onslideout",
								description: "On slide out"
							},
							{
								name: "onactivatetab",
								description: "On activating the view tab"
							},
							{
								name: "ondeactivatetab",
								description: "On deactivating the view tab"
							},
							{
								name: "onchange",
								description: "When an object changes"
							},
							{
								name: "onkeyup",
								description: "When a key is pressed"
							},
							{
								name: "onkeypress",
								description: "When a certain key combination is pressed"
							},
							{
								name: "onclick",
								description: "When input is clicked"
							},
							{
								name: "onnewappointment",
								description: "On new appointment"
							},
							{
								name: "oneditappointment",
								description: "On edit appointment"
							},
							{
								name: "onfocus",
								description: "On focus"
							},
							{
								name: "onclientwindowmessage",
								description: "On window message"
							},
							{
								name: "onannotationtooldrawingcreated",
								description: "Annotation tool - On drawing created"
							},
							{
								name: "onannotationtoolobjectselected",
								description: "Annotation tool - on object selected"
							},
							{
								name: "onannotationtoolbeforeobjectremoved",
								description: "Annotation tool - On before object removed"
							},
							{
								name: "onannotationtoolobjectremoved",
								description: "Annotation tool - On object removed"
							},
							{
								name: "onannotationtoollayercreated",
								description: "Annotation tool - On layer created"
							},
							{
								name: "onannotationtoollayerselected",
								description: "Annotation tool - On layer selected"
							},
							{
								name: "onannotationtoollayerremoved",
								description: "Annotation tool - On layer removed"
							},
							{
								name: "onannotationtoollayerchanged",
								description: "Annotation tool - On layer changed"
							},
							{
								name: "onannotationtoolmodechanged",
								description: "Annotation tool - On mode changed"
							},
							{
								name: "onbeforeunloadview",
								description: "before unloading the view"
							}
						]
					}
				},
				{
					name: "key",
					description: "The key combination to listen to (case insensitive). It can be any combination of Ctrl, Alt and Shift, combined with 0-9, a-z, or F1-F12, e.g. \"Ctrl+F1\"",
					visibilityConditions: [
						{
							attribute: "event",
							condition: "==",
							value: "onkeypress"
						}
					],
					requiredConditions: [
						{
							attribute: "event",
							condition: "==",
							value: "onkeypress"
						}
					],
				},
				dev_override_rights_attribute,
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			],
			childs: event_childs
		},
	],
	"attribute": [{
		type: ModelElementTypes.Attribute,
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
		description: "Describes an attribute of this type.",
		attributes: [
			{
				name: "name",
				required: true,
				description: "The name for the field. If the view is data bound, the fields with names corresponding to backend type attribute names will be data bound.",
				validations: [
					{
						type: "regex",
						value: /^[a-zA-Z]+[a-zA-Z0-9_]*$/,
						message: "Mathematical symbols and punctuation are not allowed in sub model object identifiers. Use '_' for namespacing."
					}
				]
			},
			{
				name: "caption",
				description: ""
			},
			{
				name: "bounded",
				description: "This indicates whether the field corresponds with a field from the related type. If the field is \"data bound\":[Model_Frontend_Bounded] (saved in the data). Useful when displaying values not in the persistence. A non-data bound field is a free form field that is not linked to a database attribute.",
				type: default_yes_no_attribute_type
			},
			{
				name: "type",
				description: "Determines field type and the saved attribute value.",
				type:
				{
					type: AttributeTypes.Enum,
					options: [
						{
							name: "string",
						},
						{
							name: "enum",
						},
						{
							name: "radio",
						},
						{
							name: "boolset",
						},
						{
							name: "segmentedbutton",
						},
						{
							name: "listbox",
						},
						{
							name: "numeric",
						},
						{
							name: "slidebar",
						},
						{
							name: "bool",
						},
						{
							name: "switch",
						},
						{
							name: "datetime",
						},
						{
							name: "date",
						},
						{
							name: "time",
						},
						{
							name: "text",
						},
						{
							name: "richtext",
						},
						{
							name: "richtextdisplay",
						},
						{
							name: "color",
						},
						{
							name: "color-swatch",
						},
						{
							name: "password",
						},
						{
							name: "passwordstrength",
						},
						{
							name: "email",
						},
						{
							name: "autofield",
						},
						{
							name: "none",
							description: "Only the label is displayed"
						},
						{
							name: "image",
						},
						{
							name: "attachment",
						},
						{
							name: "drawing",
						},
						{
							name: "multiselect",
						},
						{
							name: "sparkline",
						},
					]
				},
				visibilityConditions: [
					{
						attribute: "relation-type",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "relation-field",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "empty-allowed",
				description: "If the attribute or field can be left empty.",
				type:
				{
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "", // empty = yes
							obsolete: true
						},
						{
							name: "yes",
							default: true
						},
						{
							name: "no"
						}
					]
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "!=",
						value: "bool"
					}
				]
			},
			{
				name: "key",
				description: "One or more attributes of a type can be defined as key. These attributes together determine the primary key, which allows for a default sort order and ensures uniqueness of the fields.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "relation-field",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "attribute",
				description: "An attribute to inherit all properties from.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute // TODO: add Context of current type
				}
			},
			{
				name: "attribute-template",		// TODO: check if platform still supports this
				description: "A template this attribute is based on.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute // TODO: change this to AttributeTemplates once it's clear that platform it still supports
				}
			},
			{
				name: "sort",
				description: "A consecutive numeric value (starting with 1) which indicates the sort order index.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "sort-type",
				description: "If the sorting on this field should be ascending or descending.",
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
						}
					]
				},
				visibilityConditions: [
					{
						attribute: "sort",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "relation-type",
				description: "Set relation type to let this attribute represent a relation to an object of this type. For example, the attribute 'Patient' in a type 'Consults per patient' has as relation type value 'Patients'. When the relation type is specified, the attribute can have linked relation attributes using the relation field property (see below).",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "multiselect"
					},
					{
						operator: "or",
						attribute: "type",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "list-relation-type",
				description: "",
				visibilityConditions: [
					{
						attribute: "relation-type",
						condition: "==",
						value: "Platform.Lists"
					}
				]
			},
			{
				name: "relation-type-multiple",
				description: "The relation type for the multiple relation.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "multiselect"
					}
				]
			},
			{
				name: "relation-field",
				description: "Set relation field to let this attribute represent another attribute of a related type. This type of attribute is called a \"relation attribute\". Relation attributes *must* be defined in the backend because the backend otherwise will not send data to the frontend.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "relation-type",
						condition: "==",
						value: ""
					},
				]
			},
			{
				name: "allow-new",
				description: "If it is allowed to enter a new not existing item as relation. This relation will be saved then to the related type.</summary>To this end it is necessary that the compulsory fields are present as not-read-only relation attributes, otherwise the record can not be saved.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "relation-type-multiple",
						condition: "!=",
						value: ""
					},
					{
						operator: "or",
						attribute: "relation-type",
						condition: "!=",
						value: ""
					},
				]
			},
			{
				name: "display-as",
				description: "An attribute of the related type to display. Display-as can only be used when a relation type or relation field is specified.",
				type:
				{
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute	// TODO add specification what attributes need to be displayed. Filter on parent type name OR related type attribute
				},
				visibilityConditions: [
					{
						attribute: "relation-type",
						condition: "!=",
						value: ""
					},
					{
						operator: "or",
						attribute: "relation-field",
						condition: "!=",
						value: ""
					},
					{
						operator: "or",
						attribute: "relation-type-multiple",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "display-length",
				description: "Specifies the field width, defined in number of characters displayed.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "max-length",
				description: "Specifies the field width, defined in number of characters displayed.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "allowed-file-extensions",
				description: "The extensions that are allowed for uploading, separated by pipes ('|'). E.g.,\".txt|.rtf|.doc|.docx|.odt|.pdf\".",
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "image"
					},
					{
						operator: "or",
						attribute: "type",
						condition: "==",
						value: "attachment"
					}
				]
			},
			{
				name: "max-list-items",
				description: "Limit the enum list to a maximum",
				type: {
					type: AttributeTypes.Numeric
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "enum"
					}
				]
			},
			{
				name: "show-colorfield",
				description: "Show the field with the color value",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "color"
					}
				]
			},
			{
				name: "show-color-picker",
				description: "Show the extra button to pick a color from the colorpicker.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "color-swatch"
					}
				]
			},
			{
				name: "field",	// TODO check if this is still available in the platform
				description: "The password field to check the strength of.",
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "passwordstrength"
					}
				]
			},
			{
				name: "username-field", // TODO check if this is still available in the platform
				description: "The username field that belongs to the password field. Used to check username occurances in the password",
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "passwordstrength"
					}
				]
			},
			{
				name: "translatable",
				description: "If this attribute is multilingual. If so, the attribute will store a translation ID. The attribute will be translated before sending it to the front-end. See [Multilingual data]",
				type: default_yes_no_attribute_type
			}
		],
		childs: [
			{
				element: "option"
			},
			{
				element: "validations",
				occurence: "once"
			},
			{
				element: "events",
				occurence: "once"
			},
			{
				element: "format",
				occurence: "once"
			},
			{
				element: "argument"
			},
			{
				element: "decorations"
			},
			{
				element: "copy-attribute" // TODO still in use?
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"group": [
		{
			ancestors: [ModelElementTypes.View],
			type: ModelElementTypes.Group,
			isGroupingElement: true,
			description: "A field set, used to group fields. In the user interface, this (by default) draws a border around the fields.",
			attributes: view_group_attributes,
			childs: view_group_childs
		},
		{
			ancestors: [ModelElementTypes.Condition],
			type: ModelElementTypes.Group,
			description: "A group set, used to filter.",
			attributes: [dev_comment_attribute],
			childs: [
				{
					element: "group"
				},
				{
					element: "and"
				},
				{
					element: "or"
				},
				{
					element: "field"
				},
				{
					element: "include"
				},
				{
					element: "field"
				}

			]
		},
	],
	"button": [
		{
			description: "A button or link.",
			type: ModelElementTypes.Button,
			ancestors: [ModelElementTypes.View, ModelElementTypes.TitleBar, ModelElementTypes.MenuItem],
			isSymbolDeclaration: true,
			attributes: button_attributes,
			childs: button_childs
		},
		{
			ancestors: [ModelElementTypes.Action],
			attributes: [
				{
					name: "name"
				},
				{
					name: "caption",
					required: true
				},
				{
					name: "value",
					required: true
				},
			]
		},
	],
	"separator": [{
		description: "Separates nodes by a horizontal space.",
		attributes: [dev_comment_attribute],
	}],
	"tabber": [{
		description: "A tabber control by which fields can be tabbed.",
		attributes: [
			{
				name: "name",
				description: "identifier",
				required: true
			},
			{
				name: "active",
				description: "If the tab is default active in this tabber",
				required: true
			},
			{
				name: "left",
				description: "if in volatile mode, this means the left of the bar",
				visibilityConditions: [
					{
						attribute: "volatile",
						condition: "==",
						value: "yes"
					}
				]
			},
			{
				name: "top",
				description: "if in volatile mode, this means the top of the bar",
				visibilityConditions: [
					{
						attribute: "volatile",
						condition: "==",
						value: "yes"
					}
				]
			},
			{
				name: "width",
				description: ""
			},
			{
				name: "height",
				description: ""
			},
			dev_override_rights_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "tab",
				occurence: "at-least-once",
				required: true
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"tab": [{
		description: "",
		attributes: [
			{
				name: "name",
				description: "The Identifier of the tab",
				required: true
			},
			{
				name: "caption",
				description: "The caption of the tab",
				required: true
			},
			{
				name: "enabled",
				description: "if the tab is enabled by default",
				type: default_yes_no_attribute_type
			},
			{
				name: "show",
				description: "If the tab is visible by default",
				type: default_yes_no_attribute_type
			},
			{
				name: "volatile",
				description: "Make the tab position:absolute",
				type: default_yes_no_attribute_type
			},
			{
				name: "left",
				description: "if in volatile mode, this means the left of the bar",
				visibilityConditions: [
					{
						attribute: "volatile",
						condition: "==",
						value: "yes"
					}
				]
			},
			{
				name: "top",
				description: "if in volatile mode, this means the top of the bar",
				visibilityConditions: [
					{
						attribute: "volatile",
						condition: "==",
						value: "yes"
					}
				]
			},
			{
				name: "detail-height",
				description: "The height of the tab, when volatile",
				visibilityConditions: [
					{
						attribute: "volatile",
						condition: "==",
						value: "yes"
					}
				]
			},
			{
				name: "width",
				description: ""
			},
			{
				name: "height",
				description: ""
			},
			dev_override_rights_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "events",
				occurence: "once"
			},
			{
				element: "attribute"
			},
			{
				element: "group"
			},
			{
				element: "button"
			},
			{
				element: "tabber"
			},
			{
				element: "view"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"titlebar": [{
		description: "Definition of the titlebar of the view, in which title buttons can be added. When loaded in a popup, the elements are added to the header.",
		type: ModelElementTypes.TitleBar,
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "button"
			},
			{
				element: "dropdown"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"dropdown": [{
		description: "A dropdown menu. Typically it contains a text element. It also contains a menu definition.",
		attributes: [
			{
				name: "name",
				description: "Name of the dropdown.",
				required: true
			}
		],
		childs: [
			{
				element: "menu",
				occurence: "once"
			},
			{
				element: "text",
			},
			{
				element: "icon",
			},
			{
				element: "button",
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"menu": [{
		description: "The menu displayed when the dropdown opens.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "menuitem"
			},
			{
				element: "menuheader"
			},
			{
				element: "menudivider"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"menuitem": [{
		description: "A menu item. Typically this will contain a button element.",
		attributes: [dev_comment_attribute],
		type: ModelElementTypes.MenuItem,
		childs: [
			{
				element: "text",
			},
			{
				element: "icon",
			},
			{
				element: "button"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"menuheader": [{
		description: "A menu header, that can be placed above a set of items to group them. Typically this will contain a text element.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "text",
			},
			{
				element: "icon",
			},
			{
				element: "button"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"menudivider": [{
		description: "A menu divider that can be used to separate groups of menu items.",
		attributes: [dev_comment_attribute],
	}],
	"text": [{
		description: "Adds text.",
		attributes: [
			{
				name: "text",
				description: "The text rendered.",
				autoadd: true
			},
			{
				name: "appearance-class",
				description: "A style class applied to the element."
			},
		]
	}],
	"icon": [{
		description: "Adds an icon.",
		attributes: [
			{
				name: "ref",
				description: "ID reference to a theme icon, e.g. p-icon-user."
			},
			{
				name: "bg-image",
				description: "Path to a background image to use as icon."
			},
		]
	}],
	"format": [{
		description: "Defines a lay-out.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "image"
			},
			{
				element: "text"
			}
		]
	}],
	"image": [{
		description: "Displays the option images.",
		attributes: [
			{
				name: "width",
				description: "The width of the option images."
			},
			{
				name: "height",
				description: "The height of the option images. The default value is 16px."
			},
		]
	}],
	"action": [{
		description: "An Action",
		type: ModelElementTypes.ActionCall,
		attributes: [
			{
				name: "name",
				description: "The action to perform.",
				required: true
			},
			{
				name: "input-all",
				description: "If yes, all available local variables (in the frontend, the non-data bound as well as the data bound variables) will be passed to the action. Default is no.",
				type: default_yes_no_attribute_type
			},
			{
				name: "output-all",
				description: "If yes, all outputs returned by the action will be made available locally (in the frontend as non-data bound variables). Default is no.",
				type: default_yes_no_attribute_type
			},
			{
				name: "dataless",
				description: "If the standard added data argument should be left out. It is now left out by default for performance (unless input-all is set). (Currently, only applicable for frontend calls to server actions.)",
				type: default_yes_no_attribute_type
			},
			{
				name: "bounded",
				description: "If the action arguments are bound to the data, or just to local variables.",
				type: default_yes_no_attribute_type
			},
			{
				name: "record",
				description: "A piped list of IIDs on which the action should be executed. This could be useful in a ListView context, especially when calling an action from a function"
			},
			{
				name: "merge",
				description: "",
				type: default_yes_no_attribute_type
			},
			{
				name: "merge-key",
				description: "the key which is used to merge the function calls, defaults to the function name",
				visibilityConditions: [
					{
						attribute: "merge",
						condition: "==",
						value: "yes"
					}
				],
			},
			{
				name: "tabber",
				description: "",
				visibilityConditions: [
					{
						attribute: "target",
						condition: "==",
						value: "tab"
					}
				],
				requiredConditions: [
					{
						attribute: "target",
						condition: "==",
						value: "tab"
					}
				]
			},
			{
				name: "tab",
				description: "",
				visibilityConditions: [
					{
						attribute: "target",
						condition: "==",
						value: "tab"
					}
				],
				requiredConditions: [
					{
						attribute: "target",
						condition: "==",
						value: "tab"
					}
				]
			},
			{
				name: "button",
				description: "",
				visibilityConditions: [
					{
						attribute: "target",
						condition: "==",
						value: "button"
					}
				],
				requiredConditions: [
					{
						attribute: "target",
						condition: "==",
						value: "button"
					}
				]
			},
			{
				name: "field",
				description: "",
				visibilityConditions: [
					{
						attribute: "target",
						condition: "==",
						value: "field"
					},
					{
						operator: "or",
						attribute: "target",
						condition: "==",
						value: "label"
					}
				],
				requiredConditions: [
					{
						attribute: "target",
						condition: "==",
						value: "tab"
					},
					{
						operator: "or",
						attribute: "target",
						condition: "==",
						value: "label"
					}
				]
			},
			{
				name: "user-created",
				description: "Set this flag to yes in case the rule name is not hard-coded. In that case the platform will check whether the current user is allowed to invoke the rule (the rule should be marked as external-invocable in the security.xml).",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "name",
						condition: "==",
						value: "rule"
					}
				]
			},
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "graph-params",
				occurence: "once"
			},
			{
				element: "argument"
			},
			{
				element: "output"
			},
			{
				element: "condition"	// TODO: WHY?? This should not be possible
			},
			{
				element: "view"
			},
			{
				element: "events"
			},
			{
				element: "button"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"output": [
		action_call_output_element,
		{
			ancestors: [ModelElementTypes.Function],
			detailLevel: ModelDetailLevel.Declarations,
			isSymbolDeclaration: true,
			attributes: [
				{
					name: "name",
					required: true
				},
				dev_ignore_modelcheck_attribute,
				dev_ignore_modelcheck_justification_attribute,
				dev_comment_attribute
			]
		}
	],
	"input": [input_element],
	"condition": [{
		description: "The code beneath this condition will be executed conditionally, i.e., when the condition succeeds.</summary>To restrict further (logical 'and'), nest conditions (by adding an extra condition under this condition).",
		type: ModelElementTypes.Condition,
		attributes: [
			{
				name: "description"
			},
			{
				name: "mode",
				description: "The mode of the view as a condition. The values may be split by bars, e.g. \"new|edit\". When used in a function, the mode of the target view of the function (which is default the calling view) will be compared.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "overwrite or use default"
						},
						{
							name: "new"
						},
						{
							name: "edit"
						},
						{
							name: "view"
						},
					]
				}
			},
			{
				name: "control",
				description: "The control type of the view as a condition. The values may be split by bars, e.g. \"ListView|ObjectView\". When used in a function, the mode of the target view of the function (which is default the calling view) will be compared.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "DataTree"
						},
						{
							name: "Empty"
						},
						{
							name: "Graph"
						},
						{
							name: "HtmlFile"
						},
						{
							name: "ListView"
						},
						{
							name: "ObjectView"
						},
						{
							name: "Tabber"
						},
						{
							name: "Tree"
						},
						{
							name: "ViewContainer"
						}
					]
				}
			},
			{
				name: "sal",
				description: "The SAL access of the user accessing the view as a condition.</summary>When used in a function, the SAL of the target view of the function (which is default the calling view) will be compared.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "all"
						},
						{
							name: "read"
						},
						{
							name: "update"
						},
						{
							name: "create"
						},
						{
							name: "delete"
						}
					]
				}
			},
			dev_override_rights_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "action"
			},
			{
				element: "condition"
			},
			{
				element: "field"
			},
			{
				element: "then",
				occurence: "once"
			},
			{
				element: "else",
				occurence: "once"
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
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"field": [{
		description: "A boolean condition to check.</summary>Add more fields to strengthen the condition (logical 'and'). The 'equal to', 'contains' and 'does not contain' operators are also accepting a piped list of values.",
		type: ModelElementTypes.Field,
		attributes: [
			{
				name: "name",
				description: "The name of an attribute or of a local variable.",
				required: true
			},
			{
				name: "condition",
				description: "",
				required: true,
				type: search_condition_options_attribute_type
			},
			{
				name: "value",
				description: "Value to compare with."
			},
			{
				name: "bounded",
				description: "Determines if the field is got from the bound data.",
				type: default_yes_no_attribute_type
			}
		]
	}],
	"or": [{
		description: "The or-operator between search columns. Use the group element to specify brackets.",
		attributes: [dev_comment_attribute],
	}],
	"and": [{
		description: "The and-operator between search columns. In fact, and is the default, so it can be omitted.",
		attributes: [dev_comment_attribute],
	}],
	"then": [{
		description: "The actions in the then will only be executed if the conditions succeed.",
		attributes: [dev_override_rights_attribute],
		childs: [
			{
				element: "action"
			},
			{
				element: "condition"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"else": [{
		description: "The actions in or after the else will only be executed if the conditions fail.",
		attributes: [dev_override_rights_attribute],
		childs: [
			{
				element: "action"
			},
			{
				element: "condition"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"option": [{
		description: "",
		attributes: [
			{
				name: "value"
			},
			{
				name: "caption"
			},
			{
				name: "show",
				description: "If the option is initially visible.",
				type: default_yes_no_attribute_type
			},
		]
	}],
	"validations": [{
		description: "This will allow validating the fields etc.",
		attributes: [dev_comment_attribute],
		childs: [{
			element: "validation"
		}]
	}],
	"validation": [{
		description: "Validations on fields are things like: Required, Email.",
		attributes: [
			{
				name: "name",
				description: "The name of the validation.",
				required: true
			},
			{
				name: "message",
				description: "The validation message."
			},
			{
				name: "function",
				description: "A reference to a frontend function which validates the value of the field."
			},
			{
				name: "regular-expression",
				description: "A regular expression to validate the value of the field."
			},
		]
	}],
	"sort": [{
		description: "Defines an ordering over a property of objects of a certain type. Multiple property orderings may be stacked.",
		attributes: [
			{
				name: "name",
				description: "Specifies an attribute of the type to order by."
			},
			{
				name: "order",
				description: "The type of ordering over the values of the property to order by.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "asc",
							description: "Ascending"
						},
						{
							name: "desc",
							description: "Descending"
						},
					]
				}
			},
		]
	}],
	"list": [{
		description: "Datatree list definition.",
		attributes: [
			{
				name: "infoset",
				description: "The data set loaded in the data tree."
			},
			{
				name: "target-view",
				description: "The target view for the actions fired by the nodes created by this list."
			},
			{
				name: "display-as",
				description: "Which attribute of the items of the infoset is displayed in the tree."
			},
			{
				name: "filter",
				description: "The name of the infoset argument with which the IId of the parent context node (if any) is passed."
			},
			{
				name: "node-icon",
				description: "The icon for the nodes in this list."
			},
			{
				name: "nodeselected-icon",
				description: "The icon for selected nodes in this list."
			},
			{
				name: "open",
				description: "if the list is expanded initially.",
				type: default_yes_no_attribute_type
			},
			{
				name: "display-appearance",
				description: ""
			},
		]
	}],
	"attachments": [{
		description: "A list of all attachments of the current object.",
		attributes: [
			{
				name: "appearance-class",
				description: "The appearance of the attachments."
			},
			dev_comment_attribute
		]
	}],
	"layout": [{
		description: "",
		attributes: [
			{
				name: "removable",
				description: "If it is possible to remove portlets from the portal by clicking the close button.",
				type: default_yes_no_attribute_type
			},
			{
				name: "sortable",
				description: "If it is possible to sort the portlets by dragging and dropping.",
				type: default_yes_no_attribute_type
			},
			{
				name: "add-viewlet-function",
				description: ""
			},
			{
				name: "resizable",
				description: "Possible values: 'yes', 'no' or some number. If set to 'yes' the user can resize portlets. If the value is a number, this will be the width/height ratio. E.g. ratio 2 will cause that the portlet's width is always twice as much as the height."
			},
		]
	}],
	"column": [{
		description: "",
		attributes: [
			{
				name: "width",
				description: "The width of the column."
			}
		],
		childs: [
			{
				element: "view"
			}
		]
	}],
	"row": [{
		description: "",
		attributes: [
			{
				name: "height",
				description: "The height of the row."
			}
		],
		childs: [
			{
				element: "view"
			}
		]
	}],
	"IconConditions": [{
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "IconCondition"
			}
		]
	}],
	"IconCondition": [{
		attributes: [
			{
				name: "Value"
			},
			{
				name: "IconPath"
			}
		]
	}],
	"design": [{
		attributes: [
			{
				name: "design-base-view",
				description: "The view to inherit from, when going to design mode. Currently the only suited view in the platform model is Platform.Designer.StartLayoutSidebar (but one could inherit or create another view)."
			},
			{
				name: "draggable",
				description: "If set to \"no\" the components cannot be moved",
				type: default_yes_no_attribute_type
			},
			{
				name: "multiselect",
				description: "If set to \"no\" only single selection is possible",
				type: default_yes_no_attribute_type
			},
		]
	}],
	"source": [{
		attributes: [
			{
				name: "name"
			},
			{
				name: "content"
			},
			{
				name: "apply-templating",
				type: default_yes_no_attribute_type
			},
			{
				name: "type"
			},
			{
				name: "iid"
			},
			{
				name: "field"
			},
		]
	}],
	"units": [{
		attributes: [dev_comment_attribute],
	}],
	"appointments": [{
		attributes: [dev_comment_attribute],
	}],
	"filters": [{
		attributes: [dev_comment_attribute],
	}],
	"filter": [{
		attributes: [dev_comment_attribute],
	}],
	"agenda-view": [{
		attributes: [dev_comment_attribute],
	}],
	"month-view": [{
		attributes: [dev_comment_attribute],
	}],
	"timeline-view": [{
		attributes: [dev_comment_attribute],
	}],
	"units-view": [{
		attributes: [dev_comment_attribute],
	}],
	"week-view": [{
		attributes: [dev_comment_attribute],
	}],
	"year-view": [{
		attributes: [dev_comment_attribute],
	}],
	"report-parameters": [{
		description: "Parameters to pass to the report.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "report-parameter",
				occurence: "at-least-once"
			}
		]
	}],
	"report-parameter": [{
		description: "A parameter to pass to the report.",
		attributes: [
			{
				name: "name",
				description: "Name of a destination field or variable in the report."
			},
			{
				name: "argument-name",
				description: "The argument name within the view, if the value is not constant."
			},
			{
				name: "value",
				description: "A constant value to pass instead of an argument."
			}
		]
	}],
	"style-variables": [{
		description: "Apply style variables to the view HTML element",
		attributes: [
			{
				name: "rule",
				description: "The name of the rule to retrieve the style variables from."
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "argument"
			}
		]
	}],
	"functions": [{
		description: "Frontend function definitions.",
		attributes: [
			{
				name: "name"
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "function"
			},
			{
				element: "functions"
			},
			{
				element: "module"
			}
		]
	}],
	"function": [{
		description: "A frontend function, that can be called by a single action call.",
		type: ModelElementTypes.Function,
		isSymbolDeclaration: true,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "name",
				description: "Unique identifier of the function."
			},
			dev_override_rights_attribute,
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "input"
			},
			{
				element: "output"
			},
			{
				element: "condition"
			},
			{
				element: "action"
			},
			child_include,
			child_merge_instruction,
			child_model_condition
		]
	}],
	"resources": [{
		description: "References to include in the frontend.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "script"
			},
			{
				element: "stylesheet"
			}
		]
	}],
	"script": [{
		description: "A script reference to include in the frontend.",
		attributes: [
			{
				name: "src",
				description: "Project relative file path.",
				required: true
			},
			{
				name: "client-mode",
				description: "If this resource should only be loaded by a specific client mode, specify the client mode here. WARNING: loading too much scripts for mobile will result in a performance drop!",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "mobile"
						},
						{
							name: "all"
						},
					]
				}
			}
		]

	}],
	"stylesheet": [{
		description: "A stylesheet reference to include in the frontend.",
		attributes: [
			{
				name: "src",
				description: "Project relative file path.",
				required: true
			},
			{
				name: "client-mode",
				description: "If this resource should only be loaded by a specific client mode, specify the client mode here. WARNING: loading too much scripts for mobile will result in a performance drop!",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "mobile"
						},
						{
							name: "all"
						},
					]
				}
			}
		]
	}],
	"search": [{
		description: "Toolbar search field.",
		attributes: [
			{
				name: "float",
				description: "Whether the field is floated.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "left"
						},
						{
							name: "right"
						},
						{
							name: "",
							description: "none"
						},
					]
				}
			},
			{
				name: "icon",
				description: "The icon of the button in the toolbar that the user has to click for displaying the search field."
			},
			{
				name: "hide-extended-icon",
				description: "Link to an image for the search field in “open” form."
			},
			{
				name: "show-extended-icon",
				description: "Link to an image for the search field in “closed” form."
			},
			{
				name: "disabled-icon",
				description: "The icon of the button when the item is disabled."
			},
			{
				name: "width",
				description: "The icon of the button when the item is disabled."
			},
			{
				name: "extend-width",
				description: "The width of the search field in \"closed\" form."
			},
		]
	}],
	"decorations": [decorations_element],
	"decoration": [decoration_element],
	"decoration-argument": [decoration_argument_element],
	"decorators": [decorators_element],
	"decorator": [decorator_element],
	"decorator-input": [decorator_input_element],
	"target": [target_element],
	"decorator-context-entity": [decorator_context_entity_element],
	"merge-instruction": [merge_instruction_element],
	"metadata-initialize": [{
		description: "Modifies the metadata just before it is used.",
		attributes: [
			{
				name: "use-xml",
				description: "Use XML actions (improves performance but limits actions).",
				type: default_yes_no_attribute_type
			},
			{
				name: "is-metadata-loaded",
				description: "By default, the current metadata is inserted and can be accessed. For performance reasons it can be better to not insert the current metadata but just generate new metadata that is merged with the current metadata.",
				type: default_yes_no_attribute_type
			},
		],
		childs: [
			{
				element: "action"
			},
			{
				element: "clear-var"
			}
		]
	}],
};

