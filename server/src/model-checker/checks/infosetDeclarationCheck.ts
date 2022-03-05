import { NAMES } from '../../model-definition/types/constants';
import { SymbolDeclaration, TreeNode, Reference } from '../../model-definition/types/tree';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';
import { attributeValueIsAVariable } from '../../util/other';
import { ModelDetailLevel, ModelElementTypes } from '../../model-definition/types/definitions';

export class InfosetDeclarationCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Infoset
	protected matchCondition = undefined
	private infosetInputs: string[] = [];
	protected detailLevel: ModelDetailLevel = ModelDetailLevel.Declarations;

	constructor(modelManager: ModelManager) {
		super(modelManager);
	}

	protected checkInternal(node: TreeNode, options: ModelCheckerOptions) {
		this.infosetInputs = [];
		this.verifyInfosetDeclaration(node as SymbolDeclaration, options);
	}

	private verifyInfosetDeclaration(symbol: SymbolDeclaration, options: ModelCheckerOptions) {
		this.infosetInputs = this.modelManager.getChildrenOfType(symbol, ModelElementTypes.Input).map(input => (input as SymbolDeclaration).name);

		const searches = this.modelManager.getChildrenOfType(symbol, ModelElementTypes.Search) as SymbolDeclaration[];
		searches.forEach(s => this.verifySearch(s, options));
	}

	private verifySearch(search: TreeNode, options: ModelCheckerOptions) {
		const searchColumns = this.modelManager.getChildrenOfType(search, ModelElementTypes.SearchColumn) as TreeNode[];
		const typeRef = search.attributes[NAMES.ATTRIBUTE_TYPE] as Reference;
		if (!attributeValueIsAVariable(typeRef.value)) { //Do not check when type name is a variable
			const typeAttributes = this.modelManager.getReferencedTypeAttributes(typeRef);
			searchColumns.forEach(sc => {
				const attributeRef = sc.attributes.name as Reference;
				const attributeName = attributeRef.value;
				//Check attributes which are not a variable
				if (!attributeValueIsAVariable(attributeName)) {
					if (!typeAttributes.includes(attributeName)) {
						this.addMessage(attributeRef.range, "DC0001", CHECKS_MESSAGES.SEARCHCOLUMN_ATTRIBUTE_NOT_FOUND(attributeRef, typeRef));
					}
				}
				//Check attributes which are a variable e.g. {AttributeName}
				else {
					const attributeVariableName = attributeName.replace("{", "").replace("}", "");
					if (!this.infosetInputs.includes(attributeVariableName)) {
						this.addMessage(attributeRef.range, "DC0002", CHECKS_MESSAGES.SEARCHCOLUMN_ATTRIBUTE_VARIABLE_NOT_FOUND(attributeVariableName));
					}
				}
			});
		}

		//Check searches of subqueries
		const inSubQueryConditions = this.modelManager.getChildrenOfType(search, ModelElementTypes.In) as TreeNode[];
		inSubQueryConditions.forEach(inSubQueryCondition => {
			const subSearches = this.modelManager.getChildrenOfType(inSubQueryCondition, ModelElementTypes.Search) as TreeNode[];
			subSearches.forEach(s => this.verifySearch(s, options));
		});
	}
}