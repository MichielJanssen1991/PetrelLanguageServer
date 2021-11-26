import { NAMES } from '../../../model-definition/constants';
import { ModelElementTypes, SymbolOrReference, Reference, ModelDetailLevel } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';
import { ActionCallCheck } from './actionCallCheck';

export class RuleLoopActionCallCheck extends ActionCallCheck {
	protected matchCondition = (node: SymbolOrReference) => node.name.toLowerCase() == "ruleloopaction";

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected verifyActionCall(reference: Reference, options: ModelCheckerOptions) {
		const ruleNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_RULE, true);
		if (ruleNameNotSpecified) {
			this.addError(reference.range, CHECKS_MESSAGES.RULELOOPACTIONCALL_WITHOUT_NAME());
		}

		this.verifyReferencedObjectsMandatoryInputsProvided(reference, reference);
		this.verifyInputsAreKnownInReferencedObjects(reference);
		this.verifyOutputsAreKnownInReferencedObjects(reference);

		if (options.detailLevel >= ModelDetailLevel.SubReferences) {
			Object.values(reference.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(reference, subRef);
			});
		}

		return !ruleNameNotSpecified;
	}

	private verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(reference: Reference, subRef: Reference) {
		const actionArguments = this.modelManager.getActionArguments(reference);
		const referencedSymbol = this.modelManager.getReferencedObject(subRef);
		const argumentNames = new Set(actionArguments.map(x => x.name));
		if (subRef.type == ModelElementTypes.Rule) {
			const infosetRef = reference.attributeReferences[NAMES.ATTRIBUTE_INFOSET];
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
				if (!argumentNames.has(input.name)) {
					this.addError(reference.range, CHECKS_MESSAGES.MANDATORY_INPUT_MISSING(input.name, subRef));
				}
			});
		}
	}

	protected getAdditionalInputsForSpecificAction(reference: Reference) { return []; }
	protected getAdditionalOutputsForSpecificAction(reference: Reference) { return []; }
}