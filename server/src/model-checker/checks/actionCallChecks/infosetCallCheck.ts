import { NAMES } from '../../../model-definition/types/constants';
import { TreeNode, Reference } from '../../../model-definition/types/tree';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ActionCallCheck } from './actionCallCheck';

export class InfosetCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => (node.attributes.name.value).toLowerCase() == "infoset";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode,/*  options: ModelCheckerOptions */) {
		this.verifyActionCall(node);
	}

	protected verifyActionCall(reference: TreeNode) {
		let valid = true;
		valid = this.verifyInfosetCall(reference);

		if (valid) {
			this.verifyInputsAreKnownInReferencedObjects(reference);
			this.verifyOutputsAreKnownInReferencedObjects(reference);

			const references = Object.values(reference.attributes).filter(x => x.isReference) as Reference[];
			references.forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvided(reference, subRef);
			});
		}
	}

	private verifyInfosetCall(reference: TreeNode) {
		const infosetNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_INFOSET, true);
		if (infosetNameNotSpecified) {
			this.addMessage(reference.range, "CC0007", CHECKS_MESSAGES.INFOSETCALL_WITHOUT_NAME());
		}
		return !infosetNameNotSpecified;
	}

	protected getAdditionalInputsForSpecificAction() { return []; }

	protected getAdditionalOutputsForSpecificAction(node: TreeNode) {
		const infosetRef = node.attributes[NAMES.ATTRIBUTE_INFOSET] as Reference;
		if (infosetRef) {
			const infosetDef = this.modelManager.getReferencedObject(infosetRef);
			let outputNames:string[] = [];
			if (infosetDef) {
				const infosetVariables = this.modelManager.getInfosetVariables(infosetDef);
				outputNames = infosetVariables.map(x => x.name);
				infosetVariables.forEach(variable => {
					if (variable.name.includes(".")) {
						const varWithoutNameSpace = variable.name.split(".").pop() as string;
						outputNames.push(varWithoutNameSpace);
					}
				});
			}
			outputNames.push(infosetRef.value);
			return outputNames;
		}
		return [];
	}
}