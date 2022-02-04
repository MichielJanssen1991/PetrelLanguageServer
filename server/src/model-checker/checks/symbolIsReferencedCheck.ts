import { ModelDetailLevel, ModelElementTypes, SymbolDeclaration, TreeNode } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { CHECKS_MESSAGES } from '../messages';
import { standaloneObjectTypes } from '../../model-definition/definitions/other';

export class SymbolIsReferencedCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All;
	protected detailLevel: ModelDetailLevel = ModelDetailLevel.SubReferences;
	protected matchCondition = (node: TreeNode) => node.isSymbolDeclaration;

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode,/*  options: ModelCheckerOptions */)
	{
		if (!standaloneObjectTypes.has(node.type)) { return; } //Nodes which require context are checked as part of their parent
		const symbol = node as SymbolDeclaration;
		const references = this.modelManager.getReferencesForSymbol(symbol);
		const noReferencesFound = references.length <= 0;
		if (noReferencesFound) {
			if(node.type == ModelElementTypes.Infoset)
			{
				this.addMessage(symbol.range, "ROC0004", "#ROC0004: " + CHECKS_MESSAGES.NO_REFERENCES_FOUND_INFOSET(symbol));
			}
			else
			{
				this.addMessage(symbol.range, "ROC0005", "#ROC0005: " + CHECKS_MESSAGES.NO_REFERENCES_FOUND(symbol));
			}
		}
	}

}