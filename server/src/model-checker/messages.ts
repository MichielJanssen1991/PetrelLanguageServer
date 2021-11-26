import { Reference, SymbolDeclaration } from '../model-definition/symbolsAndReferences';

export const CHECKS_MESSAGES = {
	RULECALL_WITHOUT_NAME: () => "Rule call without rule name specified.",
	RULELOOPACTIONCALL_WITHOUT_NAME: () => "RuleLoopAction call without rule name specified.",
	INFOSETCALL_WITHOUT_NAME: () => "Infoset call without infoset name specified.",
	INPUT_NOT_FOUND: (argumentName: string, references: Reference[]) => `Input '${argumentName}' not found for ${formatReferenceEnumeration(references)}.`,
	OUTPUT_NOT_FOUND: (outputName: string, references: Reference[]) => `Output '${outputName}' not found for ${formatReferenceEnumeration(references)}.`,
	REFERENCE_NOT_FOUND: (reference: Reference) => `${reference.type} with name '${reference.name}' not found.`,
	REFERENCE_OBSOLETE: (reference: Reference) => `${reference.type} with name '${reference.name}' is marked obsolete.`,
	MANDATORY_INPUT_MISSING: (inputName: string, reference: Reference) => `Mandatory input '${inputName}' for ${reference.type} with name '${reference.name}' not provided.`,
	REFERENCE_CAPITALIZATION: (symbol: SymbolDeclaration, reference: Reference) => `Preferred capitalization for ${reference.type} with name '${reference.name}' is '${symbol.name}'.`,
	NO_REFERENCES_FOUND: (symbol: SymbolDeclaration) => `No references found to ${symbol.type} with name '${symbol.name}'.`,
	SEARCHCOLUMN_ATTRIBUTE_NOT_FOUND: (attribute: Reference, typeRef: Reference) => `Attribute '${attribute.name}' not found in ${typeRef.type} with name '${typeRef.name}'.`,
	SEARCHCOLUMN_ATTRIBUTE_VARIABLE_NOT_FOUND: (attributeName: string) => `Attribute variable '${attributeName}' not found in infoset.`,
	VALIDATION_ERROR: (error: string, node: Reference | SymbolDeclaration) => `Error occured when trying to validate ${node.type} with name '${node.name}':${error}.`
};

function formatReferenceEnumeration(referenceAndSubReferences: Reference[]) {
	return referenceAndSubReferences.map(x => `${x.type}: '${x.name}'`).join(" or ");
}