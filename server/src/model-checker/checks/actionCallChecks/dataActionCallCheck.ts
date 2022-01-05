import { NAMES } from '../../../model-definition/constants';
import { TreeNode, Reference } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { ActionCallCheck } from './actionCallCheck';

export class DataActionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => this.isDataAction(node);
	private static dataActions = new Set(["Select", "Insert", "InsertOrUpdate", "Update"].map(x => x.toLowerCase()));

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(node: TreeNode,/*  options: ModelCheckerOptions */) {
		this.verifyInputsAreKnownInReferencedObjects(node);
		this.verifyOutputsAreKnownInReferencedObjects(node);

		const references = Object.values(node.attributes).filter(x=>x.isReference) as Reference[];
		references.forEach(subRef => {
			this.verifyReferencedObjectsMandatoryInputsProvided(node, subRef);
		});
	}

	protected getAdditionalInputsForSpecificAction(node: TreeNode) {
		const typeRef = node.attributes[NAMES.ATTRIBUTE_TYPE] as Reference;
		const inputNames: string[] = typeRef ? this.modelManager.getReferencedTypeAttributes(typeRef) : [];
		return inputNames;
	}

	protected getAdditionalOutputsForSpecificAction(node: TreeNode) {
		const typeRef = node.attributes[NAMES.ATTRIBUTE_TYPE] as Reference;
		const outputNames: string[] = typeRef ? this.modelManager.getReferencedTypeAttributes(typeRef) : [];
		return outputNames;
	}

	private isDataAction(node: TreeNode) {
		return DataActionCallCheck.dataActions.has(node.attributes.name.value.toLowerCase());
	}

}