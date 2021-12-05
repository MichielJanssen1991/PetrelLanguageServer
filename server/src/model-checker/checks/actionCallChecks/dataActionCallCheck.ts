import { NAMES } from '../../../model-definition/constants';
import { TreeNode, ModelDetailLevel } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class DataActionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => this.isDataAction(node);
	private static dataActions = new Set(["Select", "Insert", "InsertOrUpdate", "Update"].map(x => x.toLowerCase()));

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(node: TreeNode, options: ModelCheckerOptions) {
		if (options.detailLevel >= ModelDetailLevel.SubReferences) {
			this.verifyInputsAreKnownInReferencedObjects(node);
			this.verifyOutputsAreKnownInReferencedObjects(node);

			Object.values(node.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(node, subRef);
			});
		}
	}

	protected getAdditionalInputsForSpecificAction(node: TreeNode) {
		const typeRef = node.attributeReferences[NAMES.ATTRIBUTE_TYPE];
		const inputNames: string[] = typeRef ? this.modelManager.getReferencedTypeAttributes(typeRef) : [];
		return inputNames;
	}

	protected getAdditionalOutputsForSpecificAction(node: TreeNode) {
		const typeRef = node.attributeReferences[NAMES.ATTRIBUTE_TYPE];
		const outputNames: string[] = typeRef ? this.modelManager.getReferencedTypeAttributes(typeRef) : [];
		return outputNames;
	}

	private isDataAction(node: TreeNode) {
		return DataActionCallCheck.dataActions.has(node.attributeReferences.name.value.toLowerCase());
	}

}