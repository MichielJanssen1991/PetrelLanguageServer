import { NAMES } from '../../../model-definition/constants';
import { SymbolOrReference, Reference, ModelDetailLevel } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class FunctionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: SymbolOrReference) => node.name.toLowerCase() == "function";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(reference: Reference, options: ModelCheckerOptions) {
		let valid = true;
		valid = this.verifyFunctionCall(reference, options);

		if (valid && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.verifyReferencedObjectsMandatoryInputsProvided(reference, reference);
			this.verifyInputsAreKnownInReferencedObjects(reference);
			this.verifyOutputsAreKnownInReferencedObjects(reference);

			Object.values(reference.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(reference, subRef);
			});
		}
	}

	private verifyFunctionCall(reference: Reference, options: ModelCheckerOptions) {
		const functionNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_FUNCTION, false);
		if (functionNameNotSpecified) {
			this.addError(reference.range, CHECKS_MESSAGES.RULECALL_WITHOUT_NAME());
		}
		return !functionNameNotSpecified;
	}

	protected getAdditionalInputsForSpecificAction(reference: Reference) { return []; }
	protected getAdditionalOutputsForSpecificAction(reference: Reference) { return []; }
}