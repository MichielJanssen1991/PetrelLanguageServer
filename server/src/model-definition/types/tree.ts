import * as LSP from 'vscode-languageserver';
import { ContextQualifiers, ModelElementSubTypes, ModelElementTypes } from './definitions';

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