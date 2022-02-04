import { NAMES } from '../../../model-definition/constants';
import { TreeNode, Reference } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ActionCallCheck } from './actionCallCheck';

export class RuleCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => (node.attributes.name.value).toLowerCase() == "rule";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(node: TreeNode,/*  options: ModelCheckerOptions */) {
		let valid = true;
		valid = this.verifyRuleCall(node);

		if (valid) {
			this.verifyInputsAreKnownInReferencedObjects(node);
			this.verifyOutputsAreKnownInReferencedObjects(node);

			const references = Object.values(node.attributes).filter(x=>x.isReference) as Reference[];
			references.forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(node, subRef);
			});
		}
	}

	private verifyRuleCall(node: TreeNode) {
		const ruleNameNotSpecified = this.verifyMandatoryAttributeProvided(node, NAMES.ATTRIBUTE_RULE, true);
		if (ruleNameNotSpecified) {
			this.addMessage(node.range, "CC0005", "#CC0005: " + CHECKS_MESSAGES.RULECALL_WITHOUT_NAME());
		}
		return !ruleNameNotSpecified;
	}

	protected getAdditionalInputsForSpecificAction() { return []; }
	protected getAdditionalOutputsForSpecificAction() { return []; }
}