import { NAMES } from '../../model-definition/constants';
import { ModelElementTypes, IsSymbolOrReference, SymbolDeclaration, Attribute, TreeNode } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';

export class RuleDeclarationCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Rule
	protected objectType = IsSymbolOrReference.Symbol
	protected matchCondition = undefined
	private ruleLocalNames: Attribute[] = [];
	private ruleLocalNameReferences: Attribute[] = [];

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode, options: ModelCheckerOptions) {
		this.ruleLocalNames=[];
		this.ruleLocalNameReferences=[];
		this.verifyRuleDeclaration(node as SymbolDeclaration, options);
	}

	private verifyRuleDeclaration(rule: SymbolDeclaration, options: ModelCheckerOptions) {
		const ruleInputs = this.modelManager.getChildrenOfType(rule, ModelElementTypes.Input);
		const ruleOutputs = this.modelManager.getChildrenOfType(rule, ModelElementTypes.Output);

		//Initialize local names with rule inputs
		this.ruleLocalNames = ruleInputs.map(input => { return { name: "name", value: this.modelManager.getActionArgumentLocalName(input), range: input.range, fullRange: input.fullRange }; });

		//Walk over child nodes which are not inputs or outputs
		rule.children.filter(child => child.type != ModelElementTypes.Input && child.type != ModelElementTypes.Output).forEach(child => {
			this.walkNodesAndCheck(child, options);
		});

		//Add output to local name references
		ruleOutputs.forEach(output => {
			const localNameRefInOutput = { name: "name", value: output.otherAttributes[NAMES.ATTRIBUTE_ATTRIBUTE].value, range: output.range, fullRange: output.fullRange };
			this.ruleLocalNameReferences.push(localNameRefInOutput);
		});

		//Check all localNames where referenced?
		this.ruleLocalNames.forEach(localName => {
			if (!this.ruleLocalNameReferences.find(x => x.value == localName.value)) {
				this.addWarning(localName.range, CHECKS_MESSAGES.RULE_LOCALNAME_NOT_REFERENCED(localName.value));
			}
		});

		//Check all outputs are defined?
		ruleOutputs.forEach(output => {
			const outputAttributeName = output.otherAttributes[NAMES.ATTRIBUTE_ATTRIBUTE].value;
			if (!this.ruleLocalNameReferences.find(x => x.value == outputAttributeName)) {
				this.addWarning(output.range, CHECKS_MESSAGES.RULE_OUTPUT_ATTRIBUTE_NOT_FOUND(outputAttributeName));
			}
		});
	}

	private walkNodesAndCheck(node: TreeNode, options: ModelCheckerOptions) {
		switch (node.type) {
			case ModelElementTypes.Argument:
				{
					const localName = node.otherAttributes[NAMES.ATTRIBUTE_LOCALNAME];
					const expression = node.otherAttributes[NAMES.ATTRIBUTE_EXPRESSION];

					if (localName) {
						if (!this.ruleLocalNames.find(x => (x.value == localName.value))) {
							this.addWarning(localName.range, CHECKS_MESSAGES.RULE_LOCALNAME_NOT_FOUND(localName.value));
						}
						this.ruleLocalNameReferences.push(localName);
					}

					//TODO: Parse expressions for references
					break;
				}
			case ModelElementTypes.Output:
				{
					const localName = node.otherAttributes[NAMES.ATTRIBUTE_LOCALNAME];
					if (localName) {
						this.ruleLocalNames.push(localName);
					}
					break;
				}
		}

		//Walk over child nodes
		node.children.forEach(child => {
			this.walkNodesAndCheck(child, options);
		});
	}
}