import { Range } from 'vscode-languageserver-types';
import { TreeNode } from '../model-definition/symbolsAndReferences';

export function printTree(tree: TreeNode, tab = 0) {
	const tabs = "  ".repeat(tab);
	console.log(`${tabs}${tree.tag}:${tree.type} range: ${formatRange(tree.range)} fullRange: ${formatRange(tree.fullRange)}`);
	tree.children.forEach(child => printTree(child, tab + 1));
}

export function formatRange(range: Range) {
	return `${range.start.line},${range.start.character}-${range.end.line},${range.end.character}`;
}