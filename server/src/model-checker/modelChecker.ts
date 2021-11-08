import * as LSP from 'vscode-languageserver';
import { flattenArray } from '../util/array';
import { Reference, ModelElementTypes, SymbolDeclaration, ModelDetailLevel, ObjectIdentifierTypes } from '../model-definition/symbolsAndReferences';
import { NAMES } from '../model-definition/attributes';
import { SymbolAndReferenceManager } from '../symbolAndReferenceManager';
import { removeFilesFromDirectories } from '../util/fs';
import { objectsTypesWhichRequireContext } from '../model-definition/declarations';

type ModelCheckerOptions = {
	maxNumberOfProblems?: number,
	detailLevel: ModelDetailLevel,
	skipFolders: string[],
}
/**
 * The ModelChecker verifies references and returns a list of diagnostics 
 */
export class ModelChecker {
	private diagnostics: LSP.Diagnostic[] = [];
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private static dataInsertOrUpdateActions = new Set(["Insert", "InsertOrUpdate", "Update"].map(x => x.toLowerCase()));
	private static dataSelectActions = new Set(["Select"].map(x => x.toLowerCase()));
	private static infosetCallActions = new Set(["Infoset"].map(x => x.toLowerCase()));
	private static defaultOptions: ModelCheckerOptions = { detailLevel: ModelDetailLevel.ArgumentReferences, skipFolders: [] };
	private static messages = {
		RULECALL_WITHOUT_NAME: () => "Rule call without rule name specified.",
		RULELOOPACTIONCALL_WITHOUT_NAME: () => "RuleLoopAction call without rule name specified.",
		INFOSETCALL_WITHOUT_NAME: () => "Infoset call without infoset name specified.",
		INPUT_NOT_FOUND: (argumentName: string, references: Reference[]) => `Input '${argumentName}' not found for ${ModelChecker.formatReferenceEnumeration(references)}.`,
		OUTPUT_NOT_FOUND: (outputName: string, references: Reference[]) => `Output '${outputName}' not found for ${ModelChecker.formatReferenceEnumeration(references)}.`,
		REFERENCE_NOT_FOUND: (reference: Reference) => `${reference.type} with name '${reference.name}' not found.`,
		REFERENCE_OBSOLETE: (reference: Reference) => `${reference.type} with name '${reference.name}' is marked obsolete.`,
		MANDATORY_INPUT_MISSING: (inputName: string, reference: Reference) => `Mandatory input '${inputName}' for ${reference.type} with name '${reference.name}' not provided.`,
		REFERENCE_CAPITALIZATION: (symbol: SymbolDeclaration, reference: Reference) => `Preferred capitalization for ${reference.type} with name '${reference.name}' is '${symbol.name}'.`,
		NO_REFERENCES_FOUND: (symbol: SymbolDeclaration) => `No references found to ${symbol.type} with name '${symbol.name}'.`,
		SEARCHCOLUMN_ATTRIBUTE_NOT_FOUND: (attribute: Reference, typeRef: Reference) => `Attribute '${attribute.name}' not found in ${typeRef.type} with name '${typeRef.name}'.`,
		VALIDATION_ERROR: (error: string, node: Reference|SymbolDeclaration) => `Error occured when trying to validate ${node.type} with name '${node.name}':${error}.`
	}

	private static formatReferenceEnumeration(referenceAndSubReferences: Reference[]) {
		return referenceAndSubReferences.map(x => `${x.type}: '${x.name}'`).join(" or ");
	}

	constructor(symbolAndReferenceManager: SymbolAndReferenceManager) {
		this.symbolAndReferenceManager = symbolAndReferenceManager;
	}

	public checkAllFiles(options?: ModelCheckerOptions) {
		const diagnosticsPerFile: Record<string, LSP.Diagnostic[]> = {};
		let files = this.symbolAndReferenceManager.getFiles();
		if (options?.skipFolders) {
			files = removeFilesFromDirectories(options.skipFolders, files);
		}
		let count = 0;
		for (const file of files) {
			const diagnostics = this.checkFile(file, options);
			diagnosticsPerFile[file] = diagnostics;
			count += diagnostics.length;
			if (count > (options?.maxNumberOfProblems || Infinity)) { break; }
		}

		return diagnosticsPerFile;
	}

	public checkFile(uri: string, options?: ModelCheckerOptions) {
		this.diagnostics = [];
		const optionsOrDefault: ModelCheckerOptions = options || ModelChecker.defaultOptions;

		const tree = this.symbolAndReferenceManager.getTreeForFile(uri);
		this.walkNodes(tree, optionsOrDefault);

		return this.diagnostics;
	}

	private walkNodes(node: SymbolDeclaration | Reference, options: ModelCheckerOptions) {
		this.verifyNode(node, options);
		const isObsolete = (node.objectType == ObjectIdentifierTypes.Symbol && (node as SymbolDeclaration).isObsolete);
		if (!isObsolete) {
			node.children.forEach(x => this.walkNodes(x, options));
			Object.values(node.attributeReferences).forEach(x => this.verifyNode(x, options));
		}
	}

	private verifyNode(node: SymbolDeclaration | Reference, options: ModelCheckerOptions) {
		if (node.type == ModelElementTypes.Unknown) { return; }
		if (objectsTypesWhichRequireContext.has(node.type)) { return; }
		try{
			switch (node.objectType) {
				case ObjectIdentifierTypes.Symbol: {
					this.verifySymbol(node as SymbolDeclaration, options);
					break;
				}
				case ObjectIdentifierTypes.Reference: {
					this.verifyReference(node as Reference, options);
				}
			}
		}
		catch (error:any){
			this.addError(node.range,ModelChecker.messages.VALIDATION_ERROR(error.message, node));
		}
	}

	private verifyReference(reference: Reference, options: ModelCheckerOptions) {
		let valid = true;
		valid = valid && this.verifyReferencedObjectExists(reference, options);
		switch (reference.type) {
			case ModelElementTypes.Action:
				{
					this.verifyActionCall(reference, valid, options);
					break;
				}
		}
	}

	private verifyReferencedObjectExists(reference: Reference, options: ModelCheckerOptions) {
		const referencedSymbol = this.symbolAndReferenceManager.getReferencedObject(reference);
		const name = reference.name;
		const referenceNotFound = !referencedSymbol && name && !name.startsWith("{");
		if (referenceNotFound) {
			this.addError(reference.range, ModelChecker.messages.REFERENCE_NOT_FOUND(reference));
		}
		if (referencedSymbol && name != referencedSymbol.name && name.toLowerCase() == referencedSymbol.name.toLowerCase() && options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.addInformation(reference.range, ModelChecker.messages.REFERENCE_CAPITALIZATION(referencedSymbol, reference));
		}
		const symbolIsObsolete = referencedSymbol && referencedSymbol.isObsolete;
		if (symbolIsObsolete) {
			this.addError(reference.range, ModelChecker.messages.REFERENCE_OBSOLETE(reference));
		}
		return !symbolIsObsolete && !referenceNotFound;
	}

	//Verify action calls
	private verifyActionCall(reference: Reference, valid: boolean, options: ModelCheckerOptions) {
		if (reference.name.toLowerCase() == "infoset") {
			valid = valid && this.verifyInfosetCall(reference, options);
		}
		if (reference.name.toLowerCase() == "rule") {
			valid = valid && this.verifyRuleCall(reference);
		}
		if (reference.name.toLowerCase() == "ruleloopaction") {
			valid = valid && this.verifyRuleLoopActionCall(reference, options);
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
			const referencedSymbol = this.symbolAndReferenceManager.getReferencedObject(subRef);
			return referencedSymbol ? this.getSymbolInputs(referencedSymbol) : [];
		});
		const inputNames = new Set(flattenArray(referencedSymbolInputs).map(x => x.name));
		this.getAdditionalInputsForAction(reference).forEach(x => { inputNames.add(x); });
		this.getActionArguments(reference).forEach(argument => {
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
			const referencedSymbol = this.symbolAndReferenceManager.getReferencedObject(subRef);
			return referencedSymbol ? this.getSymbolOutputs(referencedSymbol) : [];
		});
		const outputNames = new Set(flattenArray(referencedSymbolOutputs).map(x => x.name));
		this.getAdditionalOutputsForActions(reference).forEach(x => outputNames.add(x));

		this.getActionOutputs(reference).forEach(output => {
			const outputName = output.name;
			if (!outputNames.has(outputName)) {
				this.addWarning(
					output.range, ModelChecker.messages.OUTPUT_NOT_FOUND(outputName, referenceAndSubReferences)
				);
			}
		});
	}

	private verifySymbolIsReferenced(symbol: SymbolDeclaration, options: ModelCheckerOptions) {
		const references = this.symbolAndReferenceManager.getReferencesForSymbol(symbol);
		const noReferencesFound = references.length <= 0;
		if (noReferencesFound && symbol.type != ModelElementTypes.NameSpace && options.detailLevel >= ModelDetailLevel.ArgumentReferences) {
			this.addInformation(symbol.range, ModelChecker.messages.NO_REFERENCES_FOUND(symbol));
		}
	}

	private verifyReferencedObjectsMandatoryInputsProvided(reference: Reference, subRef: Reference) {
		const actionArguments = this.getActionArguments(reference);
		const referencedSymbol = this.symbolAndReferenceManager.getReferencedObject(subRef);
		const argumentNames = new Set(actionArguments.map(x => x.name));
		if (referencedSymbol) {
			const referencedSymbolMandatoryInputs = this.getMandatorySymbolInputs(referencedSymbol);
			referencedSymbolMandatoryInputs.forEach(input => {
				if (!argumentNames.has(input.name)) {
					this.addError(subRef.range, ModelChecker.messages.MANDATORY_INPUT_MISSING(input.name, subRef));
				}
			});
		}
	}

	private verifyReferencedObjectsMandatoryInputsProvidedForRuleLoop(reference: Reference, subRef: Reference) {
		const actionArguments = this.getActionArguments(reference);
		const referencedSymbol = this.symbolAndReferenceManager.getReferencedObject(subRef);
		const argumentNames = new Set(actionArguments.map(x => x.name));
		if (subRef.type == ModelElementTypes.Rule) {
			const infosetRef = reference.attributeReferences[NAMES.ATTRIBUTE_INFOSET];
			const infoset = infosetRef ? this.symbolAndReferenceManager.getReferencedObject(infosetRef) : undefined;
			if (infoset) {
				const query = this.getChildrenOfType(infoset, ModelElementTypes.Search)[0];
				if (query) {
					const typeRef = query.attributeReferences[NAMES.ATTRIBUTE_TYPE];
					if (typeRef) {
						this.getReferencedTypeAttributes(typeRef).forEach(x => argumentNames.add(x));
					}
				}
			} else {
				argumentNames.add(NAMES.RESERVEDINPUT_VALUE);
			}
		}
		if (referencedSymbol) {
			const referencedSymbolMandatoryInputs = this.getMandatorySymbolInputs(referencedSymbol);
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
				this.getReferencedTypeAttributes(typeRef).forEach(x => inputNames.push(x));
			}
		}
		if (this.isDataInsertOrUpdateActions(actionReference)) {
			const typeRef = actionReference.attributeReferences[NAMES.ATTRIBUTE_TYPE];
			if (typeRef) {
				this.getReferencedTypeAttributes(typeRef).forEach(x => inputNames.push(x));
			}
		}
		const referencedAction = this.symbolAndReferenceManager.getReferencedObject(actionReference);
		if (referencedAction) {
			const actionAttributes = this.getChildrenOfType(referencedAction, ModelElementTypes.Attribute);
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
				this.getReferencedTypeAttributes(typeRef).forEach(x => outputNames.push(x));
			}
		}
		if (this.isInfosetCallAction(reference)) {
			const infosetRef = reference.attributeReferences[NAMES.ATTRIBUTE_INFOSET];
			outputNames.push(infosetRef.name);
		}
		return outputNames;
	}

	//Verify symbols declaration
	private verifySymbol(symbol: SymbolDeclaration, options: ModelCheckerOptions) {
		this.verifySymbolIsReferenced(symbol, options);
		switch (symbol.type) {
			case ModelElementTypes.Infoset:
				{
					this.verifyInfosetDeclaration(symbol, options);
					break;
				}
		}
	}

	private verifyInfosetDeclaration(symbol: SymbolDeclaration, options: ModelCheckerOptions) {
		const searches = this.getChildrenOfType(symbol, ModelElementTypes.Search) as SymbolDeclaration[];
		searches.forEach(s => this.verifySearch(s, options));
	}

	private verifySearch(search: SymbolDeclaration, options: ModelCheckerOptions) {
		const searchColumns = this.getChildrenOfType(search, ModelElementTypes.SearchColumn);
		const typeRef = search.attributeReferences[NAMES.ATTRIBUTE_TYPE];
		const typeAttributes = this.getReferencedTypeAttributes(typeRef);
		searchColumns.forEach(sc => {
			const attributeRef = sc.attributeReferences.name;
			if (!typeAttributes.includes(attributeRef.name)) {
				this.addError(attributeRef.range, ModelChecker.messages.SEARCHCOLUMN_ATTRIBUTE_NOT_FOUND(sc, typeRef));
			}
		});
	}

	//Generic
	private isDataSelectAction(reference: Reference) {
		return reference.type == ModelElementTypes.Action && ModelChecker.dataSelectActions.has(reference.name.toLowerCase());
	}

	private isDataInsertOrUpdateActions(reference: Reference) {
		return reference.type == ModelElementTypes.Action && ModelChecker.dataInsertOrUpdateActions.has(reference.name.toLowerCase());
	}
	private isInfosetCallAction(reference: Reference) {
		return reference.type == ModelElementTypes.Action && ModelChecker.infosetCallActions.has(reference.name.toLowerCase());
	}

	private addInformation(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Information);
	}
	private addWarning(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Warning);
	}
	private addError(range: LSP.Range, message: string) {
		this.addDiagnostics(range, message, LSP.DiagnosticSeverity.Error);
	}
	private addDiagnostics(range: LSP.Range, message: string, severity: LSP.DiagnosticSeverity) {
		this.diagnostics.push(
			LSP.Diagnostic.create(range, message, severity)
		);
	}

	private getChildrenOfType(object: Reference | SymbolDeclaration, type: ModelElementTypes): (Reference | SymbolDeclaration)[] {
		const directChilren = object.children.filter(x => (x.type == type));
		const decoratorsOrIncludeBlocks = object.children.filter(
			x => x.type == ModelElementTypes.Decorator
				|| x.type == ModelElementTypes.IncludeBlock
		);

		const decoratedChildren: (Reference | SymbolDeclaration)[] = decoratorsOrIncludeBlocks.flatMap(decoratorOrIncludeBlockRef => {
			const decoratorsOrIncludeBlocks = this.symbolAndReferenceManager.getReferencedObject(decoratorOrIncludeBlockRef);
			return decoratorsOrIncludeBlocks?this.getChildrenOfType(decoratorsOrIncludeBlocks, type):[];
			}
		);
		return [...directChilren, ...decoratedChildren];
	}
	private getActionArguments(actionReference: Reference) {
		return this.getChildrenOfType(actionReference, ModelElementTypes.Input);
	}
	private getActionOutputs(actionReference: Reference) {
		return this.getChildrenOfType(actionReference, ModelElementTypes.Output);
	}
	private getSymbolInputs(symbol: SymbolDeclaration) {
		return symbol.children.filter(x => (x.type == ModelElementTypes.Input));
	}
	private getMandatorySymbolInputs(symbol: SymbolDeclaration) {
		return this.getSymbolInputs(symbol).filter(x => (x.otherAttributes.required));
	}
	private getSymbolOutputs(symbol: SymbolDeclaration) {
		return symbol.children.filter(x => (x.type == ModelElementTypes.Output));
	}

	private getReferencedTypeAttributes(typeRef: Reference): string[] {
		const type = typeRef ? this.symbolAndReferenceManager.getReferencedObject(typeRef) : undefined;
		return type ? this.getTypeAttributes(type) : [];
	}

	private getTypeAttributes(type: SymbolDeclaration): string[] {
		let attributeNames = this.getChildrenOfType(type, ModelElementTypes.Attribute).map(x => x.name);
		const basedOnTypeRef = type.attributeReferences["type"];
		if (basedOnTypeRef) {
			const basedOnType = this.symbolAndReferenceManager.getReferencedObject(basedOnTypeRef);
			if (basedOnType) {
				attributeNames = attributeNames.concat(this.getTypeAttributes(basedOnType));
			}
		} else {
			attributeNames.push(NAMES.RESERVEDINPUT_IID); //Only for lowest level in inheritance to avoid adding iid each time
		}
		return attributeNames;
	}

}