import { NAMES } from '../../../model-definition/constants';
import { ModelElementTypes, TreeNode, Reference, ModelDetailLevel, SymbolDeclaration } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class RuleLoopActionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => (node.attributeReferences.name.value).toLowerCase() == "ruleloopaction";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(node: TreeNode, options: ModelCheckerOptions) {
		const ruleNameNotSpecified = this.verifyMandatoryAttributeProvided(node, NAMES.ATTRIBUTE_RULE, true);
		if (ruleNameNotSpecified) {
			this.addError(node.range, CHECKS_MESSAGES.RULELOOPACTIONCALL_WITHOUT_NAME());
		}

		this.verifyInputsAreKnownInReferencedObjects(node);
		this.verifyOutputsAreKnownInReferencedObjects(node);

		if (options.detailLevel >= ModelDetailLevel.SubReferences) {
			Object.values(node.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(node, subRef);
			});
		}

		return !ruleNameNotSpecified;
	}

	private verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(node: TreeNode, subRef: Reference) {
		const actionArguments = this.modelManager.getActionArguments(node);
		const referencedSymbol = this.modelManager.getReferencedObject(subRef);
		const argumentNames = new Set(actionArguments.map(x => (x as SymbolDeclaration).name));
		if (subRef.type == ModelElementTypes.Rule) {
			const infosetRef = node.attributeReferences[NAMES.ATTRIBUTE_INFOSET];
			const infoset = infosetRef ? this.modelManager.getReferencedObject(infosetRef) : undefined;
			if (infoset) {
				const query = this.modelManager.getChildrenOfType(infoset, ModelElementTypes.Search)[0];
				if (query) {
					const typeRef = query.attributeReferences[NAMES.ATTRIBUTE_TYPE];
					if (typeRef) {
						this.modelManager.getReferencedTypeAttributes(typeRef).forEach(x => argumentNames.add(x));
					}
				}
			} else {
				argumentNames.add(NAMES.RESERVEDINPUT_VALUE);
			}
		}
		if (referencedSymbol) {
			const referencedSymbolMandatoryInputs = this.modelManager.getMandatorySymbolInputs(referencedSymbol);
			referencedSymbolMandatoryInputs.forEach(input => {
				const inputName = (input as SymbolDeclaration).name;
				if (!argumentNames.has(inputName)) {
					this.addError(node.range, CHECKS_MESSAGES.MANDATORY_INPUT_MISSING(inputName, subRef));
				}
			});
		}
	}

	protected getAdditionalInputsForSpecificAction(node: TreeNode) { return []; }
	protected getAdditionalOutputsForSpecificAction(node: TreeNode) { return []; }
}