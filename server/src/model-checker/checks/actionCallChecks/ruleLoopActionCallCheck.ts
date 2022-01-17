import { NAMES } from '../../../model-definition/constants';
import { ModelElementTypes, TreeNode, Reference, SymbolDeclaration } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ActionCallCheck } from './actionCallCheck';

export class RuleLoopActionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: TreeNode) => (node.attributes.name.value).toLowerCase() == "ruleloopaction";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(node: TreeNode, /*  options: ModelCheckerOptions */) {
		const ruleNameNotSpecified = this.verifyMandatoryAttributeProvided(node, NAMES.ATTRIBUTE_RULE, true);
		if (ruleNameNotSpecified) {
			this.addMessage(node.range, "CC0004",CHECKS_MESSAGES.RULELOOPACTIONCALL_WITHOUT_NAME());
		}

		this.verifyInputsAreKnownInReferencedObjects(node);
		this.verifyOutputsAreKnownInReferencedObjects(node);

		const references = Object.values(node.attributes).filter(x=>x.isReference) as Reference[];
		references.forEach(subRef => {
			this.verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(node, subRef);
		});

		return !ruleNameNotSpecified;
	}

	private verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(node: TreeNode, subRef: Reference) {
		const actionArguments = this.modelManager.getActionArguments(node);
		const referencedSymbol = this.modelManager.getReferencedObject(subRef);
		const argumentNames = new Set(actionArguments.map(x => (x as SymbolDeclaration).name));
		if (subRef.type == ModelElementTypes.Rule) {
			const infosetRef = node.attributes[NAMES.ATTRIBUTE_INFOSET] as Reference;
			const infoset = infosetRef ? this.modelManager.getReferencedObject(infosetRef) : undefined;
			if (infoset) {
				const query = this.modelManager.getChildrenOfType(infoset, ModelElementTypes.Search)[0];
				if (query) {
					const typeRef = query.attributes[NAMES.ATTRIBUTE_TYPE] as Reference;
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
					this.addMessage(node.range, "CC0006", CHECKS_MESSAGES.MANDATORY_INPUT_MISSING(inputName, subRef));
				}
			});
		}
	}

	protected getAdditionalInputsForSpecificAction() { return []; }
	protected getAdditionalOutputsForSpecificAction() { return []; }
}