import { Reference, SymbolDeclaration} from '../model-definition/symbolsAndReferences';

export const CHECKS_MESSAGES = {
	RULECALL_WITHOUT_NAME: () => "Rule call without rule name specified.",
	RULELOOPACTIONCALL_WITHOUT_NAME: () => "RuleLoopAction call without rule name specified.",
	INFOSETCALL_WITHOUT_NAME: () => "Infoset call without infoset name specified.",
	INPUT_NOT_FOUND: (argumentName: string, references: Reference[]) => `Input '${argumentName}' not found for ${formatReferenceEnumeration(references)}.`,
	OUTPUT_NOT_FOUND: (outputName: string, references: Reference[]) => `Output '${outputName}' not found for ${formatReferenceEnumeration(references)}.`,
	REFERENCE_NOT_FOUND: (reference: Reference) => `${reference.type} with name '${reference.value}' not found.`,
	REFERENCE_OBSOLETE: (reference: Reference) => `${reference.type} with name '${reference.value}' is marked obsolete.`,
	MANDATORY_INPUT_MISSING: (inputName: string, reference: Reference) => `Mandatory input '${inputName}' for ${reference.type} with name '${reference.value}' not provided.`,
	REFERENCE_CAPITALIZATION: (symbol: SymbolDeclaration, reference: Reference) => `Preferred capitalization for ${reference.type} with name '${reference.value}' is '${symbol.name}'.`,
	NO_REFERENCES_FOUND: (symbol: SymbolDeclaration) => `No references found to ${symbol.type} with name '${symbol.name}'.`,
	SEARCHCOLUMN_ATTRIBUTE_NOT_FOUND: (attribute: Reference, typeRef: Reference) => `Attribute '${attribute.value}' not found in ${typeRef.type} with name '${typeRef.value}'.`,
	SEARCHCOLUMN_ATTRIBUTE_VARIABLE_NOT_FOUND: (attributeName: string) => `Attribute variable '${attributeName}' not found in infoset.`,
	VALIDATION_ERROR: (error: string, node: SymbolDeclaration) => `Error occured when trying to validate ${node.type} with name '${node.name}':${error}.`,
	RULE_LOCALNAME_NOT_FOUND: (localName: string) => `Local name '${localName}' is not defined.`,
	RULE_LOCALNAME_NOT_REFERENCED: (localName: string) => `Local name '${localName}' is not referenced.`,
	RULE_OUTPUT_ATTRIBUTE_NOT_FOUND: (name: string) => `Attribute '${name}' is not defined.`
};

function formatReferenceEnumeration(referenceAndSubReferences: Reference[]) {
	return referenceAndSubReferences.map(x => `${x.type}: '${x.value}'`).join(" or ");
}