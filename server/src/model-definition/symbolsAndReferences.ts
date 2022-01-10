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
	DecoratorContextEntity = "Decorator-context-entity",
	Document = "Document",
	ElseIf = "ElseIf",
	Exists = "Exists",
	Field = "Field",
	Function = "Function",
	Group = "Group",
	Infoset = "Infoset",
	Input = "Input",
	IncludeBlock = "Include-Block",
	If = "If",
	In = "In",
	Module = "Module",
	NameSpace = "NameSpace",
	Rule = "Rule",
	Rules = "Rules",
	RuleContext = "RuleContext",
	Output = "Output",
	Profile = "Profile",
	Search = "Search",
	SearchColumn = "SearchColumn",
	SetVar = "SetVar",
	Switch = "Switch",
	Target = "Target",
	TargetView = "TargetView",	// this is not a list of elements of TargetViews, but a list of Views filled with attribute "TargetName"
	Type = "Type",
	TypeFilter = "TypeFilter",
	Unknown = "Unknown",
	Variable = "Variable",
	View = "View",
	Style = "Style",
	Toolbar = "Toolbar",
	Tree = "Tree",
	Button = "Button",
	Event = "Event",
	Events = "Events",
	Node = "Node",
	ToolbarButton = "ToolbarButton",
	Appearance = "Appearance",
	AppearanceClass = "AppearanceClass", // this could be a list of all classes from the scss files (it can be filtered by the type of mixin it's using)
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
	getFirstParent: () => XmlNode|undefined,
	getAncestor: (level: number) => XmlNode|undefined,
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
	range: LSP.Range,
	fullRange: LSP.Range,
	uri: string,
	isSymbolDeclaration: boolean,
	children: (TreeNode | SymbolDeclaration)[],
	attributes: Record<string, Attribute|Reference>,
	comment?: string,
	contextQualifiers: ContextQualifiers,
	parent?:TreeNode
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
	identifier: string
}


export function newReference(name: string, value: string, type: ModelElementTypes, range: LSP.Range, fullRange: LSP.Range, uri: string): Reference {
	return {
		name,
		value,
		type,
		range,
		fullRange,
		uri,
		isReference: true
	};
}

export function newTreeNode(tag: string, type: ModelElementTypes, range: LSP.Range, uri: string, comment?: string): TreeNode {
	return {
		type,
		tag,
		range,
		fullRange: LSP.Range.create(range.start, range.end),
		uri,
		children: [],
		attributes: {},
		contextQualifiers: {},
		comment,
		isSymbolDeclaration: false
	};
}
export function newSymbolDeclaration(name: string, tag: string, type: ModelElementTypes, range: LSP.Range, uri: string, comment?: string): SymbolDeclaration {
	return {
		name,
		type,
		tag,
		identifier: objectIdentifier(name, type, range),
		range,
		fullRange: LSP.Range.create(range.start, range.end),
		uri,
		children: [],
		attributes: {},
		contextQualifiers: {},
		comment,
		isSymbolDeclaration: true
	};
}

export function objectIdentifier(name: string, type: ModelElementTypes, range: LSP.Range) {
	return `${type}:${name}:${range.start.line}`;
}


export type Definitions = Record<string, Definition[]>

export type Definition = {
	name?: (x: any) => string,
	description?: string,
	checkObsolete?: boolean,
	childs?: ChildDefinition[] | ChildReference,
	attributes?: ElementAttribute[],
	type?: ModelElementTypes,
	prefixNameSpace?: boolean,
	isSymbolDeclaration?: boolean,
	detailLevel?: ModelDetailLevel,
	contextQualifiers?: (nodeContext: IXmlNodeContext) => ContextQualifiers
	// matchCondition and ancestor are used to distinguish same tag definitions with different ModelElementTypes (for example action call output or rule output)
	matchCondition?: (nodeContext: IXmlNodeContext) => boolean,
	ancestor?: string,
	// isGroupingElement is used as a signal to the parser that the element can be skipped when looking for the parent (for example rule in a module within rules, module is a grouping element) 
	isGroupingElement?: boolean
}

export type ChildDefinition = {
	element: string,
	occurence?: "once" | "at-least-once",
	required?: boolean,
	validations?: ChildValidation[],
	type?:ModelElementTypes,
	obsolete?: boolean,
	obsoleteMessage?: string
}

export type ChildReference = {
	matchElementFromAttribute?: string,
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