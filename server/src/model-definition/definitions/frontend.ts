import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { action_argument_element, action_output_element, decorations_element, decoration_argument_element, decoration_element, decorators_element, decorator_context_entity_element, decorator_element, decorator_input_element, default_yes_no_attribute_type, dev_comment_attribute, dev_description_attribute, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute, dev_is_declaration_attribute, dev_is_public_attribute, dev_override_rights_attribute, event_childs, include_blocks_element, include_element, input_element, merge_instruction_element, model_condition_element, search_condition_options_attribute_type, target_element, target_namespace_attribute, view_argument_element, view_group_attributes, view_group_childs } from './shared';

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
			},
			{
				element: "include"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			}
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
			}			
		]
	}],
	"model-condition": [model_condition_element],
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
				element: "node"
			},
			{
				element: "include"
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
				element: "model-condition"
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
			{
				element: "model-condition"
			}
		]
	}],
	"toolbarbutton":[{
		description: "Client side scripting predefined tool."
	}],
	"pagenumbers":[{
		description: "Toolbar item for paged navigation."
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
			{
				element: "include-blocks"
			},
			{
				element: "include"
			},
		]
	}],
	"view": [{
		type: ModelElementTypes.View,
		description: "Defines a lay-out frame (e.g. for displaying objects of a specified backend type).",
		attributes: [
			{
				name: "name",
				description: "Unique name for the view.</summary>The name is in most cases the outside identifier (views can be retrieved by name). For nested views, the name is not used as an outside identifier, but only for inner identifier. Using same inner identifiers merges subviews on inheritance.",
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
			{
				name: "appearance",
				description: "The style of this view.",
				deprecated: true,	// appearance is something that is hardly used, so it should be deprecated
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Appearance
				}
			},
			{
				name: "appearance-class",
				description: "A specific style for the view element.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.AppearanceClass
				}
			},
			{
				name: "float",
				description: "Whether the view is floated",
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
			{
				name: "background-image",
				description: "A background image for the view. (TIP: use SCSS instead of this attribute)"
			},
			{
				name: "background-position",
				description: "Background position for the view. See: http://www.w3.org/TR/CSS2/colors.html (TIP: use SCSS instead of this attribute)"
			},
			{
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
			},
			{
				name: "skip-history",
				description: "If set to true, the Back button will skip this view.",
				type: default_yes_no_attribute_type
			},
			{
				name: "readonly",
				description: "Set yes if view suppose to be view only is. No data can be saved from this view.",
				type: default_yes_no_attribute_type
			},
			{
				name: "help-code",
				description: "The tag of the Help page to show when displaying help. When not specified, the view name is used as tag."
			},
			{
				name: "save-to-parent",
				description: "",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "control",
						condition: "==",
						value: "ObjectView"
					}
				]
			},
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
			},
			{
				name: "designable",
				description: "Whether the view is designable by a user having designer rights.",
				deprecated: true,
				deprecationMessage: "This shouldn't be a feature",
				type: default_yes_no_attribute_type
			},
			{
				name: "designable",
				description: "If set to true, the Back button will skip this view.",
				type: default_yes_no_attribute_type
			},
			{
				name: "lookup-width",
				description: "The width of the view in lookup dialog state."
			},
			{
				name: "lookup-height",
				description: "The height of the view in lookup dialog state."
			},
			{
				name: "lookup-top",
				description: "The vertical position of the view in lookup dialog state."
			},
			{
				name: "lookup-left",
				description: "The horizontal position of the view in lookup dialog state."
			},
			{
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
			},
			{
				name: "top",
				description: "",
				visibilityConditions: [
					{
						attribute: "position",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "right",
				description: "",
				visibilityConditions: [
					{
						attribute: "position",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "bottom",
				description: "",
				visibilityConditions: [
					{
						attribute: "position",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "left",
				description: "",
				visibilityConditions: [
					{
						attribute: "position",
						condition: "!=",
						value: ""
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
			{
				name: "log-access",
				description: "Determines whether all access that is requested for this view (at runtime) has to be logged or not.",
				type: default_yes_no_attribute_type
			},
			{
				name: "log-attributes",
				description: "A pipe-separated list of attributes (from the arguments or the data of the view) to log with access logging.",
				visibilityConditions: [
					{
						attribute: "log-access",
						condition: "==",
						value: "yes"
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
			{
				element: "merge-instruction"
			}
		]
	}],
	"argument": [
		view_argument_element, 
		action_argument_element
	],
	"events": [
		{
			type: ModelElementTypes.Events,
			description: "Frontend event registrations.\"Events\":[EventsAndActions_ActionsOverview] are the predefined events at the client side. These trigger a server side or client side action, as a result of which an operation (on the server or in the screen) is initiated.",
			attributes: [dev_comment_attribute],
			childs: [
				{
					element: "event",
					occurence: "at-least-once"
				}
			]
		}
	],
	"server-events": [{
		description: "A server event registration.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "server-event"
			}
		]
	}],
	"event": [
		{
			type: ModelElementTypes.Event,
			ancestor: ModelElementTypes.Attribute,
			description: "A specific event registration.",
			attributes: [
				{
					name: "event",
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
			type: ModelElementTypes.Event,
			ancestor: ModelElementTypes.Button,
			description: "A specific event registration.",
			attributes: [
				{
					name: "event",
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
			type: ModelElementTypes.Event,
			ancestor: "node",
			description: "A specific event registration.",
			attributes: [
				{
					name: "event",
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
			type: ModelElementTypes.Event,
			ancestor: ModelElementTypes.Group,
			description: "A specific event registration.",
			attributes: [
				{
					name: "event",
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
			type: ModelElementTypes.Event,
			ancestor: "tab",
			description: "A specific event registration.",
			attributes: [
				{
					name: "event",
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
			type: ModelElementTypes.Event,
			ancestor: ModelElementTypes.Action,
			description: "A specific event registration.",
			attributes: [
				{
					name: "event",
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
			type: ModelElementTypes.Event,
			ancestor: "menuitem",
			description: "A specific event registration.",
			attributes: [
				{
					name: "event",
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
			type: ModelElementTypes.Event,
			ancestor: ModelElementTypes.View,
			description: "A specific event registration.",
			attributes: [
				{
					name: "event",
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
				element: "include"
			},
			{
				element: "decorations"
			},
			{
				element: "copy-attribute" // TODO still in use?
			},
		]
	}],
	"group": [
		{
			ancestor: ModelElementTypes.Group,
			description: "A field set, used to group fields. In the user interface, this (by default) draws a border around the fields.",
			attributes: view_group_attributes,
			childs: view_group_childs
		},
		{
			ancestor: ModelElementTypes.View,
			description: "A field set, used to group fields. In the user interface, this (by default) draws a border around the fields.",
			attributes: view_group_attributes,
			childs: view_group_childs
		},
		{
			ancestor: ModelElementTypes.Condition,
			description: "A group set, used to filter.",
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
			ancestor: ModelElementTypes.View	// buttons on view
		},
		{
			ancestor: "titlebar"				// titlebar buttons
		},
		{
			ancestor: ModelElementTypes.Action	// questions
		},
	],
	"tabber": [{
		description: "A tabber control by which fields can be tabbed.",
		attributes:[
			{
				name: "name",
				description: "identifier",
				required: true
			},
			{
				name: "active",
				description: "If the tab is default active in this tabber",
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
		childs:[
			{
				element: "tab",
				occurence: "at-least-once",
				required: true
			}
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
		]	
	}],
	"titlebar": [{
		description: "Definition of the titlebar of the view, in which title buttons can be added. When loaded in a popup, the elements are added to the header.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "button"
			},
			{
				element: "dropdown"
			}
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
			}
		]
	}],
	"menu": [{
		description: "The menu displayed when the dropdown opens.",
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
		]
	}],
	"menuitem": [{
		description: "A menu item. Typically this will contain a button element.",
		childs: [
			{
				element: "text",
			},
			{
				element: "icon",
			},
			{
				element: "button"
			}
		]
	}],
	"menuheader": [{
		description: "A menu header, that can be placed above a set of items to group them. Typically this will contain a text element.",
		childs: [
			{
				element: "text",
			},
			{
				element: "icon",
			},
			{
				element: "button"
			}
		]
	}],
	"menudivider": [{
		description: "A menu divider that can be used to separate groups of menu items."
	}],
	"text": [{
		description: "Adds text.",
		attributes: [
			{
				name: "text",
				description: "The text rendered.",
				required: true
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
		attributes: [
			{
				name: "name",
				description: "The action to perform.",
				required: true
			},
			{	name: "input-all",
				description: "If yes, all available local variables (in the frontend, the non-data bound as well as the data bound variables) will be passed to the action. Default is no.",
				type: default_yes_no_attribute_type
			},
			{	name: "output-all",
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
		]
	}],
	"output": [
		action_output_element,
		{
			ancestor: ModelElementTypes.Function,
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
			{
				element: "include"
			},
		]
	}],
	"field": [{
		description: "A boolean condition to check.</summary>Add more fields to strengthen the condition (logical 'and'). The 'equal to', 'contains' and 'does not contain' operators are also accepting a piped list of values.",
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
		description: "The or-operator between search columns. Use the group element to specify brackets."
	}],
	"and": [{
		description: "The and-operator between search columns. In fact, and is the default, so it can be omitted."
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
			{
				element: "include"
			}
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
			{
				element: "include"
			}
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
	"report-parameters": [{
		description: "Parameters to pass to the report.",
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
		]
	}],
	"resources": [{
		description: "References to include in the frontend.",
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