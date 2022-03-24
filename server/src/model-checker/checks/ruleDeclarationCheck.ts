import { NAMES } from '../../model-definition/types/constants';
import { SymbolDeclaration, Attribute, TreeNode } from '../../model-definition/types/tree';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';
import { ModelDetailLevel, ModelElementTypes } from '../../model-definition/types/definitions';

export class RuleDeclarationCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Rule;
	protected detailLevel: ModelDetailLevel = ModelDetailLevel.All;
	protected matchCondition = undefined
	
	private ruleLocalNames: Attribute[] = [];
	private ruleLocalNameReferences: Attribute[] = [];

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode, options: ModelCheckerOptions) {
		this.ruleLocalNames = [];
		this.ruleLocalNameReferences = [];
		this.verifyRuleDeclaration(node as SymbolDeclaration, options);
	}

	private verifyRuleDeclaration(rule: SymbolDeclaration, options: ModelCheckerOptions) {
		//Walk over child nodes and process
		rule.children.forEach(child => {
			this.walkNodesAndCheck(child, options);
		});

		//Check all localNames were referenced?
		this.ruleLocalNames.forEach(localName => {
			if (!this.ruleLocalNameReferences.find(x => x.value == localName.value)) {
				this.addMessage(localName.range, "DC0003", CHECKS_MESSAGES.RULE_LOCALNAME_NOT_REFERENCED(localName.value));
			}
		});
	}

	private walkNodesAndCheck(node: TreeNode, options: ModelCheckerOptions) {
		switch (node.type) {
			case ModelElementTypes.Input:
				{
					this.processLocalNameDefinitionAttribute(node, NAMES.ATTRIBUTE_NAME);
					break;
				}
			case ModelElementTypes.Output:
				{
					this.processLocalNameReferenceAttribute(node, NAMES.ATTRIBUTE_ATTRIBUTE);
					this.processExpressionAttribute(node, NAMES.ATTRIBUTE_EXPRESSION);
					break;
				}
			case ModelElementTypes.Argument:
				{
					this.processLocalNameReferenceActionArgument(node);
					this.processExpressionAttribute(node, NAMES.ATTRIBUTE_EXPRESSION);
					break;
				}
			case ModelElementTypes.ActionCallOutput:
				{
					this.processLocalNameDefinitionAttribute(node, NAMES.ATTRIBUTE_LOCALNAME);
					break;
				}
			case ModelElementTypes.SetVar:
				{
					this.processExpressionAttribute(node, NAMES.ATTRIBUTE_EXPRESSION);
					this.processLocalNameDefinitionAttribute(node, NAMES.ATTRIBUTE_NAME);
					break;
				}
			case ModelElementTypes.Switch:
				{
					this.processLocalNameReferenceAttribute(node, NAMES.ATTRIBUTE_VARIABLE);
					break;
				}
			case ModelElementTypes.Condition:
				{
					this.processLocalNameReferenceAttribute(node, NAMES.ATTRIBUTE_VARIABLE);
					this.processExpressionAttribute(node, NAMES.ATTRIBUTE_EXPRESSION);
					break;
				}
		}

		//Walk over child nodes
		node.children.forEach(child => {
			this.walkNodesAndCheck(child, options);
		});
	}

	private processLocalNameDefinitionAttribute(node: TreeNode, attributeName: string) {
		const localName = node.attributes[attributeName];
		if (localName) {
			this.ruleLocalNames.push(localName);
		}
	}

	private processLocalNameReferenceActionArgument(node: TreeNode) {
		const value = node.attributes[NAMES.ATTRIBUTE_VALUE];
		const expression = node.attributes[NAMES.ATTRIBUTE_EXPRESSION];
		//Only consider the local name attribute a reference to a local name if no value/expression are filled
		if ((!value && !expression) || (value && value.value == "" && expression && expression.value == "")) {
			this.processLocalNameReferenceAttribute(node, NAMES.ATTRIBUTE_LOCALNAME);
		}
	}

	private processExpressionAttribute(node: TreeNode, attributeName: string) {
		const expression = node.attributes[attributeName];
		if (expression) {
			this.getExpressionVariablesAsAttributes(expression)?.forEach(expressionVariableAsAttribute => {
				this.processLocalNameReference(expressionVariableAsAttribute);
			});
		}
	}

	private processLocalNameReferenceAttribute(node: TreeNode, attributeName: string) {
		const localName = node.attributes[attributeName];
		this.processLocalNameReference(localName);
	}

	private processLocalNameReference(localName: Attribute) {
		if (localName) {
			this.checkLocalNameIsDefined(localName);
			this.ruleLocalNameReferences.push(localName);
		}
	}

	private checkLocalNameIsDefined(localName: Attribute) {
		if (!this.ruleLocalNames.find(x => (x.value == localName.value))) {
			this.addMessage(localName.range, "DC0004", CHECKS_MESSAGES.RULE_LOCALNAME_NOT_FOUND(localName.value));
		}
	}

	private getExpressionVariablesAsAttributes(expression: Attribute) {
		const expressionVariables = Array.from(expression.value.matchAll(/\{([\w]+)\}/g));
		return expressionVariables?.map(expressionVariableMatch => {
			const variableName = expressionVariableMatch[1] || "";
			return {
				name: "ExpressionVariable",
				value: variableName,
				range: expression.range,
				fullRange: expression.fullRange
			};
		});
	}
}