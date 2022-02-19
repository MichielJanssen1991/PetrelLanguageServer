import { Range } from 'vscode-languageserver';
import { ModelDefinitionManager, ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { Attribute, ModelDetailLevel, ModelElementTypes, TreeNode } from '../../model-definition/symbolsAndReferences';
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
export class IncrementalModelParser extends ModelParser implements IncrementalParser{
	private newRange: Range = Range.create(0,0,0,0);
	private oldRange: Range = Range.create(0,0,0,0);
	private newContent="";

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
		// A node can be the before/after/in the to be reparsed part of code. 
		// Furthermore nodes before the part to be reparsed can be relevant parents or siblings
		// The parents are used to initialize the object stack used in parsing the part to be reparsed
		let newNode: TreeNode;
		switch (this.determineStateForNode(node)) {
			case IncrementalModelParserState.Before:
				//No action needed
				break;
			case IncrementalModelParserState.Parent:
				//Build context using parsed object stack
				this.pushToParsedObjectStack(node,
					this.modelDefinitionManager.getModelDefinitionForTreeNode(this.results.modelFileContext || ModelFileContext.Unknown, node)
				);
				node.children.forEach(child => this.walknodes(child));
				this.translateNodeRangesParentsOfReparsedPart(node);
				break;
			case IncrementalModelParserState.Is:
				this.parseFile(this.newContent);
				newNode = this.getLatestParsedObjectFromStack().parsedObject.children.pop() as TreeNode;
				this.translateNodeRangesForReparsedPart(newNode);
				Object.keys(newNode).forEach(key => { (node as any)[key] = (newNode as any)[key]; }
				);
				break;
			case IncrementalModelParserState.After:
				this.translateNodeRangesAfterReparsedPart(node);
				break;
		}
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

	private translateNodeRangesForReparsedPart(node: TreeNode) {
		const startLine = this.newRange.start.line;
		const startCharacter = this.newRange.start.character;
		this.translateNodeAndAttributesVertically(node, startLine);
		this.translateNodeAndAttributesHorizontallyIfOnLine(node, startCharacter, startLine);
		node.children.forEach(child => this.translateNodeRangesForReparsedPart(child));
	}

	private translateNodeRangesAfterReparsedPart(node: TreeNode) {
		const lines = this.newRange.end.line - this.oldRange.end.line;
		this.translateNodeAndAttributesVertically(node, lines);
		node.children.forEach(child => this.translateNodeRangesAfterReparsedPart(child));
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