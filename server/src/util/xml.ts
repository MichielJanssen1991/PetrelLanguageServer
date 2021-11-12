import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position } from 'vscode-languageserver-types';
const MAXLINESIZE = 500;

export function getContextFromLine(textDocument: TextDocument, pos: Position) {
	const lineText = textDocument.getText({
		start: { line: pos.line, character: 0 },
		end: { line: pos.line, character: MAXLINESIZE }
	});
	const lineTextBeforeCurrentPoint = lineText.slice(0, pos.character);
	const countNumberOfOpeningParenthesis = lineTextBeforeCurrentPoint.split("\"").length - 1;
	const inAttribute = countNumberOfOpeningParenthesis % 2 === 1;
	
	let tag = "";
	if(lineTextBeforeCurrentPoint.includes("<") && !lineTextBeforeCurrentPoint.includes(">")){
		tag = lineTextBeforeCurrentPoint.split("<")[1].split(" ")[0];
	}

	return { inAttribute, tag };
}

export function wordAtPoint(textDocument: TextDocument, pos: Position):string {
	const lineText = textDocument.getText({
		start: { line: pos.line, character: 0 },
		end: { line: pos.line, character: MAXLINESIZE }
	});

	const words = lineText.split(new RegExp("[^\\w-.]"));
	const word = words.reduce((result: any, item: string, index: number) => {
		if (result.pos <= pos.character) {
			result.pos += item.length + 1;
			result.word = item;
		}
		return result;
	}, { pos: 0, word: "" }).word;
	return word;
}