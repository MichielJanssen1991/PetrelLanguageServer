import * as LSP from 'vscode-languageserver';
import { XmlNode } from '../file-analyzer/parser/saxParserExtended';

export enum ModelElementTypes {
	Infoset = "Infoset",
	Condition = "Condition",
	Rule = "Rule",
	NameSpace = "NameSpace",
	Input = "Input",
	Action = "Action",
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
	IncludeBlock = "IncludeBlock",
	Decorator = "Decorator",
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
	Reference = "reference"
}

export type ContextQualifiers = {
	isObsolete?: boolean,
	frontendOrBackend?: "Frontend" | "Backend",
	nameSpace?: string
}

export interface INodeContext {
	getCurrentNode: () => XmlNode
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

export interface ObjectIdentifier {
	name: string,
	tag: string,
	type: ModelElementTypes,
	identifier: string,
	range: LSP.Range,
	fullRange: LSP.Range,
	uri: string,
	objectType: IsSymbolOrReference,
	children: (Reference | SymbolDeclaration)[],
	otherAttributes: Record<string, Attribute>,
	attributeReferences: Record<string, Reference>,
	comment?: string,
	contextQualifiers: ContextQualifiers
}

export interface Reference extends ObjectIdentifier {
	objectType: IsSymbolOrReference.Reference
}

export interface SymbolDeclaration extends ObjectIdentifier {
	objectType: IsSymbolOrReference.Symbol
}

export interface Attribute {
	name: string,
	range: LSP.Range,
	fullRange: LSP.Range,
	value: string | number | boolean
}

export type SymbolOrReference = SymbolDeclaration | Reference;

export function newReference(name: string, tag: string, type: ModelElementTypes, range: LSP.Range, uri: string, comment?: string): Reference {
	return {
		name,
		tag,
		type,
		identifier: objectIdentifier(name, type, range),
		range,
		fullRange: LSP.Range.create(range.start, range.end),
		children: [],
		uri,
		otherAttributes: {},
		attributeReferences: {},
		contextQualifiers: {},
		comment,
		objectType: IsSymbolOrReference.Reference
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
		objectType: IsSymbolOrReference.Symbol
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
	childs?: ChildDefinition[],
	parent?: any,
	matchCondition?: (nodeContext: INodeContext) => boolean,
	type?: ModelElementTypes,
	prefixNameSpace?: boolean,
	isReference?: boolean,
	detailLevel?: ModelDetailLevel,
	contextQualifiers?: (nodeContext: INodeContext) => ContextQualifiers

}

export type ChildDefinition = {
	element: string,
	occurence?: "once" | "at-least-once",
	required?: boolean,
	validations?: ChildValidation[]
}

export type ElementAttributes = {
	name: string,
	description?: string,
	validations?: AttributeValidation[],
	required?: boolean,
	autoadd?: boolean,						// mark attribute to auto add when (parent) element is created
	deprecated?: boolean,
	conditions?: ValidationMatches[],
	type?: AttributeType,
	detailLevel?: ModelDetailLevel
}

export type AttributeValidation = {
	type: string,
	value: string,
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
	value: string | JsonElementVariable
}

export type AttributeType = {
	type: AttributeTypes,
	relatedTo?: ModelElementTypes,
	options?: AttributeOption[],
	pathHints?: AttributeOption[]

}

/**
 * This class handles the variable Json attributes from the definitions. 
 * Based on the file-reference, child-reference and it's attribute (optional) it gets the proper data
 * 
 * NOTE I'm not sure if the definition data (in cache) is an XML object or JSON object.
 */
export class JsonElementVariable {
	constructor(definitionReference: string, xpathExpr: string) {
		let definition = "";
		switch (definitionReference) {
			case "backend-actions":
				// get backend.actions.xml definition(s)
				definition = "<xml />";
				break;
			case "frontend-actions":
				// get frontend.actions.xml definition(s)
				definition = "<xml />";
				break;
			case "rule-definitions":
				// not yet implemnted
				break;
			case "type-definitions":
				// not yet implemnted
				break;
		}
		xpathExpr = "//action" + xpathExpr;
		//return definition.evaluate("/html/body//h2", definition, null, XPathResult.ANY_TYPE, null).toString();
		return "";
	}
}