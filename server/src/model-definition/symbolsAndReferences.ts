import * as LSP from 'vscode-languageserver';
import { Position } from 'vscode-languageserver';

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
	name: any,
	type: ModelElementTypes,
	identifier: string,
	range: LSP.Range,
	uri: string,
	objectType: ObjectIdentifierTypes,
	rangeExtended: LSP.Range
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

export function newReference(name: any, type: ModelElementTypes, range: LSP.Range, uri: string): Reference {
	return {
		name,
		type,
		identifier: objectIdentifier(name, type, range),
		range,
		get rangeExtended() {
			return extendedRange(this) ;
		},
		children: [],
		uri,
		otherAttributes: {},
		attributeReferences: {},
		contextQualifiers: {},
		objectType: ObjectIdentifierTypes.Reference
	};
}

export function newSymbolDeclaration(name: any, type: ModelElementTypes, range: LSP.Range, uri: string, isObsolete: boolean, comment?: string): SymbolDeclaration {
	return {
		name,
		type,
		identifier: objectIdentifier(name, type, range),
		range,
		get rangeExtended() {
			return extendedRange(this) ;
		},
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

function extendedRange(object: ObjectIdentifier): LSP.Range {
	const startPosition: Position = (object.range.start);
	const endPosition: Position = object.children.reduce((currentEnd, child) => {
		const childEnd = child.range.end;
		const childEndIsAfterCurrentEnd = childEnd.line > currentEnd.line || (childEnd.line >= currentEnd.line && childEnd.character > currentEnd.character);
		return childEndIsAfterCurrentEnd ? childEnd : currentEnd;
	}, object.range.end);
	return { start: startPosition, end: endPosition };
}