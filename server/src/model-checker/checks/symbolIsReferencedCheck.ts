import { SymbolDeclaration, TreeNode } from '../../model-definition/types/tree';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { CHECKS_MESSAGES } from '../messages';
import { standaloneObjectTypes } from '../../model-definition/definitions/other';
import { ModelDetailLevel, ModelElementTypes } from '../../model-definition/types/definitions';

export class SymbolIsReferencedCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All;
	protected detailLevel: ModelDetailLevel = ModelDetailLevel.SubReferences;
	protected matchCondition = (node: TreeNode) => node.isSymbolDeclaration;

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode) {
		if (!standaloneObjectTypes.has(node.type)) { return; } //Nodes which require context are checked as part of their parent
		const symbol = node as SymbolDeclaration;
		const references = this.modelManager.getReferencesForSymbol(symbol);
		const noReferencesFound = references.length <= 0;
		if (noReferencesFound) {
			switch (node.type) {
				case ModelElementTypes.Infoset:
					// if there are infoset variable children defined, the reference message will be skipped.
					if (!node.children.some(x => x.type == ModelElementTypes.InfosetVariable)) {
						this.addMessage(symbol.range, "ROC0004", CHECKS_MESSAGES.NO_REFERENCES_FOUND_INFOSET(symbol));
					}
					break;
				default:
					this.addMessage(symbol.range, "ROC0005", CHECKS_MESSAGES.NO_REFERENCES_FOUND(symbol));
					break;
			}

		}
	}

}