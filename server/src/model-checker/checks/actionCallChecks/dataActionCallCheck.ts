import { NAMES } from '../../../model-definition/attributes';
import { SymbolOrReference, Reference, ModelDetailLevel } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class DataActionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: SymbolOrReference) => this.isDataAction(node as Reference);
	private static dataActions = new Set(["Select", "Insert", "InsertOrUpdate", "Update"].map(x => x.toLowerCase()));

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(reference: Reference, options: ModelCheckerOptions) {
		if (options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.verifyReferencedObjectsMandatoryInputsProvided(reference, reference);
			this.verifyInputsAreKnownInReferencedObjects(reference);
			this.verifyOutputsAreKnownInReferencedObjects(reference);

			Object.values(reference.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(reference, subRef);
			});
		}
	}

	protected getAdditionalInputsForSpecificAction(reference: Reference) {
		const typeRef = reference.attributeReferences[NAMES.ATTRIBUTE_TYPE];
		const inputNames: string[] = typeRef ? this.modelManager.getReferencedTypeAttributes(typeRef) : [];
		return inputNames;
	}

	protected getAdditionalOutputsForSpecificAction(reference: Reference) {
		const typeRef = reference.attributeReferences[NAMES.ATTRIBUTE_TYPE];
		const outputNames: string[] = typeRef ? this.modelManager.getReferencedTypeAttributes(typeRef) : [];
		return outputNames;
	}

	private isDataAction(reference: Reference) {
		return DataActionCallCheck.dataActions.has(reference.name.toLowerCase());
	}

}