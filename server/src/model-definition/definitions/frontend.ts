import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { decorations_element, decoration_argument_element, decoration_element, decorators_element, decorator_context_entity_element, decorator_element, decorator_input_element, default_yes_no_attribute_type, dev_comment_attribute, dev_description_attribute, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute, dev_is_declaration_attribute, dev_is_public_attribute, dev_override_rights_attribute, include_blocks_element, include_element, model_condition_element, target_element, target_namespace_attribute, view_argument_element } from './shared';

export const FRONTEND_DEFINITION: Definitions = {
	"root": [{
		description: "Project root of the frontend model.",
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
			}
		]
	}],
	"include-block": [include_blocks_element],
	"include": [include_element],
	"main-view": [{
		description: "A page framework in which views are to be rendered.",
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
		]
	}],
	"module": [{
		type:ModelElementTypes.Module,
		detailLevel: ModelDetailLevel.Declarations,
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
				element: "include"
			},
			{
				element: "model-condition"
			},
			{
				element: "merge-instruction"
			},
			{
				element: "view"
			},
			{
				element: "main-view"
			}			
		]
	}],
	"trees": [{
		description: "Used to group navigation trees.",
		childs: [
			{
				element: "tree"
			},
			{
				element: "module"
			}
		]
	}],
	"tree": [{
		description: "Navigation tree.",
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
				element: "node",
				occurence: "at-least-once",
				required: true
			}
		]
	}],
	"node": [{
		description: "Navigation tree node, which may be expandable into more nodes.",
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
		]
	}],
	"toolbars": [{
		description: "Used to group toolbars.",
		childs: [
			{
				element: "toolbar"
			},
			{
				element: "module"
			},
		]
	}],
	"toolbar": [{
		description: "View toolbar.",
		attributes: [
			{
				name: "name",
				description: "Unique identifier of the toolbar.",
				required: true
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
		]
	}],
	"views": [{
		description: "Used for grouping views.",
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
		]
	}],
	"view": [{
		description: "Defines a lay-out frame (e.g. for displaying objects of a specified backend type).",
		attributes: [
			{
				name: "name",
				description: "Unique name for the view.</summary>The name is in most cases the outside identifier (views can be retrieved by name). For nested views, the name is not used as an outside identifier, but only for inner identifier. Using same inner identifiers merges subviews on inheritance.",
				required: true,
				validations: [
					{
						type: "regex",
						value: /^[a-zA-Z]+[0-9a-zA-Z_\-.]*$/,
						message: "1) Special characters (except '_', '-', '.') are not allowed in the name of the view. 2) A name should start with a letter"
					}
				],
				visibilityConditions: [
					{
						attribute: "parent-node",	// TODO check parent node instead of attribute
						condition: "!=",
						value: "view"
					}
				]
			},
			{
				name: "target-uri",
				description: "The target identifier for the item used in frontend actions, etcetera.",
				visibilityConditions: [
					{
						attribute: "parent-node",	// TODO check parent node instead of attribute
						condition: "==",
						value: "view"
					}
				]				
			},
			{
				name: "control",
				description: "View control type.",
				type: {
					type: AttributeTypes.Enum,
					options: [
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
					]
				}	
			},
			{
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
			},
			{
				name: "type",
				description: "The backend data type to which the view is linked.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				}
			},
			{
				name: "view",
				description: "A view to inherit from. An inherited view copies all characteristics of the source view unless the attributes are changed in the inherited view. Supplements are also possible.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.View
				}
			},
			{
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
			},
			{
				name: "bounded",
				description: "If the view is data bound, that is, presents and saves instances from the data type.</summary>It is possible to us a not data bound view for e.g. filtering purposes.",
				type: default_yes_no_attribute_type
			},
			{
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
			},
			{
				name: "tree",
				description: "The navigation tree to display. Only applicable for tree control views.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Tree
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Tree"
					}
				]
			},
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
			},
			{
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
			},
			{
				name: "portlet",
				description: "If the view can be added to a portal view.",
				type: default_yes_no_attribute_type
			},
			{
				name: "show-favorites-column",
				description: "Whether to show a favorites column.",
				type: default_yes_no_attribute_type
			},
			{
				name: "favorites-column-position",
				description: "Where the favorites column is located. Can be 'begin', 'end', or a column number.",
				type: default_yes_no_attribute_type
			},
			{
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
			},
			{
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
			},
			{
				name: "layoutable",
				description: "Whether or not a layout can be created by the Inspector. If set to 'yes' then the view should also have a name.",
				type: default_yes_no_attribute_type
			},
			{
				name: "layout",
				description: "The explicit name of the layout in the layout.xml file. Usually this value is empty, because layoutable='yes' will compute a name automatically. If the layout is set then the view should also have a name.",
			},
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
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "start-day",
				description: "The date of the day to start with. It's the initial day.",
				type: {
					type: AttributeTypes.Date
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "first-hour",
				description: "Minimum value for the hour scale. Default 0.",
				type: {
					type: AttributeTypes.Numeric
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				],
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
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				],
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
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				],
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
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				],
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
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				],
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
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "mark-now",
				description: "Marker displaying current time.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "create",
				description: "Possibility to disable adding appointments.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "day-tab-visible",
				description: "Shows day tab.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "week-tab-visible",
				description: "Shows week tab.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "next-button-visible",
				description: "Shows next button.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "previous-button-visible",
				description: "Shows previous button.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
			{
				name: "today-button-visible",
				description: "Shows today button.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
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
						attribute: "control",
						condition: "==",
						value: "Organizer"
					},
					{
						operator: "and",
						attribute: "hour-format",
						condition: "==",
						value: "12"
					}
				]
			},
			{
				name: "multi-day",
				description: "Enables rendering multi-day events.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "Organizer"
					}
				]
			},
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
			{
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
			},
			{
				name: "page-size",
				description: "The number of rows per page. If the value is 'auto' then the number of records shown will depend on the specified height.</summary>Only applicable to list control views.",
				type: {
					type: AttributeTypes.Numeric
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "multiple-select",
				description: "Enables/disables selecting more records in a list view.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "searchcolumn",
				description: "The default attribute to start list search with.</summary>Only applicable for list control views.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "objectview",
				description: "To change the view that is opened when this list view changes to object view.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.View	// TODO filter on type object views
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "objectview-toolbar",
				description: "To change the toolbar when this view changes to object view.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Toolbar
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
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
			},
			{
				name: "all-when-empty-filter",
				description: "If yes and all filter arguments are empty it will show all the data (paged), if no, it will show nothing in that case.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "show-new-record-in-listview",
				description: "Whether a row has to be displayed in the list view for entering a new record.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "list-height",
				description: "The height of textareas in the list.",
				type: {
					type: AttributeTypes.Numeric
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "more-pagination",
				description: "If the list view has a paging record at the bottom (showing the text 'More...') which can be clicked to get the next page of the list and append it to the bottom.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "row-details-view",
				description: "The view to show row details with. See [Row details in a list view].",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.View
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
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
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "no-results-found-row",
				description: "Show a row if no result are found. It will display the text as specified with the option 'no result found text'.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					}
				]
			},
			{
				name: "no-results-found-text",
				description: "The text to show when no results are found. Defaults to 'No results found'. This value will be translated.",
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ListView"
					},
					{
						operator: "and",
						attribute: "no-results-found-text",
						condition: "==",
						value: "yes"
					}
				]
			},
			{
				name: "focus-field",
				description: "The field to give initial focus when the object view loads.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute	// TODO: filter attributes current view
				},
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ObjectView"
					}
				]
			},
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
			dev_comment_attribute
		],
		childs: [
			{
				element: "attribute"
			},
			{
				element: "separator"
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
				element: "view"
			},
			{
				element: "sort"
			},
			{
				element: "list",
				occurence: "once"
			},
			{
				element: "node",
				occurence: "once"
			},
			{
				element: "server-events",
				occurence: "once"
			},
			{
				element: "attachments",
				occurence: "once"
			},
			{
				element: "layout",
				occurence: "once"
			},
			{
				element: "column"
			},
			{
				element: "row"
			},
			{
				element: "function" 	// TODO: remove... this is a bad practice. Define functions in the functions part
			},
			{
				element: "IconConditions"	// TODO: remove; not in use
			},
			{
				element: "design"
			},
			{
				element: "source"
			},
			{
				element: "metadata-initialize",
				occurence: "once"
			},
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
			},
			{
				element: "report-parameters",
				occurence: "once"
			},
			{
				element: "style-variables",
				occurence: "once"
			},
		]
	}],
	"argument": [view_argument_element],
	"events": [{}],
	"server-events": [{}],
	"event": [{}],
	"attribute": [{}],
	"group": [{}],
	"button": [{}],
	"tabber": [{}],
	"tab": [{}],
	"titlebar": [{}],
	"dropdown": [{}],
	"menu": [{}],
	"text": [{}],
	"icon": [{}],
	"format": [{}],
	"action": [{}],
	"output": [{}],
	"condition": [{}],
	"field": [{}],
	"or": [{}],
	"and": [{}],
	"then": [{}],
	"else": [{}],
	"option": [{}],
	"validations": [{}],
	"validation": [{}],
	"sort": [{}],
	"list": [{}],
	"attachments": [{}],
	"layout": [{}],
	"column": [{}],
	"row": [{}],
	"IconConditions": [{}],
	"IconCondition": [{}],
	"design": [{}],
	"units": [{}],
	"appointments": [{}],
	"filters": [{}],
	"filter": [{}],
	"agenda-view": [{}],
	"month-view": [{}],
	"timeline-view": [{}],
	"units-view": [{}],
	"week-view": [{}],
	"year-view": [{}],
	"report-parameters": [{}],
	"report-parameter": [{}],
	"style-variable": [{}],
	"functions": [{}],
	"function": [{
		type: ModelElementTypes.Function,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
	}],
	"resources": [{}],
	"script": [{}],
	"stylesheet": [{}],
	"decorations": [decorations_element],
	"decoration": [decoration_element],
	"decoration-argument": [decoration_argument_element],
	"decorators": [decorators_element],
	"decorator": [decorator_element],
	"decorator-input": [decorator_input_element],
	"target": [target_element],
	"decorator-context-entity": [decorator_context_entity_element]
};