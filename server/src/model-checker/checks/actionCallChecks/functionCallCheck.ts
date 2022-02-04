import { NAMES } from '../../../model-definition/constants';
import { TreeNode, Reference } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ActionCallCheck } from './actionCallCheck';

export class FunctionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => (node.attributes.name.value).toLowerCase() == "function";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(node: TreeNode, /*  options: ModelCheckerOptions */) {
		let valid = true;
		valid = this.verifyFunctionCall(node/* , options */);

		if (valid) {
			this.verifyInputsAreKnownInReferencedObjects(node);
			this.verifyOutputsAreKnownInReferencedObjects(node);

			const references = Object.values(node.attributes).filter(x=>x.isReference) as Reference[];
			references.forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(node, subRef);
			});
		}
	}

	private verifyFunctionCall(reference: TreeNode/* , options: ModelCheckerOptions */) {
		const functionNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_FUNCTION, false);
		if (functionNameNotSpecified) {
			this.addMessage(reference.range, "CC0008", "#CC0008: " + CHECKS_MESSAGES.RULECALL_WITHOUT_NAME());
		}
		return !functionNameNotSpecified;
	}

	protected getAdditionalInputsForSpecificAction() { return []; }
	protected getAdditionalOutputsForSpecificAction() { return []; }
}