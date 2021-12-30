import { Range, Position } from 'vscode-languageserver';

export function pointIsInRange(range: Range, pos: Position): boolean {
	const { line, character } = pos;
	const startRangeBeforePoint = (range.start.line < line || (range.start.line <= line && range.start.character < character));
	const endRangeAfterPoint = (range.end.line > line || (range.end.line >= line && range.end.character > character));
	return startRangeBeforePoint && endRangeAfterPoint;
}

//Returns true when the value is a variable: "{variableName}"
export function attributeValueIsAVariable(value: string)
{
	return value.startsWith("{"); 
}