import { NAMES } from '../../../model-definition/constants';
import { TreeNode, ModelDetailLevel } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class InfosetCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => (node.attributeReferences.name.value).toLowerCase() == "infoset";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode, options: ModelCheckerOptions) {
		this.verifyActionCall(node, options);
	}

	protected verifyActionCall(reference: TreeNode, options: ModelCheckerOptions) {
		let valid = true;
		valid = this.verifyInfosetCall(reference, options);
		
		if (valid && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.verifyInputsAreKnownInReferencedObjects(reference);
			this.verifyOutputsAreKnownInReferencedObjects(reference);

			Object.values(reference.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(reference, subRef);
			});
		}
	}

	private verifyInfosetCall(reference: TreeNode, options: ModelCheckerOptions) {
		const infosetNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_INFOSET, true);
		if (infosetNameNotSpecified && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.addWarning(reference.range, CHECKS_MESSAGES.INFOSETCALL_WITHOUT_NAME());
		}
		return !infosetNameNotSpecified;
	}

	protected getAdditionalInputsForSpecificAction(node: TreeNode) { return []; }

	protected getAdditionalOutputsForSpecificAction(node: TreeNode) {
		const infosetRef = node.attributeReferences[NAMES.ATTRIBUTE_INFOSET];
		return [infosetRef.name];
	}
}