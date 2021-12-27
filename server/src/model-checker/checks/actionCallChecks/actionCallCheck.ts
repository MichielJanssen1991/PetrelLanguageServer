import { ModelElementTypes, IsSymbolOrReference, TreeNode, SymbolDeclaration, Reference } from '../../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../../symbol-and-reference-manager/modelManager';
import { flattenArray } from '../../../util/array';
import { ModelCheck } from '../../modelCheck';
import { CHECKS_MESSAGES } from '../../messages';
import { ModelCheckerOptions } from '../../modelChecker';

export abstract class ActionCallCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.ActionCall

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected abstract getAdditionalInputsForSpecificAction(actionCall: TreeNode):string[]
	protected abstract getAdditionalOutputsForSpecificAction(actionCall: TreeNode):string[]
	protected abstract verifyActionCall(actionCall: TreeNode, options: ModelCheckerOptions):void

	protected checkInternal(node: TreeNode, options: ModelCheckerOptions) {
		this.verifyActionCall(node, options);
	}

	protected verifyMandatoryAttributeProvided(actionCall: TreeNode, attributeName: string, argumentAllowed: boolean) {
		const attribute = actionCall.attributes[attributeName];
		let attributeMissing = !attribute || attribute?.name == "" || attribute?.name == undefined;
		if (attributeMissing && argumentAllowed) {
			const actionArguments = this.modelManager.getActionArguments(actionCall);
			const argumentNotPassed = actionArguments.find(x => this.modelManager.getActionArgumentRemoteName(x) == attributeName) == undefined;
			attributeMissing = attributeMissing && argumentNotPassed;
		}
		return attributeMissing;
	}

	protected verifyInputsAreKnownInReferencedObjects(actionCall: TreeNode) {
		const referenceAndSubReferences = Object.values(actionCall.attributes).filter(x=>x.isReference) as Reference[];
		const referencedSymbolInputs = referenceAndSubReferences.map(subRef => {
			const referencedSymbol = this.modelManager.getReferencedObject(subRef);
			return referencedSymbol ? this.modelManager.getSymbolInputs(referencedSymbol) : [];
		});
		const inputNames = new Set(flattenArray(referencedSymbolInputs as SymbolDeclaration[][]).map(x => x.name));
		this.getAdditionalInputsForAction(actionCall).forEach(x => { inputNames.add(x); });
		this.modelManager.getActionArguments(actionCall).forEach(argument => {
			const remoteName = this.modelManager.getActionArgumentRemoteName(argument);
			if (!inputNames.has(remoteName)) {
				this.addWarning(
					argument.range, CHECKS_MESSAGES.INPUT_NOT_FOUND(remoteName, referenceAndSubReferences),
				);
			}
		});
	}

	protected verifyOutputsAreKnownInReferencedObjects(actionCall: TreeNode) {
		const referenceAndSubReferences = Object.values(actionCall.attributes).filter(x=>x.isReference) as Reference[];
		const referencedSymbolOutputs = referenceAndSubReferences.map(subRef => {
			const referencedSymbol = this.modelManager.getReferencedObject(subRef);
			return referencedSymbol ? this.modelManager.getSymbolOutputs(referencedSymbol) : [];
		});
		const outputNames = new Set(flattenArray(referencedSymbolOutputs as SymbolDeclaration[][]).map(x => x.name));
		this.getAdditionalOutputsForActions(actionCall).forEach(x => outputNames.add(x));

		this.modelManager.getActionOutputs(actionCall).forEach(output => {
			const outputName = (output as SymbolDeclaration).name;
			if (!outputNames.has(outputName)) {
				this.addWarning(
					output.range, CHECKS_MESSAGES.OUTPUT_NOT_FOUND(outputName, referenceAndSubReferences)
				);
			}
		});
	}

	protected verifyReferencedObjectsMandatoryInputsProvided(actionCall: TreeNode, subRef: Reference) {
		const actionArguments = this.modelManager.getActionArguments(actionCall);
		const referencedSymbol = this.modelManager.getReferencedObject(subRef);
		const argumentNames = new Set(actionArguments.map(x => this.modelManager.getActionArgumentRemoteName(x)));
		if (referencedSymbol) {
			const referencedSymbolMandatoryInputs = this.modelManager.getMandatorySymbolInputs(referencedSymbol);
			referencedSymbolMandatoryInputs.forEach(input => {
				const inputName = (input as SymbolDeclaration).name;
				if (!argumentNames.has(inputName)) {
					this.addError(subRef.range, CHECKS_MESSAGES.MANDATORY_INPUT_MISSING(inputName, subRef));
				}
			});
		}
	}

	protected getAdditionalInputsForAction(actionCall: TreeNode) {
		let inputNames: string[] = [];
		this.getAdditionalInputsForSpecificAction(actionCall).forEach(x => inputNames.push(x));
		const actionRef = actionCall.attributes["name"] as Reference;
		const referencedAction = this.modelManager.getReferencedObject(actionRef);
		if (referencedAction) {
			const actionAttributes = this.modelManager.getChildrenOfType(referencedAction, ModelElementTypes.Attribute) as SymbolDeclaration[];
			const actionAttributesNames = actionAttributes.map(x => x.name);
			inputNames = inputNames.concat(actionAttributesNames);
		}

		return inputNames;
	}
	
	private getAdditionalOutputsForActions(actionCall: TreeNode) {
		const outputNames: string[] = this.getAdditionalOutputsForSpecificAction(actionCall);
		return outputNames;
	}
}