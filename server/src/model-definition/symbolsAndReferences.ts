import * as LSP from 'vscode-languageserver';

export enum ModelElementTypes {
	Infoset = "Infoset",
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
	Profile = "Profile",
	Unknown = "Unknown",
	All = "All",
}

export type ContextQualifiers = {
	isObsolete?: boolean,
	frontendOrBackend?: "Frontend" | "Backend",
	nameSpace?: string
}

export interface INodeContext {
	getFirstParent: () => any,
	hasParentTag: (name: string) => boolean
	findParent: (predicate: (n: any) => boolean) => any | null,
	getRange: () => LSP.Range;
}

export enum ObjectIdentifierTypes {
	Symbol,
	Reference
}

export enum ModelDetailLevel {
	Declarations,
	References,
	ArgumentReferences
}

export interface ObjectIdentifier {
	name: string,
	tag: string,
	type: ModelElementTypes,
	identifier: string,
	range: LSP.Range,
	fullRange: LSP.Range,
	uri: string,
	objectType: ObjectIdentifierTypes,
	children: (Reference|SymbolDeclaration)[]
}

export interface Reference extends ObjectIdentifier {
	otherAttributes: Record<string, string | boolean | number>,
	attributeReferences: Record<string, Reference>
	contextQualifiers: ContextQualifiers
}

export interface SymbolDeclaration extends ObjectIdentifier {
	otherAttributes: Record<string, string | boolean | number>,
	comment?: string,
	isObsolete: boolean,
	attributeReferences: Record<string, Reference>
	contextQualifiers: ContextQualifiers
}

export type SymbolOrReference = SymbolDeclaration | Reference;

export function newReference(name: string, tag:string, type: ModelElementTypes, range: LSP.Range, uri: string): Reference {
	return {
		name,
		tag,
		type,
		identifier: objectIdentifier(name, type, range),
		range,
		fullRange:range,
		children: [],
		uri,
		otherAttributes: {},
		attributeReferences: {},
		contextQualifiers: {},
		objectType: ObjectIdentifierTypes.Reference
	};
}

export function newSymbolDeclaration(name: string, tag: string, type: ModelElementTypes, range: LSP.Range, uri: string, isObsolete: boolean, comment?: string): SymbolDeclaration {
	return {
		name,
		type,
		tag,
		identifier: objectIdentifier(name, type, range),
		range,
		fullRange:range,
		uri,
		children: [],
		otherAttributes: {},
		contextQualifiers: {},
		isObsolete,
		comment,
		attributeReferences: {},
		objectType: ObjectIdentifierTypes.Symbol
	};
}
export function objectIdentifier(name: string, type: ModelElementTypes, range: LSP.Range) {
	return `${type}:${name}:${range.start.line}`;
}

export interface Definition {
	name?: (x: any) => string,
	matchCondition?: (x: any, nodeContext: INodeContext) => boolean,
	type: ModelElementTypes,
	prefixNameSpace?: boolean,
	otherAttributes?: Record<string, (x: any, nodeContext: INodeContext) => string | boolean | number>,
	contextQualifiers?: (x: any, nodeContext: INodeContext) => ContextQualifiers,
	detailLevel: ModelDetailLevel
	attributeReferences?: ModelAttributeReferenceDefinition[],
}

export interface ModelAttributeReferenceDefinition {
	type: ModelElementTypes,
	detailLevel: ModelDetailLevel,
	attribute: string,
}

export type NewDefinition = {
	element: string,
	description?: string,
	attributes?: ElementAttributes[],
	childs?: ChildDefinition[],
	parent?: any,
	type?:string,
	types?:string[]
}

export type ChildDefinition = {
	element:string,
	occurence?: "once",
}

export type ElementAttributes = {
	name:string,
	description?: string,
	validation?: AttributeValidation,
	required?: boolean,
	type?:AttributeType,
	types?:AttributeType[],
	options?:any,
	relatedto?:string,
	conditions?:any
}

export type AttributeValidation = {
	type:string,
	value: string,
	message: string
}

export type AttributeType = any