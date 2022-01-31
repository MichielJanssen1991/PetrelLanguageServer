import * as LSP from 'vscode-languageserver';
import { ModelElementSubTypes, ModelElementTypes } from '../../model-definition/symbolsAndReferences';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sax = require("../../../node_modules/sax/lib/sax");

// Define the interface for the parser from the sax module
export interface ISaxParser {
	onprocessinginstruction: any,
	onerror: any,
	ontext: any,
	onend: any,
	onopentag: any,
	onattribute: any,
	onclosetag: any,
	write: any,
	close: any,
	error: any,
	resume: any,
	tag: any,
	line: number,
	column: number,
	startTagPosition: number,
	position: number,
	tags: any,
}

export type ProcessingInstruction = {
	name: string,
	body: string
}

export type XmlNode = {
	name: string
	attributes: Record<string, string>
	type: ModelElementTypes,
	subtype?: ModelElementSubTypes
}


// Extend with own functionality used for parsing model xml
export interface ISaxParserExtended extends ISaxParser {
	uri: string,
	getParent: () => XmlNode|undefined,
	getAncestor: (level: number) => XmlNode|undefined,
	hasParentTag: (name: string) => boolean,
	getCurrentXmlNode: () => XmlNode,
	getTagRange: () => LSP.Range;
	getAttributeRange: (attribute: { name: string, value: string }) => LSP.Range;
	getAttributeValueRange: (attribute: { name: string, value: string }) => LSP.Range;
	enrichTagWithType: (type: ModelElementTypes, subtype?:ModelElementSubTypes) => void;
}


export function newSaxParserExtended(
	onerror: ((e: any, parser: ISaxParserExtended) => void),
	onopentag: ((node: any, parser: ISaxParserExtended) => void),
	onattribute: ((node: any, parser: ISaxParserExtended) => void),
	onclosetag: (() => void),
	onprocessinginstruction: ((instruction: ProcessingInstruction) => void)
): ISaxParserExtended {
	const parser = sax.parser(true) as ISaxParserExtended;

	parser.onerror = function (error: any) {
		onerror(error, this);
		this.error = null;
		this.resume();
	};

	parser.onopentag = function (node: any) {
		onopentag(node, this);
	};

	parser.onattribute = function (node: any) {
		onattribute(node, this);
	};

	parser.onclosetag = function () {
		onclosetag();
	};

	parser.onprocessinginstruction = function (instruction: ProcessingInstruction) {
		onprocessinginstruction(instruction);
	};

	parser.getParent = function () {
		return this.getAncestor(1);
	};
	
	parser.getAncestor = function (level: number) {
		const parentNodeStack = this.tags;
		return parentNodeStack[parentNodeStack.length - 1 - level];
	};

	parser.getCurrentXmlNode = function () {
		return this.tag;
	};

	parser.hasParentTag = function (name: string) {
		const parentTagNames = this.tags.find((x: { name: string; }) => x.name == name);
		return parentTagNames != undefined;
	};

	parser.getTagRange = function () {
		return LSP.Range.create(
			this.line,
			Math.max(this.column + this.startTagPosition - this.position, 0),
			this.line,
			this.column,
		);
	};

	parser.getAttributeRange = function (attribute) {
		//Assumes there are no spaces between attribute name, the '=' sign and the value
		const equalSignAndTwoQuotesLength = 3;
		const attributeLength = attribute.name.length + attribute.value.length + equalSignAndTwoQuotesLength;
		return LSP.Range.create(
			this.line,
			Math.max(this.column - attributeLength, 0),
			this.line,
			this.column,
		);
	};

	parser.getAttributeValueRange = function (attribute) {
		const twoQuotesLength = 2;
		const attributeValueLength = attribute.value.length + twoQuotesLength;
		return LSP.Range.create(
			this.line,
			Math.max(this.column - attributeValueLength, 0),
			this.line,
			this.column,
		);
	};

	parser.enrichTagWithType = function (type:ModelElementTypes, subtype?:ModelElementSubTypes) {
		this.tag.type = type; 
		this.tag.subtype = subtype;
	};

	return parser;
}