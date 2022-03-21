import { XmlNode } from '../../file-analyzer/parser/saxParserExtended';
import { TreeNode } from './tree';

export enum ModelElementTypes {
	Action = "Action",
	ActionCall = "ActionCall",
	ActionCallOutput = "ActionCallOutput",
	Aggregate = "Aggregate",
	All = "All",
	Argument = "Argument",
	Attribute = "Attribute",
	Case = "Case",
	Constant = "Constant",
	Condition = "Condition",
	Count = "Count",
	ClearVar = "ClearVar",
	Decorators = "Decorators",
	Decorator = "Decorator",
	Decoration = "Decoration",
	Decorations = "Decorations",
	DecoratorContextEntity = "Decorator-context-entity",
	Document = "Document",
	DropDown = "DropDown",
	ElseIf = "ElseIf",
	Exists = "Exists",
	Field = "Field",
	Function = "Function",
	Group = "Group",
	Infoset = "Infoset",
	InfosetVariable = "InfosetVariable",
	Infosets = "Infosets",
	Input = "Input",
	Include = "Include",
	IncludeBlock = "Include-Block",
	ModelCondition = "ModelCondition",
	If = "If",
	In = "In",
	Module = "Module",
	NameSpace = "NameSpace",
	MainView = "MainView",
	MetaDataInitialize = "MetaDataInitialize",
	Rule = "Rule",
	Rules = "Rules",
	RuleTests = "RuleTests",
	RuleTestSets = "RuleTestSets",
	Output = "Output",
	Profile = "Profile",
	ProfileInclude = "ProfileInclude",
	RelationFilterInclude = "RelationFilterInclude",
	Search = "Search",
	SearchColumn = "SearchColumn",
	SetVar = "SetVar",
	Switch = "Switch",
	Target = "Target",
	TargetView = "TargetView",
	Type = "Type",
	TitleBar = "TitleBar",
	TypeFilter = "TypeFilter",
	Unknown = "Unknown",
	Variable = "Variable",
	View = "View",
	Views = "Views",
	SubView = "SubView",
	Style = "Style",
	Toolbar = "Toolbar",
	Tree = "Tree",
	Tab = "Tab",
	Button = "Button",
	Events = "Events",
	ServerEvent = "ServerEvent",
	ServerEvents = "IncludeBlockServerEvents",
	Event = "Event",
	Node = "Node",
	MenuItem = "MenuItem",
	ToolbarButton = "ToolbarButton",
	AppearanceClass = "AppearanceClass",

	// Premium types
	ModelingObject = "ModelingObject",
	ModelCode = "ModelCode",
	// Pseudo types 
	RuleContext = "RuleContext"
}

export enum ModelElementSubTypes {
	All = "All",
	
	BackendAction = "BackendAction",
	FrontendAction = "FrontendAction",
	
	InfosetAction = "InfosetAction",
	RuleAction = "RuleAction",

	Unknown = "Unknown",
	View_ObjectView = "ObjectView",
	View_ListView = "ListView",
	View_Tree = "TreeView",
	View_DataTree = "DataTreeView",
	View_Container = "ContainerView",
	View_HTML = "HTMLView",
	View_Organizer = "OrganizerView",
	View_MediaPlayer = "MediaPlayerView",
	View_AnnotationTool = "AnnotationToolView",
	View_Tabber = "TabberView",
	View_IFrame = "IFrameView",
	View_Empty = "EmptyView",

	Group_View = "ViewGroup",
	Group_Condition = "ConditionGroup",
	IncludeBlock_Module = "IncludeBlockModule",
	IncludeBlock_Type = "IncludeBlockType",
	IncludeBlock_Attribute = "IncludeBlockAttribute",
	IncludeBlock_ServerEvents = "IncludeBlockServerEvents",
	IncludeBlock_ServerEvent = "IncludeBlockServerEvent",
	IncludeBlock_Keys = "IncludeBlockKeys",
	IncludeBlock_Key = "IncludeBlockKey",
	IncludeBlock_Action = "IncludeBlockAction",
	IncludeBlock_Search = "IncludeBlockSearch",
	IncludeBlock_View = "IncludeBlockView",
	IncludeBlock_ObjectView = "IncludeBlockObjectView",
	IncludeBlock_ListView = "IncludeBlockListView",
	IncludeBlock_TreeView = "IncludeBlockTreeView",
	IncludeBlock_ViewContainer = "IncludeBlockViewContainer",
	IncludeBlock_Event = "IncludeBlockEvent",
	IncludeBlock_Events = "IncludeBlockEvents",
	IncludeBlock_Group = "IncludeBlockGroup",
	IncludeBlock_Button = "IncludeBlockButton",
	IncludeBlock_Rule = "IncludeBlockRule",
	IncludeBlock_SecurityProfile = "IncludeBlockSecurityProfile",
	IncludeBlock_If = "IncludeBlockIf",
	IncludeBlock_Then = "IncludeBlockThen",
	IncludeBlock_Else = "IncludeBlockElse",
	IncludeBlock_ElseIf = "IncludeBlockElseIf",
	IncludeBlock_Switch = "IncludeBlockSwitch",
	IncludeBlock_Case = "IncludeBlockCase",
	IncludeBlock_ToolbarButton = "IncludeBlockToolbarButton",
	IncludeBlock_Node = "IncludeBlockNode",
	IncludeBlock_Tab = "IncludeBlockTab",
	IncludeBlock_MenuItem = "IncludeBlockMenuItem",
	IncludeBlock_Tree = "IncludeBlockTree",

	ModelCondition_Attribute = "ModelConditionAttribute",
	ModelCondition_ServerEvents = "ModelConditionServerEvents",
	ModelCondition_ServerEvent = "ModelConditionServerEvent",
	ModelCondition_Type = "ModelConditionType",
	ModelCondition_Module = "ModelConditionModule",

	Target_View = "TargetView",
	Target_ObjectView = "TargetObjectView",
	Target_ListView = "TargetListView",
	Target_TreeView = "TargetTreeView",
	Target_ViewContainer = "TargetViewContainer",
	Target_Group = "TargetGroup",
	Target_Button = "TargetButton",
	Target_Attribute = "TargetAttribute",
	Target_Type = "TargetType",

	Events_Attribute = "AttributeEvents",
	Events_Action = "ActionEvents",
	Events_Button = "ButtonEvents",
	Events_Node = "NodeEvents",
	Events_Group = "GroupEvents",
	Events_Tab = "TabEvents",
	Events_MenuItem = "ButtonEvents",
	Events_ToolBarButton = "ToolBarButtonEvents",
	Events_View = "ViewEvents",

	Event_Attribute = "AttributeEvent",
	Event_Action = "ActionEvent",
	Event_Button = "ButtonEvent",
	Event_Node = "NodeEvent",
	Event_Group = "GroupEvent",
	Event_Tab = "TabEvent",
	Event_MenuItem = "ButtonEvent",
	Event_ToolBarButton = "ToolBarButtonEvent",
	Event_View = "ViewEvent",

	//Premium
	ModelingObject_Module = "ModelingObject_Module",
	ModelingObject_NonModule = "ModelingObject_NonModule",
	ModelCode_Module = "ModelCode_Module",
	ModelCode_NonModule = "ModelCode_NonModule"
}

export type ContextQualifiers = {
	isObsolete?: boolean;
	nameSpace?: string;
};

export enum ModelDetailLevel {
	Declarations,
	References,
	SubReferences,
	All
}

export enum ValidationLevels {
	None = "none",
	Info = "info",
	Warning = "warning",
	Error = "error",
	Fatal = "fatal"
}

export enum AttributeTypes {
	Enum = "enum",
	Reference = "reference",
	Numeric = "numeric",
	URL = "url",	// base-location = wwwroot
	Date = "date"
}

export enum AncestorTypes {
	Parent = "parent",
	GrandParent = "grand-parent"
}

export type Definitions = Record<string, Definition[]>

export type Definition = {
	description?: string,
	checkObsolete?: boolean,
	children: ChildDefinition[],
	attributes: ElementAttribute[],
	type?: ModelElementTypes,
	subtype?: ModelElementSubTypes,
	prefixNameSpace?: boolean,
	isSymbolDeclaration?: boolean,
	detailLevel?: ModelDetailLevel,
	matchCondition?: MatchDefinition,
	// isGroupingElement is used as a signal to the parser that the element can be skipped when looking for the parent (for example rule in a module within rules, module is a grouping element) 
	isGroupingElement?: boolean
}

// matchFunction and ancestor can be used to distinguish same tag definitions with different ModelElementTypes (for example action call output or rule output)
export type MatchDefinition = {
	matchFunction?: (nodeContext: IXmlNodeContext) => boolean,
	ancestors?: AncestorDefinition[],
}

/**
 * The IXmlNodeContext interface is the bare minimum required for the modelparser to find the correct
 * definitions using the matchCondition. The definition should stay small such that it remains easy
 * for other classes or context objects to provide the necessary information to find the correct definition.
 */
export interface IXmlNodeContext {
	getCurrentXmlNode: () => XmlNode;
	getParent: () => TreeNode | undefined;
	getAncestor: (level: number) => TreeNode | undefined;
	hasAncestorTag: (name: string) => boolean;
}

export type AncestorDefinition = {
	type: ModelElementTypes,
	subtypes?: ModelElementSubTypes[],
	ancestorType?: AncestorTypes // default parent
}

export type ChildDefinition = {
	element: string,
	occurence?: "once" | "at-least-once",
	required?: boolean,
	validations?: ChildValidation[],
	type?: ModelElementTypes,
	subtype?: ModelElementSubTypes,
	obsolete?: boolean,
	obsoleteMessage?: string
}

export type ChildReference = {
	matchElementFromAttribute?: string,
	matchSecondaryElementFromAttribute?: string,
	matchFromParent?: boolean,
}

export type ElementAttribute = {
	name: string,
	description?: string,
	validations?: AttributeValidation[],
	required?: boolean,
	autoadd?: boolean,						// mark attribute to auto add when (parent) element is created
	visibilityConditions?: ValidationMatches[],
	requiredConditions?: ValidationMatches[],
	types?: AttributeType[],
	detailLevel?: ModelDetailLevel,
	obsolete?: boolean,
	obsoleteMessage?: string
}

export type AttributeValidation = {
	type: "regex",
	value: RegExp,
	message: string,
	name?: string,
	identifier?: string,
	matches?: ValidationMatches[],
	level?: ValidationLevels,
	conditions?: ValidationMatches[]
}

export type ChildValidation = {
	identifier: string,
	name: string,
	message: string,
	matches: ValidationMatches[],
	level: ValidationLevels,
	conditions?: ValidationMatches[]
}

export type AttributeOption = {
	name: string,
	description?: string,
	default?: boolean,
	obsolete?: boolean
}

export type ValidationMatches = {
	operator?: "and" | "or",
	attribute: string,
	condition: "==" | "!=" | "misses" | "not-in" | "contains" | "not-in-like",
	value: string
}

export type AttributeType = {
	type: AttributeTypes,
	relatedTo?: ModelElementTypes,
	options?: AttributeOption[],
	pathHints?: AttributeOption[],
	default?: string,
	prefixNameSpace?: boolean
}