import * as LSP from 'vscode-languageserver';
import { XmlNode } from '../file-analyzer/parser/saxParserExtended';

export enum ModelElementTypes {
	Action = "Action",
	ActionCall = "ActionCall",
	ActionCallOutput = "ActionCallOutput",
	Aggregate = "Aggregate",
	All = "All",
	Argument = "Argument",
	Attribute = "Attribute",
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
	Output = "Output",
	Profile = "Profile",
	Search = "Search",
	SearchColumn = "SearchColumn",
	SetVar = "SetVar",
	Switch = "Switch",
	Target = "Target",
	TargetView = "TargetView",	// this is not a list of elements of TargetViews, but a list of Views filled with attribute "TargetName"
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
	Appearance = "Appearance",
	AppearanceClass = "AppearanceClass", // this could be a list of all classes from the scss files (it can be filtered by the type of mixin it's using)
	// Pseudo types 
	RuleContext = "RuleContext",
}

export enum ModelElementSubTypes {
	All = "All",
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
	IncludeBlock_Group = "IncludeBlockGroup",
	IncludeBlock_Button = "IncludeBlockButton",
	IncludeBlock_Rule = "IncludeBlockRule",
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

export type ContextQualifiers = {
	isObsolete?: boolean,
	frontendOrBackend?: "Frontend" | "Backend",
	nameSpace?: string
}

/**
 * The IXmlNodeContext interface is the bare minimum required for the modelparser to find the correct 
 * definitions using the matchCondition. The definition should stay small such that it remains easy 
 * for other classes or context objects to provide the necessary information to find the correct definition. 
 */
export interface IXmlNodeContext {
	getCurrentXmlNode: () => XmlNode
	getParent: () => TreeNode | undefined,
	getAncestor: (level: number) => TreeNode | undefined,
	hasParentTag: (name: string) => boolean
}

export enum IsSymbolOrReference {
	Symbol,
	Reference
}

export enum ModelDetailLevel {
	Declarations,
	References,
	SubReferences,
	All
}

export interface TreeNode {
	tag: string,
	type: ModelElementTypes,
	subtype?: ModelElementSubTypes,
	range: LSP.Range,
	fullRange: LSP.Range,
	uri: string,
	isSymbolDeclaration: boolean,
	children: (TreeNode | SymbolDeclaration)[],
	attributes: Record<string, Attribute | Reference>,
	comment?: string,
	contextQualifiers: ContextQualifiers,
	parent?: TreeNode
}

export interface Attribute {
	name: string,
	range: LSP.Range,
	fullRange: LSP.Range,
	value: string,
	isReference?: boolean,
	type?: ModelElementTypes
}
export interface Reference extends Attribute {
	isReference: true,
	type: ModelElementTypes,
	uri: string
}

export interface SymbolDeclaration extends TreeNode {
	isSymbolDeclaration: true,
	name: string,
}

export function newReference(name: string, value: string, type: ModelElementTypes, range: LSP.Range, fullRange: LSP.Range, uri: string): Reference {
	return {
		name,
		value,
		type,
		range: {start: {...range.start}, end: {...range.end}},//Make copy
		fullRange: {start: {...fullRange.start}, end: {...fullRange.end}},//Make copy
		uri,
		isReference: true
	};
}

export function newTreeNode(tag: string, type: ModelElementTypes, range: LSP.Range, uri: string, subtype?: ModelElementSubTypes): TreeNode {
	return {
		type,
		subtype,
		tag,
		range: {start: {...range.start}, end: {...range.end}},//Make copy
		fullRange: {start: {...range.start}, end: {...range.end}},//Make copy
		uri,
		children: [],
		attributes: {},
		contextQualifiers: {},
		isSymbolDeclaration: false
	};
}
export function newSymbolDeclaration(name: string, tag: string, type: ModelElementTypes, range: LSP.Range, uri: string, subtype?: ModelElementSubTypes): SymbolDeclaration {
	return {
		name,
		type,
		subtype,
		tag,
		range: {start: {...range.start}, end: {...range.end}},
		fullRange: {start: {...range.start}, end: {...range.end}},
		uri,
		children: [],
		attributes: {},
		contextQualifiers: {},
		isSymbolDeclaration: true
	};
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
	contextQualifiers?: (nodeContext: IXmlNodeContext) => ContextQualifiers
	// matchCondition and ancestor are used to distinguish same tag definitions with different ModelElementTypes (for example action call output or rule output)
	matchCondition?: (nodeContext: IXmlNodeContext) => boolean,
	ancestors?: { type: ModelElementTypes, subtypes?: ModelElementSubTypes[] }[],
	// isGroupingElement is used as a signal to the parser that the element can be skipped when looking for the parent (for example rule in a module within rules, module is a grouping element) 
	isGroupingElement?: boolean
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
	type?: AttributeType,
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
	default?: string
}