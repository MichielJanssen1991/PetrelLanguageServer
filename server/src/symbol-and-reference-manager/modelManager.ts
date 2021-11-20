import { NAMES } from '../model-definition/constants';
import { IsSymbolOrReference, ModelElementTypes, Reference, SymbolDeclaration } from '../model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from './symbolAndReferenceManager';

/**
 * The ModelManager extends the SymbolAndReferenceManager with knowledge about the petrel model. It provides more advanced querying on the model.
 */
export class ModelManager extends SymbolAndReferenceManager{
	public getChildrenOfType(object: Reference | SymbolDeclaration, type: ModelElementTypes): (Reference | SymbolDeclaration)[] {
		const directChilren = object.children.filter(x => (x.type == type));
		const decoratorsOrIncludeBlocks = object.children.filter(
			x => x.type == ModelElementTypes.Decorator
				|| x.type == ModelElementTypes.IncludeBlock
				|| x.objectType == IsSymbolOrReference.Reference
		) as Reference[];

		const decoratedChildren: (Reference | SymbolDeclaration)[] = decoratorsOrIncludeBlocks.flatMap(decoratorOrIncludeBlockRef => {
			const decoratorsOrIncludeBlocks = this.getReferencedObject(decoratorOrIncludeBlockRef);
			return decoratorsOrIncludeBlocks?this.getChildrenOfType(decoratorsOrIncludeBlocks, type):[];
			}
		);
		return [...directChilren, ...decoratedChildren];
	}

	public getActionArguments(actionReference: Reference) {
		return this.getChildrenOfType(actionReference, ModelElementTypes.Input);
	}
	public getActionOutputs(actionReference: Reference) {
		return this.getChildrenOfType(actionReference, ModelElementTypes.Output);
	}
	public getSymbolInputs(symbol: SymbolDeclaration) {
		return symbol.children.filter(x => (x.type == ModelElementTypes.Input));
	}
	public getMandatorySymbolInputs(symbol: SymbolDeclaration) {
		return this.getSymbolInputs(symbol).filter(x => (x.otherAttributes.required));
	}
	public getSymbolOutputs(symbol: SymbolDeclaration) {
		return symbol.children.filter(x => (x.type == ModelElementTypes.Output));
	}

	public getReferencedTypeAttributes(typeRef: Reference): string[] {
		const type = typeRef ? this.getReferencedObject(typeRef) : undefined;
		return type ? this.getTypeAttributes(type) : [];
	}

	public getTypeAttributes(type: SymbolDeclaration): string[] {
		let attributeNames = this.getChildrenOfType(type, ModelElementTypes.Attribute).map(x => x.name);
		const basedOnTypeRef = type.attributeReferences["type"];
		if (basedOnTypeRef) {
			const basedOnType = this.getReferencedObject(basedOnTypeRef);
			if (basedOnType) {
				attributeNames = attributeNames.concat(this.getTypeAttributes(basedOnType));
			}
		} else {
			attributeNames.push(NAMES.RESERVEDINPUT_IID); //Only for lowest level in inheritance to avoid adding iid each time
		}
		return attributeNames;
	}
}