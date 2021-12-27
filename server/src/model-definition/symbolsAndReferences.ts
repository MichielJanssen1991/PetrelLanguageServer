import * as LSP from 'vscode-languageserver';
import { XmlNode } from '../file-analyzer/parser/saxParserExtended';

export enum ModelElementTypes {
	Infoset = "Infoset",
	Variable = "Variable",
	Constant = "Constant",
	Condition = "Condition",
	Rule = "Rule",
	RuleContext = "RuleContext",
	NameSpace = "NameSpace",
	Input = "Input",
	Action = "Action",
	ActionCall = "ActionCall",
	Function = "Function",
	Type = "Type",
	View = "View",
	Attribute = "Attribute",
	Output = "Output",
	Search = "Search",
	Count = "Count",
	Exists = "Exists",
	Aggregate = "Aggregate",
	SearchColumn = "SearchColumn",
	TypeFilter = "TypeFilter",
	IncludeBlock = "Include-Block",
	Decorator = "Decorator",
	DecoratorContextEntity = "Decorator-context-entity",
	Target = "Target",
	Argument = "Argument",
	Profile = "Profile",
	Unknown = "Unknown",
	SetVar = "SetVar",
	ClearVar = "ClearVar",
	If = "If",
	ElseIf = "ElseIf",
	Group = "Group",
	All = "All",
	Module = "Module",
	Decorators = "Decorators",
	In = "In",
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
	Numeric = "numeric"
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
	getFirstParent: () => any,
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
	otherAttributes: Record<string, Attribute>,
	attributeReferences: Record<string, Reference>,
	comment?: string,
	contextQualifiers: ContextQualifiers
}

export interface Attribute {
	name: string,
	range: LSP.Range,
	fullRange: LSP.Range,
	value: string,
	isReference?: boolean
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


export function newReference(name: string, value: string, type: ModelElementTypes, range: LSP.Range, uri: string): Reference {
	return {
		name,
		value,
		type,
		range,
		fullRange: LSP.Range.create(range.start, range.end),
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
		otherAttributes: {},
		contextQualifiers: {},
		comment,
		attributeReferences: {},
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
		otherAttributes: {},
		contextQualifiers: {},
		comment,
		attributeReferences: {},
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
	attributes?: ElementAttributes[],
	childs?: ChildDefinition[] | ChildReference,
	parent?: any,
	matchCondition?: (nodeContext: IXmlNodeContext) => boolean,
	type?: ModelElementTypes,
	prefixNameSpace?: boolean,
	isSymbolDeclaration?: boolean,
	detailLevel?: ModelDetailLevel,
	contextQualifiers?: (nodeContext: IXmlNodeContext) => ContextQualifiers
}

export type ChildDefinition = {
	element: string,
	occurence?: "once" | "at-least-once",
	required?: boolean,
	validations?: ChildValidation[]
}

export type ChildReference = {
	matchElementFromAttribute?: string,
	matchFromParent?: boolean,
}

export type ElementAttributes = {
	name: string,
	description?: string,
	validations?: AttributeValidation[],
	required?: boolean,
	autoadd?: boolean,						// mark attribute to auto add when (parent) element is created
	deprecated?: boolean,
	visibilityConditions?: ValidationMatches[],
	requiredConditions?: ValidationMatches[],
	type?: AttributeType,
	detailLevel?: ModelDetailLevel
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
	default?: boolean
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
	pathHints?: AttributeOption[]

}