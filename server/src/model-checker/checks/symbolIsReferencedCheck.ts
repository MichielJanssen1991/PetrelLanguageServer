import { ModelDetailLevel, ModelElementTypes, ObjectIdentifierTypes, Reference, SymbolDeclaration } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelChecker, ModelCheckerOptions } from '../modelChecker';

export class SymbolIsReferencedCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All
	protected objectType = ObjectIdentifierTypes.Symbol

	constructor(modelManager: ModelManager) {
		super(modelManager);

	}

	protected checkInternal(node: SymbolDeclaration | Reference, options: ModelCheckerOptions)
	{
		const symbol = node as SymbolDeclaration;
		const references = this.modelManager.getReferencesForSymbol(symbol);
		const noReferencesFound = references.length <= 0;
		if (noReferencesFound && symbol.type != ModelElementTypes.NameSpace && options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.addInformation(symbol.range, ModelChecker.messages.NO_REFERENCES_FOUND(symbol));
		}
	}

}