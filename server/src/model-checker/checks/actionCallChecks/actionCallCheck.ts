import { ModelElementTypes, IsSymbolOrReference, Reference, SymbolOrReference } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { flattenArray } from '../../../util/array';
import { ModelCheck } from '../../modelCheck';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';

export abstract class ActionCallCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Action
	protected objectType = IsSymbolOrReference.Reference

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected abstract getAdditionalInputsForSpecificAction(actionReference: Reference):string[]
	protected abstract getAdditionalOutputsForSpecificAction(actionReference: Reference):string[]
	protected abstract verifyActionCall(actionReference: Reference, options: ModelCheckerOptions):void

	protected checkInternal(node: SymbolOrReference, options: ModelCheckerOptions) {
		this.verifyActionCall(node as Reference, options);
	}

	protected verifyMandatoryAttributeProvided(reference: Reference, attributeName: string, argumentAllowed: boolean) {
		const attribute = reference.attributeReferences[attributeName];
		let attributeMissing = !attribute || attribute?.name == "" || attribute?.name == undefined;
		if (attributeMissing && argumentAllowed) {
			const actionArguments = this.modelManager.getActionArguments(reference);
			const argumentNotPassed = actionArguments.find(x => x.name == attributeName) == undefined;
			attributeMissing = attributeMissing && argumentNotPassed;
		}
		return attributeMissing;
	}

	protected verifyInputsAreKnownInReferencedObjects(reference: Reference) {
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
					argument.range, CHECKS_MESSAGES.INPUT_NOT_FOUND(argument.name, referenceAndSubReferences),
				);
			}
		});
	}

	protected verifyOutputsAreKnownInReferencedObjects(reference: Reference) {
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
					output.range, CHECKS_MESSAGES.OUTPUT_NOT_FOUND(outputName, referenceAndSubReferences)
				);
			}
		});
	}

	protected verifyReferencedObjectsMandatoryInputsProvided(reference: Reference, subRef: Reference) {
		const actionArguments = this.modelManager.getActionArguments(reference);
		const referencedSymbol = this.modelManager.getReferencedObject(subRef);
		const argumentNames = new Set(actionArguments.map(x => x.name));
		if (referencedSymbol) {
			const referencedSymbolMandatoryInputs = this.modelManager.getMandatorySymbolInputs(referencedSymbol);
			referencedSymbolMandatoryInputs.forEach(input => {
				if (!argumentNames.has(input.name)) {
					this.addError(subRef.range, CHECKS_MESSAGES.MANDATORY_INPUT_MISSING(input.name, subRef));
				}
			});
		}
	}

	protected getAdditionalInputsForAction(actionReference: Reference) {
		let inputNames: string[] = [];
		this.getAdditionalInputsForSpecificAction(actionReference).forEach(x => inputNames.push(x));
		const referencedAction = this.modelManager.getReferencedObject(actionReference);
		if (referencedAction) {
			const actionAttributes = this.modelManager.getChildrenOfType(referencedAction, ModelElementTypes.Attribute);
			const actionAttributesNames = actionAttributes.map(x => x.name);
			inputNames = inputNames.concat(actionAttributesNames);
		}

		return inputNames;
	}
	
	private getAdditionalOutputsForActions(reference: Reference) {
		const outputNames: string[] = this.getAdditionalOutputsForSpecificAction(reference);
		return outputNames;
	}
}