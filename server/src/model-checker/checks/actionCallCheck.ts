import { NAMES } from '../../model-definition/attributes';
import { ModelDetailLevel, ModelElementTypes, ObjectIdentifierTypes, Reference, SymbolDeclaration } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { flattenArray } from '../../util/array';
import { ModelCheck } from '../modelCheck';
import { ModelChecker, ModelCheckerOptions } from '../modelChecker';

export class ActionCallCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Action
	protected objectType = ObjectIdentifierTypes.Reference

	private static dataInsertOrUpdateActions = new Set(["Insert", "InsertOrUpdate", "Update"].map(x => x.toLowerCase()));
	private static dataSelectActions = new Set(["Select"].map(x => x.toLowerCase()));
	private static infosetCallActions = new Set(["Infoset"].map(x => x.toLowerCase()));

	constructor(modelManager: ModelManager) {
		super(modelManager);

	}

	protected checkInternal(node: SymbolDeclaration | Reference, options: ModelCheckerOptions) {
		this.verifyActionCall(node as Reference, options);
	}

	//Verify action calls
	private verifyActionCall(reference: Reference, options: ModelCheckerOptions) {
		let valid = true;
		if (reference.name.toLowerCase() == "infoset") {
			valid = this.verifyInfosetCall(reference, options);
		}
		if (reference.name.toLowerCase() == "rule") {
			valid = this.verifyRuleCall(reference);
		}
		if (reference.name.toLowerCase() == "ruleloopaction") {
			valid = this.verifyRuleLoopActionCall(reference, options);
		}
		if (valid && options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.verifyReferencedObjectsMandatoryInputsProvided(reference, reference);
			this.verifyInputsAreKnownInReferencedObjects(reference);
			this.verifyOutputsAreKnownInReferencedObjects(reference);

			Object.values(reference.attributeReferences).forEach(subRef => {
				if (reference.name.toLowerCase() != "ruleloopaction") {
					this.verifyReferencedObjectsMandatoryInputsProvided(reference, subRef);
				}
			});
		}
	}

	private verifyRuleCall(reference: Reference) {
		const ruleNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_RULE, true);
		if (ruleNameNotSpecified) {
			this.addError(reference.range, ModelChecker.messages.RULECALL_WITHOUT_NAME());
		}
		return !ruleNameNotSpecified;
	}

	private verifyRuleLoopActionCall(reference: Reference, options: ModelCheckerOptions) {
		const ruleNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_RULE, true);
		if (ruleNameNotSpecified) {
			this.addError(reference.range, ModelChecker.messages.RULELOOPACTIONCALL_WITHOUT_NAME());
		}

		if (options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			Object.values(reference.attributeReferences).forEach(subRef => {
				this.verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(reference, subRef);
			});
		}

		return !ruleNameNotSpecified;
	}

	private verifyInfosetCall(reference: Reference, options: ModelCheckerOptions) {
		const infosetNameNotSpecified = this.verifyMandatoryAttributeProvided(reference, NAMES.ATTRIBUTE_INFOSET, true);
		if (infosetNameNotSpecified && options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.addWarning(reference.range, ModelChecker.messages.INFOSETCALL_WITHOUT_NAME());
		}
		return !infosetNameNotSpecified;
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

	private verifyInputsAreKnownInReferencedObjects(reference: Reference) {
		const referenceAndSubReferences = [reference, ...Object.values(reference.attributeReferences)];
		const referencedSymbolInputs = referenceAndSubReferences.map(subRef => {
			const referencedSymbol = this.modelManager.getReferencedObject(subRef);
			return referencedSymbol ? this.modelManager.getSymbolInputs(referencedSymbol) : [];
		});
		const inputNames = new Set(flattenArray(referencedSymbolInputs).map(x => x.name));
		this.getAdditionalInputsForAction(reference).forEach(x => { inputNames.add(x); });
		this.modelManager.getActionArguments(reference).forEach(argument => {
			if (!inputNames.has(argument.name)) {
				this.addWarning(
					argument.range, ModelChecker.messages.INPUT_NOT_FOUND(argument.name, referenceAndSubReferences),
				);
			}
		});
	}

	private verifyOutputsAreKnownInReferencedObjects(reference: Reference) {
		const referenceAndSubReferences = [reference, ...Object.values(reference.attributeReferences)];
		const referencedSymbolOutputs = referenceAndSubReferences.map(subRef => {
			const referencedSymbol = this.modelManager.getReferencedObject(subRef);
			return referencedSymbol ? this.modelManager.getSymbolOutputs(referencedSymbol) : [];
		});
		const outputNames = new Set(flattenArray(referencedSymbolOutputs).map(x => x.name));
		this.getAdditionalOutputsForActions(reference).forEach(x => outputNames.add(x));

		this.modelManager.getActionOutputs(reference).forEach(output => {
			const outputName = output.name;
			if (!outputNames.has(outputName)) {
				this.addWarning(
					output.range, ModelChecker.messages.OUTPUT_NOT_FOUND(outputName, referenceAndSubReferences)
				);
			}
		});
	}

	private verifyReferencedObjectsMandatoryInputsProvided(reference: Reference, subRef: Reference) {
		const actionArguments = this.modelManager.getActionArguments(reference);
		const referencedSymbol = this.modelManager.getReferencedObject(subRef);
		const argumentNames = new Set(actionArguments.map(x => x.name));
		if (referencedSymbol) {
			const referencedSymbolMandatoryInputs = this.modelManager.getMandatorySymbolInputs(referencedSymbol);
			referencedSymbolMandatoryInputs.forEach(input => {
				if (!argumentNames.has(input.name)) {
					this.addError(subRef.range, ModelChecker.messages.MANDATORY_INPUT_MISSING(input.name, subRef));
				}
			});
		}
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
					this.addError(reference.range, ModelChecker.messages.MANDATORY_INPUT_MISSING(input.name, subRef));
				}
			});
		}
	}

	private getAdditionalInputsForAction(actionReference: Reference) {
		let inputNames: string[] = [];
		if (this.isDataSelectAction(actionReference)) {
			const typeRef = actionReference.attributeReferences[NAMES.ATTRIBUTE_TYPE];
			if (typeRef) {
				this.modelManager.getReferencedTypeAttributes(typeRef).forEach(x => inputNames.push(x));
			}
		}
		if (this.isDataInsertOrUpdateActions(actionReference)) {
			const typeRef = actionReference.attributeReferences[NAMES.ATTRIBUTE_TYPE];
			if (typeRef) {
				this.modelManager.getReferencedTypeAttributes(typeRef).forEach(x => inputNames.push(x));
			}
		}
		const referencedAction = this.modelManager.getReferencedObject(actionReference);
		if (referencedAction) {
			const actionAttributes = this.modelManager.getChildrenOfType(referencedAction, ModelElementTypes.Attribute);
			const actionAttributesNames = actionAttributes.map(x => x.name);
			inputNames = inputNames.concat(actionAttributesNames);
		}

		return inputNames;
	}

	private getAdditionalOutputsForActions(reference: Reference) {
		const outputNames: string[] = [];
		if (this.isDataSelectAction(reference) || this.isDataInsertOrUpdateActions(reference)) {
			const typeRef = reference.attributeReferences[NAMES.ATTRIBUTE_TYPE];
			if (typeRef) {
				this.modelManager.getReferencedTypeAttributes(typeRef).forEach(x => outputNames.push(x));
			}
		}
		if (this.isInfosetCallAction(reference)) {
			const infosetRef = reference.attributeReferences[NAMES.ATTRIBUTE_INFOSET];
			outputNames.push(infosetRef.name);
		}
		return outputNames;
	}

	private isDataSelectAction(reference: Reference) {
		return reference.type == ModelElementTypes.Action && ActionCallCheck.dataSelectActions.has(reference.name.toLowerCase());
	}

	private isDataInsertOrUpdateActions(reference: Reference) {
		return reference.type == ModelElementTypes.Action && ActionCallCheck.dataInsertOrUpdateActions.has(reference.name.toLowerCase());
	}
	private isInfosetCallAction(reference: Reference) {
		return reference.type == ModelElementTypes.Action && ActionCallCheck.infosetCallActions.has(reference.name.toLowerCase());
	}

}