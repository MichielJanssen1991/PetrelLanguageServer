import { NAMES } from '../../model-definition/constants';
import { ModelElementTypes, IsSymbolOrReference, SymbolDeclaration, SymbolOrReference, Reference } from '../../model-definition/symbolsAndReferences';
import { ModelManager } from '../../symbol-and-reference-manager/modelManager';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';
import { CHECKS_MESSAGES } from '../messages';

export class InfosetDeclarationCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.Infoset
	protected objectType = IsSymbolOrReference.Symbol
	protected matchCondition = undefined

	constructor(modelManager: ModelManager) {
		super(modelManager);

	}

	protected checkInternal(node: SymbolOrReference, options: ModelCheckerOptions) {
		this.verifyInfosetDeclaration(node as SymbolDeclaration, options);
	}

	private verifyInfosetDeclaration(symbol: SymbolDeclaration, options: ModelCheckerOptions) {
		const searches = this.modelManager.getChildrenOfType(symbol, ModelElementTypes.Search) as SymbolDeclaration[];
		searches.forEach(s => this.verifySearch(s, options));
	}

	private verifySearch(search: SymbolDeclaration, options: ModelCheckerOptions) {
		const searchColumns = this.modelManager.getChildrenOfType(search, ModelElementTypes.SearchColumn) as Reference[];
		const typeRef = search.attributeReferences[NAMES.ATTRIBUTE_TYPE];
		const typeAttributes = this.modelManager.getReferencedTypeAttributes(typeRef);
		searchColumns.forEach(sc => {
			const attributeRef = sc.attributeReferences.name;
			if (!typeAttributes.includes(attributeRef.name)) {
				this.addError(attributeRef.range, CHECKS_MESSAGES.SEARCHCOLUMN_ATTRIBUTE_NOT_FOUND(sc, typeRef));
			}
		});
	}

}