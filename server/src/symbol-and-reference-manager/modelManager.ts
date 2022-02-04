import { NAMES } from '../model-definition/constants';
import { ModelElementTypes, Reference, SymbolDeclaration, TreeNode } from '../model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from './symbolAndReferenceManager';

/**
 * The ModelManager extends the SymbolAndReferenceManager with knowledge about the petrel model. It provides more advanced querying on the model.
 */
export class ModelManager extends SymbolAndReferenceManager {
	public getChildrenOfType(object: TreeNode | SymbolDeclaration, type: ModelElementTypes): (TreeNode | SymbolDeclaration)[] {
		const directChildren = object.children.filter(x => (x.type == type));
		
		const includedChildren: (TreeNode | SymbolDeclaration)[] = object.children.filter(c=>c.type == ModelElementTypes.Include).flatMap(c => {
			const includeBlockRef = c.attributes["block"] as Reference;
			const decoratorsOrIncludeBlocks = includeBlockRef ? this.getReferencedObject(includeBlockRef) : undefined;
			return decoratorsOrIncludeBlocks ? this.getChildrenOfType(decoratorsOrIncludeBlocks, type) : [];
		});

		const decorationsGroupChildren = object.children.filter(d=>d.type == ModelElementTypes.Decorations).flatMap(d=>{
			return this.getChildrenOfType(d, type);
		});
		
		const decorationChildren = object.children.filter(d=>d.type == ModelElementTypes.Decoration).flatMap(d=>{
			const decoratorRef = d.attributes["name"] as Reference;
			const decorator = decoratorRef ? this.getReferencedObject(decoratorRef) : undefined;
			return decorator ? this.getChildrenOfType(decorator, type) : [];
		});
				
		const targetChildren = object.children.filter(d=>d.type == ModelElementTypes.Target).flatMap(d=>{
			if (d.attributes["meta-name"].value == type){
				return this.getChildrenOfType(d, type);
			}
			return [];			
		});		
		
		return [...directChildren, ...includedChildren, ...decorationChildren, ...decorationsGroupChildren, ...targetChildren];
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