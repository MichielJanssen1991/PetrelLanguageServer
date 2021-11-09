import { NAMES } from '../../model-definition/attributes';
import { ModelDetailLevel, ModelElementTypes, ObjectIdentifierTypes, Reference, SymbolOrReference } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from './messages';

export class RuleLoopActionCallCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Action
	protected objectType = ObjectIdentifierTypes.Reference
	protected matchCondition = (node: SymbolOrReference) => node.name.toLowerCase() == "ruleloopaction";

	constructor(modelManager: ModelManager) {
		super(modelManager);

	}

	protected checkInternal(node: SymbolOrReference, options: ModelCheckerOptions) {
		this.verifyRuleLoopActionCall(node as Reference, options);
	}

	private verifyRuleLoopActionCall(reference: Reference, options: ModelCheckerOptions) {
		const ruleNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_RULE, true);
		if (ruleNameNotSpecified) {
			this.addError(reference.range, CHECKS_MESSAGES.RULELOOPACTIONCALL_WITHOUT_NAME());
		}

		if (options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			Object.values(reference.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(reference, subRef);
			});
		}

		return !ruleNameNotSpecified;
	}

	private verifyMandatoryAttributeProvided(reference: Reference, attributeName: string, argumentAllowed: boolean) {
		const attribute = reference.attributeReferences[attributeName];
		let attributeMissing = !attribute || attribute?.name == "" || attribute?.name == undefined;
		if (attributeMissing && argumentAllowed) {
			const argumentNotPassed = reference.children.find(x => x.type == ModelElementTypes.Input && x.name == attributeName) == undefined;
			attributeMissing = attributeMissing && argumentNotPassed;
		}
		return attributeMissing;
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

}