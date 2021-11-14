import { NAMES } from '../../../model-definition/attributes';
import { SymbolOrReference, Reference, ModelDetailLevel } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class InfosetCallCheck extends ActionCallCheck {
	protected matchCondition = (node: SymbolOrReference) => node.name.toLowerCase() == "infoset";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: SymbolOrReference, options: ModelCheckerOptions) {
		this.verifyActionCall(node as Reference, options);
	}

	protected verifyActionCall(reference: Reference, options: ModelCheckerOptions) {
		let valid = true;
		valid = this.verifyInfosetCall(reference, options);
		
		if (valid && options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.verifyReferencedObjectsMandatoryInputsProvided(reference, reference);
			this.verifyInputsAreKnownInReferencedObjects(reference);
			this.verifyOutputsAreKnownInReferencedObjects(reference);

			Object.values(reference.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(reference, subRef);
			});
		}
	}

	private verifyInfosetCall(reference: Reference, options: ModelCheckerOptions) {
		const infosetNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_INFOSET, true);
		if (infosetNameNotSpecified && options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.addWarning(reference.range, CHECKS_MESSAGES.INFOSETCALL_WITHOUT_NAME());
		}
		return !infosetNameNotSpecified;
	}

	protected getAdditionalInputsForSpecificAction(reference: Reference) {
		return [];
	}

	protected getAdditionalOutputsForSpecificAction(reference: Reference) {
		const infosetRef = reference.attributeReferences[NAMES.ATTRIBUTE_INFOSET];
		return [infosetRef.name];
	}
}