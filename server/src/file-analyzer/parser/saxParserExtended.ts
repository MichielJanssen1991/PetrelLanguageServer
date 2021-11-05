import * as LSP from 'vscode-languageserver';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sax = require("../../../node_modules/sax/lib/sax");

// Define the interface for the parser from the sax module
export interface ISaxParser {
	onerror: any,
	ontext: any,
	onend: any,
	onopentag: any,
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


// Extend with own functionality used for parsing model xml
export interface ISaxParserExtended extends ISaxParser {
	uri: string,
	getFirstParent: () => any,
	hasParentTag: (name: string) => boolean
	findParent: (predicate: (n: any) => boolean) => any | null,
	getRange: () => LSP.Range;
}


export function newSaxParserExtended(
	onerror: ((e: any, parser: ISaxParserExtended) => void),
	onopentag: ((node: any, parser: ISaxParserExtended) => void),
	onclosetag: (() => void)
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

	parser.onclosetag = function () {
		onclosetag();
	};

	parser.getFirstParent = function () {
		const parentNodeStack = this.tags;
		return parentNodeStack[parentNodeStack.length - 2];
	};

	parser.hasParentTag = function (name: string) {
		const parentTagNames = this.tags.find((x: { name: string; }) => x.name == name);
		return parentTagNames != undefined;
	};

	parser.getRange = function () {
		return LSP.Range.create(
			this.line,
			Math.max(this.column + this.startTagPosition - this.position, 0),
			this.line,
			this.column,
		);
	};

	parser.findParent = function (predicate) {
		const parentNodeStack = this.tags;
		let index = parentNodeStack.length - 1;
		while (index >= 0) {
			const node = parentNodeStack[index];
			if (predicate(node)) {
				return node;
			}
			index = index - 1;
		}
		return null;
	};

	return parser;
}