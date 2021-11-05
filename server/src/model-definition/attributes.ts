export const NAMES = {
	ATTRIBUTE_NAME: "name",
	ATTRIBUTE_ATTRIBUTE: "attribute",
	ATTRIBUTE_COMMENT: "comment",
	ATTRIBUTE_DESCRIPTION: "description",
	ATTRIBUTE_EXPRESSION: "expression",
	ATTRIBUTE_VARIABLE: "variable",
	ATTRIBUTE_OPERATOR: "operator",
	ATTRIBUTE_VALUE: "value",
	ATTRIBUTE_RULE: "rulename",
	ATTRIBUTE_FUNCTION: "function",
	ATTRIBUTE_INFOSET: "infoset-name",
	ATTRIBUTE_ONERRORRULE: "onerror",
	ATTRIBUTE_TYPE: "type",
	ATTRIBUTE_LOCALNAME: "local-name",
	ATTRIBUTE_REMOTENAME: "remote-name",
	ATTRIBUTE_REQUIRED: "required",
	ATTRIBUTE_READONLY: "readonly",
	ATTRIBUTE_DATACONVERSION_RULENAME: "RuleName",
	RESERVEDINPUT_IID: "iid",
	RESERVEDINPUT_VALUE: "value",
};

export const ATTRIBUTES_PER_TAG: Record<string, string[]> = {
	"action": [
		NAMES.ATTRIBUTE_NAME
	],
	"argument": [
		NAMES.ATTRIBUTE_LOCALNAME,
		NAMES.ATTRIBUTE_REMOTENAME
	],
	"input": [
		NAMES.ATTRIBUTE_NAME,
		NAMES.ATTRIBUTE_REQUIRED
	],
	"output": [
		NAMES.ATTRIBUTE_LOCALNAME,
		NAMES.ATTRIBUTE_REMOTENAME,
		NAMES.ATTRIBUTE_NAME,
		NAMES.ATTRIBUTE_ATTRIBUTE
	],
	"set-var": [
		NAMES.ATTRIBUTE_NAME,
		NAMES.ATTRIBUTE_EXPRESSION
	],
	"rule": [
		NAMES.ATTRIBUTE_NAME,
		NAMES.ATTRIBUTE_COMMENT
	],
	"if": [
		NAMES.ATTRIBUTE_DESCRIPTION,
	],
	"condition": [
		NAMES.ATTRIBUTE_VARIABLE,
		NAMES.ATTRIBUTE_OPERATOR,
		NAMES.ATTRIBUTE_VALUE
	]
};

const ATTRIBUTES_SET = new Set(
	Object.keys(ATTRIBUTES_PER_TAG).reduce((res: string[], x: string) => { return res.concat(ATTRIBUTES_PER_TAG[x]); }, [])
);

export function isKnownAttribute(word: string): boolean {
	return ATTRIBUTES_SET.has(word);
}