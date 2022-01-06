import { ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { Attribute, AttributeTypes, ChildReference, Definition, ModelDetailLevel, ModelElementTypes, TreeNode } from '../../model-definition/symbolsAndReferences';
import { ModelCheck } from '../modelCheck';

export class ModelDefinitionCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All;
	protected matchCondition?: ((node: TreeNode) => boolean) | undefined;
	private allNodeAttributes: Attribute[] = [];
	protected detailLevel: ModelDetailLevel = ModelDetailLevel.All;

	protected checkInternal(node: TreeNode): void {
		const modelFileContext = this.modelManager.getModelFileContextForFile(node.uri);
		const tagDefinition = this.getElementDefinition(modelFileContext, node, node);
		
		this.allNodeAttributes = Object.values(node.attributes);
		
		if (!(node.type==ModelElementTypes.Document || node.tag == ModelElementTypes.Document.toLowerCase())){
			if (tagDefinition){
				this.checkChildOccurrences(node, tagDefinition);
				this.checkAttributeOccurrences(node, tagDefinition);
				this.checkAttributeValues(node, tagDefinition);
			} else {
				this.addError(node.range, `No definition found for tag: '${node.tag}'`);
			}
		}
		
	}

	private getElementDefinition(modelFileContext: ModelFileContext, searchFor: TreeNode , searchIn: TreeNode, depth = 0): Definition | undefined{
		const elementDefinition = this.modelDefinitionManager.getModelDefinitionForTagAndType(modelFileContext, searchFor.tag, searchIn.type);
		if (!elementDefinition && searchIn.parent && depth < 4 ){
			// get the definition of the parent tag without specific filtering
			const parentElementDef = this.modelDefinitionManager.getModelDefinitionForTagAndType(modelFileContext, searchIn.parent.tag, ModelElementTypes.All);
			
			// if parent is something else than the definition prescribes (for example include-block), the tag will be changed to the referred element
			const childDef: ChildReference = (parentElementDef?.childs && !Array.isArray(parentElementDef?.childs)) ? parentElementDef?.childs : {};
			if (childDef && childDef.matchElementFromAttribute){
				const newTagName =searchIn.parent.attributes[childDef.matchElementFromAttribute].value;
				if (newTagName){
					const newParentElementDef = this.modelDefinitionManager.getModelDefinitionForTagAndType(modelFileContext, newTagName, ModelElementTypes.All);
					if (newParentElementDef && newParentElementDef.type){
						searchIn.parent.type = newParentElementDef.type;
					}
					searchIn.parent.tag = newTagName;
				}				
			}
			return this.getElementDefinition(modelFileContext, searchFor, searchIn.parent, depth++);
		}
		return elementDefinition;
	}

	private checkChildOccurrences(element: TreeNode, definition: Definition): void {
		// check element on invalid child nodes
		element.children.forEach(child => {
			if (Array.isArray(definition.childs) && !definition.childs?.map(x=>x.element?.toLowerCase()).includes(child.tag.toLowerCase())){
				this.addError(element.range, `Invalid child node '${child.tag}' for element '${element.tag}'`);
			}
		});

		// check the amount of occurrences of a child and compare it with the definition
		if (Array.isArray(definition.childs)){
			definition.childs?.forEach(x=>{
				const childOccurrences = element.children.filter(c=>c.tag.toLowerCase()==x.element?.toLowerCase()).length;

				switch(x.occurence){
					case "once":
						if (childOccurrences > 1) {
							this.addError(element.range, `Invalid child node occurence '${x.element}' for element '${element.tag}'. Element '${x.element}' could only be applied once to parent '${element.tag}'`);
						} else if (childOccurrences == 0 && x.required){
							this.addError(element.range, `Missing required '${x.element}' for element '${element.tag}'.`);
						}
						break;
					case "at-least-once":
						if (childOccurrences == 0){
							this.addError(element.range, `Invalid child node occurence '${x.element}' for element '${element.tag}'. Element '${x.element}' should be applied at least once to parent '${element.tag}'`);
						}
						break;
				}
			});
		}
	}

	private checkAttributeOccurrences(element: TreeNode, definition: Definition): void {
		// check attribute uniqueness 
		// TODO: attributes are always unique in the TreeNode. It is not possible to validate whether attributes are unique or not
		const uniqueValues = new Set(this.allNodeAttributes.map(x => x.name));
		if (uniqueValues.size < this.allNodeAttributes.length) {
			const intersection = this.allNodeAttributes.filter(x => Array.from(uniqueValues).map(x=>x.toLowerCase()).includes(x.name));
			this.addError(element.range, `Duplicate attribute '${intersection[0].name}' in element '${element.tag}'`);
		}

		// check required attribute is added
		definition.attributes?.forEach(attr=>{
			// based on required:true attribute
			if (attr.required && !this.allNodeAttributes.map(x=>x.name.toLowerCase()).includes(attr.name.toLowerCase())){
				this.addError(element.range, `Missing required attribute '${attr.name}' for element '${element.tag}'`);
			} 
			// based on requiredConditions
			else if (attr.requiredConditions){ 
				attr.requiredConditions.forEach(rc=>{
					const attrElement: Attribute = element.attributes[rc.attribute] ;
					const attrDefElement: Attribute = element.attributes[attr.name];
					switch (rc.condition) {
						case "==":
							if (
								!attrElement && (!attrDefElement || attrDefElement?.value == "") && rc.value == "" ||
								!attrDefElement && attrElement?.value == rc.value){
								this.addError(element.range, `Missing required attribute '${attr.name}' for element '${element.tag}'`);
							}
							break;
						default:
							// not implemented yet
							break;
					}				
				});
			}
		});
	}

	private checkAttributeValues(element: TreeNode, definition: Definition): void {
		// check attribute validations
		definition.attributes?.filter(da=>da.validations && this.allNodeAttributes.map(x=>x.name.toLowerCase()).includes(da.name.toLowerCase())).forEach(da=>{
			da.validations?.forEach(dv=>{
				if (dv.type == "regex"){
					const attrElement: Attribute = element.attributes[da.name];
					const regEx = new RegExp(dv.value);
					if (attrElement && !regEx.test(attrElement.value)){
						this.addError(element.range, `Invalid value for '${da.name}': ${dv.message}`);
					}
				}
			});
		});

		// check attribute types
		definition.attributes?.filter(da=>da.type && this.allNodeAttributes.map(x=>x.name).includes(da.name)).forEach(da=>{
			const attrValue: string = this.allNodeAttributes.filter(x=>x.name==da.name).map(x=>x.value)[0] || "";
			
			switch(da.type?.type){
				case AttributeTypes.Enum:
					if (da.type?.options && !da.type?.options?.map(o=>o.name.toLowerCase()).some(o=>o==attrValue.toLowerCase() || o=="*")){
						this.addError(element.range, `Invalid value for '${da.name}': '${attrValue}' is not a valid option`);
					}
					break;
				case AttributeTypes.Numeric:
					if (!Number(attrValue)) {
						this.addError(element.range, `Invalid value for '${da.name}': '${attrValue}' is not a number`);
					}
					break;
			}
		});
	}
}