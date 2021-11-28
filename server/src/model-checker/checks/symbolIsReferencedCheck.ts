import { ModelDetailLevel, ModelElementTypes, IsSymbolOrReference, SymbolDeclaration, SymbolOrReference } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';

export class SymbolIsReferencedCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All
	protected objectType = IsSymbolOrReference.Symbol
	protected matchCondition = undefined;

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: SymbolOrReference, options: ModelCheckerOptions)
	{
		const symbol = node as SymbolDeclaration;
		const references = this.modelManager.getReferencesForSymbol(symbol);
		const noReferencesFound = references.length <= 0;
		if (noReferencesFound && symbol.type != ModelElementTypes.NameSpace && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.addInformation(symbol.range, CHECKS_MESSAGES.NO_REFERENCES_FOUND(symbol));
		}
	}

}