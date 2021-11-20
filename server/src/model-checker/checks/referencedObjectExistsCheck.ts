import { ModelDetailLevel, ModelElementTypes, IsSymbolOrReference, Reference, SymbolOrReference } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';

export class ReferencedObjectExistsCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All
	protected objectType = IsSymbolOrReference.Reference
	protected matchCondition = undefined

	constructor(modelManager: ModelManager) {
		super(modelManager);

	}

	protected checkInternal(node: SymbolOrReference, options: ModelCheckerOptions)
	{
		const reference = node as Reference;
		const referencedSymbol = this.modelManager.getReferencedObject(reference);
		const name = reference.name;
		const referenceNotFound = !referencedSymbol && name && !name.startsWith("{");
		if (referenceNotFound) {
			this.addError(reference.range, CHECKS_MESSAGES.REFERENCE_NOT_FOUND(reference));
		}
		if (referencedSymbol && name != referencedSymbol.name && name.toLowerCase() == referencedSymbol.name.toLowerCase() && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.addInformation(reference.range, CHECKS_MESSAGES.REFERENCE_CAPITALIZATION(referencedSymbol, reference));
		}
		const symbolIsObsolete = referencedSymbol && referencedSymbol.contextQualifiers.isObsolete;
		if (symbolIsObsolete) {
			this.addError(reference.range, CHECKS_MESSAGES.REFERENCE_OBSOLETE(reference));
		}
		return !symbolIsObsolete && !referenceNotFound;
	}

}