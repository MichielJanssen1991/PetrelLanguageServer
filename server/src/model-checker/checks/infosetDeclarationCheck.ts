import { NAMES } from '../../model-definition/constants';
import { ModelElementTypes, IsSymbolOrReference, SymbolDeclaration, TreeNode, Reference } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';
import { attributeValueIsAVariable } from '../../util/other';

export class InfosetDeclarationCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Infoset
	protected objectType = IsSymbolOrReference.Symbol
	protected matchCondition = undefined
	private infosetInputs:string[] = [];

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

	private verifySearch(search: SymbolDeclaration, options: ModelCheckerOptions) {
		const searchColumns = this.modelManager.getChildrenOfType(search, ModelElementTypes.SearchColumn) as TreeNode[];
		const typeRef = search.attributeReferences[NAMES.ATTRIBUTE_TYPE];
		if (!attributeValueIsAVariable(typeRef.name)) { //Do not check when type name is a variable
			const typeAttributes = this.modelManager.getReferencedTypeAttributes(typeRef);
			searchColumns.forEach(sc => {
				const attributeRef = sc.attributeReferences.name;
				const attributeName = attributeRef.value;
				if (!attributeValueIsAVariable(attributeName)) {
					if (!typeAttributes.includes(attributeName)) {
						this.addError(attributeRef.range, CHECKS_MESSAGES.SEARCHCOLUMN_ATTRIBUTE_NOT_FOUND(attributeRef, typeRef));
					}
				}
				else{
					const attributeVariableName = attributeName.replace("{","").replace("}","");
					if (!this.infosetInputs.includes(attributeVariableName)) {
						this.addError(attributeRef.range, CHECKS_MESSAGES.SEARCHCOLUMN_ATTRIBUTE_VARIABLE_NOT_FOUND(attributeVariableName));
					}
				}
			});
		}
	}
}