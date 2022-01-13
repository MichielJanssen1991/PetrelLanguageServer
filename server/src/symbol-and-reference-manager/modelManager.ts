import { NAMES } from '../model-definition/constants';
import { ModelElementTypes, Reference, SymbolDeclaration, TreeNode } from '../model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from './symbolAndReferenceManager';

/**
 * The ModelManager extends the SymbolAndReferenceManager with knowledge about the petrel model. It provides more advanced querying on the model.
 */
export class ModelManager extends SymbolAndReferenceManager {
	public getChildrenOfType(object: TreeNode | SymbolDeclaration, type: ModelElementTypes): (TreeNode | SymbolDeclaration)[] {
		const directChilren = object.children.filter(x => (x.type == type));
		const decoratorsOrIncludeBlocks = object.children.filter(
			x => (x.type == ModelElementTypes.Decorator
				|| x.type == ModelElementTypes.IncludeBlock)
		);

		const decoratedChildren: (TreeNode | SymbolDeclaration)[] = decoratorsOrIncludeBlocks.flatMap(decoratorOrIncludeBlock => {
			const decoratorOrIncludeBlockRef = decoratorOrIncludeBlock.attributes["name"] as Reference;
			const decoratorsOrIncludeBlocks = decoratorOrIncludeBlockRef ? this.getReferencedObject(decoratorOrIncludeBlockRef) : undefined;
			return decoratorsOrIncludeBlocks ? this.getChildrenOfType(decoratorsOrIncludeBlocks, type) : [];
		});
		return [...directChilren, ...decoratedChildren];
	}

	public getActionArguments(actionCall: TreeNode) {
		return this.getChildrenOfType(actionCall, ModelElementTypes.Argument);
	}
	public getActionArgumentRemoteName(actionArgument: TreeNode) {
		return (actionArgument.attributes[NAMES.ATTRIBUTE_REMOTENAME]?.value || actionArgument.attributes[NAMES.ATTRIBUTE_LOCALNAME]?.value || "");
	}
	public getActionArgumentLocalName(actionArgument: TreeNode) {
		return actionArgument.attributes[NAMES.ATTRIBUTE_LOCALNAME]?.value || "";
	}
	public getActionCallOutputs(actionCall: TreeNode) {
		return this.getChildrenOfType(actionCall, ModelElementTypes.ActionCallOutput);
	}
	public getSymbolInputs(symbol: SymbolDeclaration) {
		return symbol.children.filter(x => (x.type == ModelElementTypes.Input));
	}
	public getMandatorySymbolInputs(symbol: SymbolDeclaration) {
		return this.getSymbolInputs(symbol).filter(x => (x.attributes.required));
	}
	public getSymbolOutputs(symbol: SymbolDeclaration) {
		return symbol.children.filter(x => (x.type == ModelElementTypes.Output));
	}

	public getReferencedTypeAttributes(typeRef: Reference): string[] {
		const type = typeRef ? this.getReferencedObject(typeRef) : undefined;
		return type ? this.getTypeAttributes(type) : [];
	}

	public getTypeAttributes(type: SymbolDeclaration): string[] {
		let attributeNames = this.getChildrenOfType(type, ModelElementTypes.Attribute).map(x => (x as SymbolDeclaration).name);
		const basedOnTypeRef = type.attributes["type"] as Reference;
		const basedOnType = basedOnTypeRef ? this.getReferencedObject(basedOnTypeRef) : undefined;
		if (basedOnType) {
			attributeNames = attributeNames.concat(this.getTypeAttributes(basedOnType));
		}
		else {
			attributeNames.push(NAMES.RESERVEDINPUT_IID); //Only for lowest level in inheritance to avoid adding iid each time
		}
		return attributeNames;
	}
}