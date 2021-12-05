import { NAMES } from '../../../model-definition/constants';
import { TreeNode, Reference, ModelDetailLevel } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class RuleCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => (node.attributeReferences.name.value).toLowerCase() == "rule";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(node: TreeNode, options: ModelCheckerOptions) {
		let valid = true;
		valid = this.verifyRuleCall(node, options);

		if (valid && options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.verifyInputsAreKnownInReferencedObjects(node);
			this.verifyOutputsAreKnownInReferencedObjects(node);

			Object.values(node.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(node, subRef);
			});
		}
	}

	private verifyRuleCall(node: TreeNode, options: ModelCheckerOptions) {
		const ruleNameNotSpecified = this.verifyMandatoryAttributeProvided(node, NAMES.ATTRIBUTE_RULE, true);
		if (ruleNameNotSpecified && options.detailLevel >= ModelDetailLevel.SubReferences) { //Subreferences need to exists to avoid false positivies when rulename is provided as an argument
			this.addError(node.range, CHECKS_MESSAGES.RULECALL_WITHOUT_NAME());
		}
		return !ruleNameNotSpecified;
	}

	protected getAdditionalInputsForSpecificAction(node: TreeNode) { return []; }
	protected getAdditionalOutputsForSpecificAction(node: TreeNode) { return []; }
}