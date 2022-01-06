import { NAMES } from '../../model-definition/constants';
import { ModelElementTypes, IsSymbolOrReference, SymbolDeclaration, Attribute, TreeNode, ModelDetailLevel } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';

export class RuleDeclarationCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Rule;
	protected detailLevel: ModelDetailLevel = ModelDetailLevel.All;
	protected objectType = IsSymbolOrReference.Symbol
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
		const ruleInputs = this.modelManager.getChildrenOfType(rule, ModelElementTypes.Input) as SymbolDeclaration[];
		const ruleOutputs = this.modelManager.getChildrenOfType(rule, ModelElementTypes.Output) as SymbolDeclaration[];

		//Initialize local names with rule inputs
		this.ruleLocalNames = ruleInputs.map(input => {
			return {
				name: "name",
				value: input.name,
				range: input.range,
				fullRange: input.fullRange
			};
		});

		//Walk over child nodes which are not inputs or outputs
		rule.children.filter(child => child.type != ModelElementTypes.Input && child.type != ModelElementTypes.Output).forEach(child => {
			this.walkNodesAndCheck(child, options);
		});

		//Add output to local name references
		ruleOutputs.forEach(output => {
			const attribute = output.attributes[NAMES.ATTRIBUTE_ATTRIBUTE];
			if (attribute) {
				const localNameRefInOutput = {
					name: "name",
					value: output.attributes[NAMES.ATTRIBUTE_ATTRIBUTE].value,
					range: output.range,
					fullRange: output.fullRange
				};
				this.ruleLocalNameReferences.push(localNameRefInOutput);
			}
		});

		//Check all localNames where referenced?
		this.ruleLocalNames.forEach(localName => {
			if (!this.ruleLocalNameReferences.find(x => x.value == localName.value)) {
				this.addWarning(localName.range, CHECKS_MESSAGES.RULE_LOCALNAME_NOT_REFERENCED(localName.value));
			}
		});

		//Check all outputs are defined?
		ruleOutputs.forEach(output => {
			const outputAttributeName = output.attributes[NAMES.ATTRIBUTE_ATTRIBUTE].value;
			if (!this.ruleLocalNames.find(x => x.value == outputAttributeName)) {
				this.addWarning(output.range, CHECKS_MESSAGES.RULE_OUTPUT_ATTRIBUTE_NOT_FOUND(outputAttributeName));
			}
		});
	}

	private walkNodesAndCheck(node: TreeNode, options: ModelCheckerOptions) {
		switch (node.type) {
			case ModelElementTypes.Argument:
				{
					const localName = node.attributes[NAMES.ATTRIBUTE_LOCALNAME];
					this.processLocalNameReference(localName);

					const expression = node.attributes[NAMES.ATTRIBUTE_EXPRESSION];
					this.processExpression(expression);
					break;
				}
			case ModelElementTypes.ActionOutput:
				{
					const localName = node.attributes[NAMES.ATTRIBUTE_LOCALNAME];
					this.processLocalNameDefinition(localName);
					break;
				}
			case ModelElementTypes.SetVar:
				{
					const expression = node.attributes[NAMES.ATTRIBUTE_EXPRESSION];
					this.processExpression(expression);

					const localName = node.attributes[NAMES.ATTRIBUTE_NAME];
					this.processLocalNameDefinition(localName);
					break;
				}
			case ModelElementTypes.Switch:
				{
					const localName = node.attributes[NAMES.ATTRIBUTE_VARIABLE];
					this.processLocalNameReference(localName);
					break;
				}
			case ModelElementTypes.Condition:
				{
					const localName = node.attributes[NAMES.ATTRIBUTE_VARIABLE];
					this.processLocalNameReference(localName);
					break;
				}
		}

		//Walk over child nodes
		node.children.forEach(child => {
			this.walkNodesAndCheck(child, options);
		});
	}

	private processLocalNameDefinition(localName: Attribute) {
		if (localName) {
			this.ruleLocalNames.push(localName);
		}
	}

	private processExpression(expression: Attribute) {
		if (expression) {
			this.getExpressionVariablesAsAttributes(expression)?.forEach(expressionVariableAsAttribute => {
				this.processLocalNameReference(expressionVariableAsAttribute);
			});
		}
	}

	private processLocalNameReference(localName: Attribute) {
		if (localName) {
			this.checkLocalNameIsDefined(localName);
			this.ruleLocalNameReferences.push(localName);
		}
	}

	private checkLocalNameIsDefined(localName: Attribute) {
		if (!this.ruleLocalNames.find(x => (x.value == localName.value))) {
			this.addWarning(localName.range, CHECKS_MESSAGES.RULE_LOCALNAME_NOT_FOUND(localName.value));
		}
	}

	private getExpressionVariablesAsAttributes(expression: Attribute) {
		const expressionVariables = Array.from(expression.value.matchAll(/\{([\w]+)\}/g));
		return expressionVariables?.map(expressionVariableMatch => {
			const groups = expressionVariableMatch.groups;
			const variableName = groups ? groups[0] : "";
			return {
				name: "ExpressionVariable",
				value: variableName,
				range: expression.range,
				fullRange: expression.fullRange
			};
		});
	}
}