import * as LSP from 'vscode-languageserver';
import { BACKEND_DEFINITION } from './definitions/backend';

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
	children: (Reference | SymbolDeclaration)[]
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

export function newReference(name: string, tag: string, type: ModelElementTypes, range: LSP.Range, uri: string): Reference {
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
		fullRange: LSP.Range.create(range.start, range.end),
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
	attributeReferences?: AttributeReferenceDefinition[],
}

export interface AttributeReferenceDefinition {
	type: ModelElementTypes,
	detailLevel: ModelDetailLevel,
	attribute: string,
}

export type NewDefinition = {
	element: string,
	description?: string,
	checkObsolete?: boolean,
	attributes?: ElementAttributes[],
	childs?: ChildDefinition[],
	parent?: any,
	types?: string[]
}

export type ChildDefinition = {
	element: string,
	occurence?: "once"|"at-least-once",
	validations?:ChildValidation[]
}

export type ElementAttributes = {
	name: string,
	description?: string,
	validations?: AttributeValidation[],
	required?: boolean,
	types?: AttributeType[],
	relatedto?: string,
	conditions?: any
}

export type AttributeValidation = {
	type: string,
	value: string,
	message: string,
	name?: string,
	identifier?: string,
	matches?: ValidationMatches[],
	level?: "none"|"info"|"warning"|"error"|"fatal",
	conditions?: any
}

export type ChildValidation = {
	identifier: string,
	name: string,
	message: string,
	matches: ValidationMatches[],
	level: "none"|"info"|"warning"|"error"|"fatal",
	conditions?: ValidationMatches[]
}

export type AttributeOption = {
	name: string,
	description?: string,
}

export type ValidationMatches = {
	operator?: "and"|"or",
	attribute: string,
	condition: "=="|"!="|"misses"|"not-in"|"contains"|"not-in-like",
	value: string|JsonElementVariable
}

export type AttributeType = {
	type: string,
	namespaced?: boolean,
	relatedTo?: string,
	options?: AttributeOption[],
	pathHints? : AttributeOption[]
		
}

/**
 * This class handles the variable Json attributes from the definitions. 
 * Based on the file-reference, child-reference and it's attribute (optional) it gets the proper data
 * 
 * NOTE I'm not sure if the definition data (in cache) is an XML object or JSON object.
 */
 export class JsonElementVariable {
	constructor(definitionReference:string, xpathExpr: string){
		var definition = "";
		switch(definitionReference){
			case "backend-actions":
				// get backend.actions.xml definition(s)
				definition = "<xml />"
				break;
			case "frontend-actions":
				// get frontend.actions.xml definition(s)
				definition = "<xml />"
				break;
			case "rule-definitions":
				// not yet implemnted
				break;
			case "type-definitions":
				// not yet implemnted
				break;
		}
		xpathExpr = "//action"+xpathExpr;
		//return definition.evaluate("/html/body//h2", definition, null, XPathResult.ANY_TYPE, null).toString();
		return "";
	}
}