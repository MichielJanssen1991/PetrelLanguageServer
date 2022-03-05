import { Range } from 'vscode-languageserver-types';
import { TreeNode } from '../model-definition/types/tree';

/**
 * printTree: Prints the inputted tree to the console. Prints up to a maximum depth of 3. Mainly used for debugging purposes
 * @tree: The tree to print
 */
export function printTree(tree: TreeNode) {
	const maxDepth = 3;
	printNode(tree, 0 , maxDepth);
}

export function printNode(node: TreeNode, tab:number, maxDepth:number) {
	const tabs = "  ".repeat(tab);
	console.log(`${tabs}${node.tag}:${node.type} range: ${formatRange(node.range)} fullRange: ${formatRange(node.fullRange)}`);
	if ( tab<= maxDepth){
		node.children.forEach(child => printNode(child, tab + 1, maxDepth));
	}else{
		if(node.children.length>0){console.log(`${tabs}...`);}
	}
}

export function formatRange(range: Range) {
	return `${range.start.line},${range.start.character}-${range.end.line},${range.end.character}`;
}