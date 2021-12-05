import { NAMES } from '../../../model-definition/constants';
import { TreeNode, Reference, ModelDetailLevel } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class FunctionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => (node.attributeReferences.name.value).toLowerCase() == "function";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(node: TreeNode, options: ModelCheckerOptions) {
		let valid = true;
		valid = this.verifyFunctionCall(node, options);

		if (valid && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.verifyInputsAreKnownInReferencedObjects(node);
			this.verifyOutputsAreKnownInReferencedObjects(node);

			Object.values(node.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(node, subRef);
			});
		}
	}

	private verifyFunctionCall(reference: TreeNode, options: ModelCheckerOptions) {
		const functionNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_FUNCTION, false);
		if (functionNameNotSpecified) {
			this.addError(reference.range, CHECKS_MESSAGES.RULECALL_WITHOUT_NAME());
		}
		return !functionNameNotSpecified;
	}

	protected getAdditionalInputsForSpecificAction(node: TreeNode) { return []; }
	protected getAdditionalOutputsForSpecificAction(node: TreeNode) { return []; }
}