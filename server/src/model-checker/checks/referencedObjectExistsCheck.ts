import { ModelDetailLevel, ModelElementTypes, ObjectIdentifierTypes, Reference, SymbolDeclaration } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelChecker, ModelCheckerOptions } from '../modelChecker';

export class ReferencedObjectExistsCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All
	protected objectType = ObjectIdentifierTypes.Reference

	constructor(modelManager: ModelManager) {
		super(modelManager);

	}

	protected checkInternal(node: SymbolDeclaration | Reference, options: ModelCheckerOptions)
	{
		const reference = node as Reference;
		const referencedSymbol = this.modelManager.getReferencedObject(reference);
		const name = reference.name;
		const referenceNotFound = !referencedSymbol && name && !name.startsWith("{");
		if (referenceNotFound) {
			this.addError(reference.range, ModelChecker.messages.REFERENCE_NOT_FOUND(reference));
		}
		if (referencedSymbol && name != referencedSymbol.name && name.toLowerCase() == referencedSymbol.name.toLowerCase() && options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.addInformation(reference.range, ModelChecker.messages.REFERENCE_CAPITALIZATION(referencedSymbol, reference));
		}
		const symbolIsObsolete = referencedSymbol && referencedSymbol.isObsolete;
		if (symbolIsObsolete) {
			this.addError(reference.range, ModelChecker.messages.REFERENCE_OBSOLETE(reference));
		}
		return !symbolIsObsolete && !referenceNotFound;
	}

}