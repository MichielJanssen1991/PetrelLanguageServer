import { Range, Position } from 'vscode-languageserver';

export function positionIsGreaterThan(pos1: Position, pos2: Position): boolean {
	const { line: line1, character: character1 } = pos1;
	const { line: line2, character: character2 } = pos2;
	return (line2 < line1 || (line2 <= line1 && character2 < character1));
}

export function positionEquals(pos1: Position, pos2: Position): boolean {
	const { line: line1, character: character1 } = pos1;
	const { line: line2, character: character2 } = pos2;
	return (line2 == line1 && character2 == character1);
}

export function pointIsInRange(pos: Position, range: Range): boolean {
	const pointAfterStartRange = positionIsGreaterThan(pos, range.start);
	const endRangeAfterPoint = positionIsGreaterThan(range.end, pos);
	return pointAfterStartRange && endRangeAfterPoint;
}

export function rangeIsInRange(range1: Range, range2: Range): boolean {
	return pointIsInRange(range1.start, range2) && pointIsInRange(range1.end, range2);
}

export function rangeIsRange(range1: Range, range2: Range): boolean {
	return positionEquals(range1.start, range2.start) && positionEquals(range1.end, range2.end);
}

//Returns true when the value is a variable: "{variableName}"
export function attributeValueIsAVariable(value: string) {
	return /^\{.+\}$/.test(value);
}

//Returns true when the name is namespaced (contains a .)
export function nameHasNamespace(name: string) {
	return name.includes(".");
}

//Returns true when the name is namespaced (contains a .)
export function removeNameSpace(name: string) {
	return nameHasNamespace(name) ? name.split(".").pop() as string : name;
}