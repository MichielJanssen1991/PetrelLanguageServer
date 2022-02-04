import { Attribute, AttributeTypes, Definition, ModelDetailLevel, ModelElementTypes, TreeNode } from '../../model-definition/symbolsAndReferences';
import { attributeValueIsAVariable } from '../../util/other';
import { ModelCheck } from '../modelCheck';

export class ModelDefinitionCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All;
	protected matchCondition?: ((node: TreeNode) => boolean) | undefined;
	private allNodeAttributes: Attribute[] = [];
	protected detailLevel: ModelDetailLevel = ModelDetailLevel.All;

	protected checkInternal(node: TreeNode): void {
		const modelFileContext = this.modelManager.getModelFileContextForFile(node.uri);
		const tagDefinition = this.modelDefinitionManager.getModelDefinitionForTreeNode(modelFileContext, node);
		
		this.allNodeAttributes = Object.values(node.attributes);
		
		if (!(node.type==ModelElementTypes.Document || node.tag == ModelElementTypes.Document.toLowerCase())){
			if (tagDefinition){
				this.checkChildOccurrences(node, tagDefinition);
				this.checkAttributeOccurrences(node, tagDefinition);
				this.checkAttributeValues(node, tagDefinition);
			} else {
				this.addMessage(node.range, "MDC0001", "#MDC0001: " + `No definition found for tag: '${node.tag}'`);
			}
		}
		
	}

	private checkChildOccurrences(element: TreeNode, definition: Definition): void {
		// check element on invalid child nodes
		element.children.forEach(child => {
			if (Array.isArray(definition.children) && !definition.children?.map(x=>x.element?.toLowerCase()).includes(child.tag.toLowerCase())){
				this.addMessage(element.range, "MDC0002", "#MDC0002: " + `Invalid child node '${child.tag}' for element '${element.tag}'`);
			}
		});

		// check the amount of occurrences of a child and compare it with the definition
		if (Array.isArray(definition.children)){
			definition.children?.forEach(x=>{
				const childOccurrences = element.children.filter(c=>c.tag.toLowerCase()==x.element?.toLowerCase()).length;

				switch(x.occurence){
					case "once":
						if (childOccurrences > 1) {
							this.addMessage(element.range, "MDC0003", "#MDC0003: " + `Invalid child node occurence '${x.element}' for element '${element.tag}'. Element '${x.element}' could only be applied once to parent '${element.tag}'`);
						} else if (childOccurrences == 0 && x.required){
							this.addMessage(element.range, "MDC0004", "#MDC0004: " + `Missing required '${x.element}' for element '${element.tag}'.`);
						}
						break;
					case "at-least-once":
						if (childOccurrences == 0){
							this.addMessage(element.range, "MDC0005", "#MDC0005: " + `Invalid child node occurence '${x.element}' for element '${element.tag}'. Element '${x.element}' should be applied at least once to parent '${element.tag}'`);
						}
						break;
				}
			});
		}
	}

	private checkAttributeOccurrences(element: TreeNode, definition: Definition): void {
		// check required attribute is added
		definition.attributes.forEach(attr=>{
			// based on required:true attribute
			if (attr.required && !this.allNodeAttributes.map(x=>x.name.toLowerCase()).includes(attr.name.toLowerCase())){
				this.addMessage(element.range, "MDC0006", `Missing required attribute '${attr.name}' for element '${element.tag}'`);
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
								this.addMessage(element.range, "MDC0007", "#MDC0007: " + `Missing required attribute '${attr.name}' for element '${element.tag}'`);
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
		definition.attributes.filter(da=>da.validations && this.allNodeAttributes.map(x=>x.name.toLowerCase()).includes(da.name.toLowerCase())).forEach(da=>{
			da.validations?.forEach(dv=>{
				if (dv.type == "regex"){
					const attrElement: Attribute = element.attributes[da.name];
					const regEx = new RegExp(dv.value);
					if (attrElement && !regEx.test(attrElement.value) && !attributeValueIsAVariable(attrElement.value)){
						this.addMessage(element.range, "MDC0008", "#MDC0008: " + `Invalid value for '${da.name}': ${dv.message}`);
					}
				}
			});
		});

		// check attribute types
		definition.attributes.filter(da=>da.type && this.allNodeAttributes.map(x=>x.name).includes(da.name)).forEach(da=>{
			const attrValue: string = this.allNodeAttributes.find(x=>x.name==da.name)?.value || "";
			
			if(!attributeValueIsAVariable(attrValue)){
				switch(da.type?.type){
					case AttributeTypes.Enum:
						if (da.type?.options && !da.type?.options?.map(o=>o.name.toLowerCase()).some(o=>o==attrValue.toLowerCase() || o=="*")){
							this.addMessage(element.range, "MDC0009", "#MDC0009: " + `Invalid value for '${da.name}': '${attrValue}' is not a valid option`);
						}
						break;
					case AttributeTypes.Numeric:
						if (!Number(attrValue)) {
							this.addMessage(element.range, "MDC0010", "#MDC0010: " + `Invalid value for '${da.name}': '${attrValue}' is not a number`);
						}
						break;
				}
			}
		});
	}
}