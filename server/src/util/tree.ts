import { Attribute, TreeNode } from '../model-definition/symbolsAndReferences';

export function walkTree(node: TreeNode, actionForNodes: (node: TreeNode) => void, actionForAttributes: (attribute: Attribute) => void) {
	actionForNodes(node);
	node.children.forEach(x => walkTree(x, actionForNodes, actionForAttributes));
	Object.values(node.attributes).forEach(x => actionForAttributes(x));
}
