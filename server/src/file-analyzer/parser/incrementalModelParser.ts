import { Range } from 'vscode-languageserver';
import { ModelDefinitionManager, ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { ModelDetailLevel, ModelElementTypes } from '../../model-definition/types/definitions';
import { Attribute, TreeNode } from '../../model-definition/types/tree';
import { positionIsGreaterThan, rangeIsInRange, rangeIsRange } from '../../util/other';
// import { printTree } from '../../util/print';
import { IncrementalParser } from './fileParser';
import { ModelParser } from './modelParser';

enum IncrementalModelParserState {
	Parent,
	Before,
	Is,
	After
}
export class IncrementalModelParser extends ModelParser implements IncrementalParser {
	private newRange: Range = Range.create(0, 0, 0, 0);
	private oldRange: Range = Range.create(0, 0, 0, 0);
	private newContent = "";

	constructor(uri: string, detailLevel: ModelDetailLevel, modelDefinitionManager: ModelDefinitionManager) {
		super(uri, detailLevel, modelDefinitionManager);
	}

	public updateFile(oldRange: Range, newRange: Range, contents: string) {
		// this.logStartUpdateFile(contents);

		this.newContent = contents;
		this.newRange = newRange;
		this.oldRange = oldRange;
		this.walknodes(this.results.tree);

		// this.logFinishUpdateFile();
		return this.results;
	}

	public walknodes(node: TreeNode) {
		// A node can be before/after/in the to be reparsed part of code. 
		// Furthermore nodes before the part to be reparsed can be relevant parents or siblings
		// The parents are used to initialize the object stack used in parsing the part to be reparsed
		switch (this.determineStateForNode(node)) {
			case IncrementalModelParserState.Before:
				//No action needed
				break;
			case IncrementalModelParserState.Parent:
				this.processParentNode(node);
				break;
			case IncrementalModelParserState.Is:
				this.processNodeToBeReparsed(node);
				break;
			case IncrementalModelParserState.After:
				this.processNodeAfterReparsedPart(node);
				break;
		}
	}

	private processParentNode(node: TreeNode) {
		//Build context using parsed object stack
		const definition = this.modelDefinitionManager.getModelDefinitionForTreeNode(this.results.modelFileContext || ModelFileContext.Unknown, node);
		this.pushToParsedObjectStack(node, definition);
		//Process children
		node.children.forEach(child => this.walknodes(child));
		//Clear stack
		this.popParsedObjectStack();
		//Translate node ranges of this node (end of fullrange should be moved)
		this.translateNodeRangesParentsOfReparsedPart(node);
	}

	private processNodeToBeReparsed(node: TreeNode) {
		const parent = node.parent;
		if (parent) {
			const indexInParent = parent.children.findIndex(n => n == node);
			const siblingsAfterNode = parent.children.splice(indexInParent + 1);//Removes siblings after node and returns
			parent.children.pop(); //Remove to be reparsed node itself 

			//Reparse node which will add it to the parent again (top node in parsed object stack)
			this.parseFile(this.newContent);

			//Translate the new node (as the parseFile only parsed a small piece of code it needs to be translated)
			this.translateNodeRangesForReparsedPart(parent.children[indexInParent]);

			//Again add the siblings coming after the reparsed node
			siblingsAfterNode.forEach(sibling => parent.children.push(sibling));
		} else {
			//Should never occur
			throw("Incremental parsing is not implemented for complete document. In this case reparsing should happen using the non-incremental parsing.");
		}
	}

	private processNodeAfterReparsedPart(node: TreeNode) {
		const lines = this.newRange.end.line - this.oldRange.end.line;
		this.translateNodeAndAttributesVertically(node, lines);
		node.children.forEach(child => this.processNodeAfterReparsedPart(child));
	}

	private determineStateForNode(node: TreeNode) {
		const nodeIsRange = rangeIsRange(this.oldRange, node.fullRange);
		if (nodeIsRange) {
			return IncrementalModelParserState.Is;
		}

		const nodeIsParent = rangeIsInRange(this.oldRange, node.fullRange);
		if (nodeIsParent || node.type == ModelElementTypes.Document) {
			return IncrementalModelParserState.Parent;
		}

		const nodeIsBeforeRange = positionIsGreaterThan(this.oldRange.start, node.fullRange.end);
		if (nodeIsBeforeRange) {
			return IncrementalModelParserState.Before;
		}

		return IncrementalModelParserState.After;
	}

	//Various node translation functions which update the node ranges
	private translateNodeRangesForReparsedPart(node: TreeNode) {
		const startLine = this.newRange.start.line;
		const startCharacter = this.newRange.start.character;
		this.translateNodeAndAttributesVertically(node, startLine);
		this.translateNodeAndAttributesHorizontallyIfOnLine(node, startCharacter, startLine);
		node.children.forEach(child => this.translateNodeRangesForReparsedPart(child));
	}

	private translateNodeRangesParentsOfReparsedPart(node: TreeNode) {
		const lines = this.newRange.end.line - this.oldRange.end.line;
		this.translateNodeFullRangeEndVertically(node, lines);
	}

	private translateNodeAndAttributesVertically(node: TreeNode, lines: number) {
		this.translateNodeVertically(node, lines);

		for (const attributeName in node.attributes) {
			const attribute = node.attributes[attributeName];
			this.translateNodeVertically(attribute, lines);
		}
	}

	private translateNodeAndAttributesHorizontallyIfOnLine(node: TreeNode, characters: number, line: number) {
		this.translateNodeHorizontallyIfOnLine(node, characters, line);

		for (const attributeName in node.attributes) {
			const attribute = node.attributes[attributeName];
			this.translateNodeHorizontallyIfOnLine(attribute, characters, line);
		}
	}

	private translateNodeFullRangeEndVertically(node: TreeNode, lines: number) {
		node.fullRange.end.line += lines;
	}

	private translateNodeVertically(nodeOrAttribute: TreeNode | Attribute, y: number) {
		nodeOrAttribute.range.start.line += y;
		nodeOrAttribute.range.end.line += y;
		nodeOrAttribute.fullRange.start.line += y;
		nodeOrAttribute.fullRange.end.line += y;
	}

	private translateNodeHorizontallyIfOnLine(nodeOrAttribute: TreeNode | Attribute, x: number, line: number) {
		if (nodeOrAttribute.range.start.line == line) {
			nodeOrAttribute.range.start.character += x;
		}
		if (nodeOrAttribute.range.end.line == line) {
			nodeOrAttribute.range.end.character += x;
		}
		if (nodeOrAttribute.fullRange.start.line == line) {
			nodeOrAttribute.fullRange.start.character += x;
		}
		if (nodeOrAttribute.fullRange.end.line == line) {
			nodeOrAttribute.fullRange.end.character += x;
		}
	}

	//Logging statements
	// private logFinishUpdateFile() {
	// 	console.log("AFTER");
	// 	printTree(this.results.tree);
	// }

	// private logStartUpdateFile(contents: string) {
	// 	console.log("BEFORE");
	// 	printTree(this.results.tree);

	// 	console.log("REPARSING");
	// 	const lines = contents.split("\n");
	// 	if (lines.length == 1) {
	// 		console.log(lines[0]);
	// 	} else {
	// 		console.log(lines[0]);
	// 		console.log("...");
	// 		console.log(lines[lines.length - 1]);
	// 	}
	// }
}