import { Attribute, AttributeTypes, Definition, ModelElementTypes, TreeNode } from '../../model-definition/symbolsAndReferences';
import { ModelCheck } from '../modelCheck';
import { ModelCheckerOptions } from '../modelChecker';

export class ModelDefinitionCheck extends ModelCheck {
	protected modelElementType = ModelElementTypes.All;
	protected matchCondition?: ((node: TreeNode) => boolean) | undefined;
	private allNodeAttributes: Attribute[] = [];

	protected checkInternal(node: TreeNode, options: ModelCheckerOptions): void {
		const modelFileContext = this.modelManager.getModelFileContextForFile(node.uri);
		// TODO: change call to getModelDefinitionForCurrentNode and pass the context to make sure context specific items get validated properly
		// Another idea is to add 'parent' to TreeNode. Type 'Definition' could have an extra item 'context', which could indicate the type of parent. 
		// In that case it is not needed to pass the tag context/location to the check parent context.
		// 
		// I think I still prefer the checks in the 'check' classes and the 'parse' functions in the parse classes and not mix them together.
		// (The parse function has some checks currently)
		const tagDefinition = this.modelDefinitionManager.getModelDefinitionForTagWithoutContext(modelFileContext, node.tag);
		
		this.allNodeAttributes = Object.values(node.attributes);
		if (tagDefinition){
			this.checkChildOccurrences(node, tagDefinition);
			this.checkAttributeOccurrences(node, tagDefinition);
			this.checkAttributeValues(node, tagDefinition);
		}
	}

	private checkChildOccurrences(element: TreeNode, definition: Definition): void {
		// check element on invalid child nodes (TODO: merge with ModelParser class)
		element.children.forEach(child => {
			if (Array.isArray(definition.childs) && !definition.childs?.map(x=>x.element.toLowerCase()).includes(child.tag.toLowerCase())){
				this.addError(element.range, `Invalid child node '${child.tag}' for element '${element.tag}'`);
			}
		});

		// check the amount of occurrences of a child and compare it with the definition
		if (Array.isArray(definition.childs)){
			definition.childs?.forEach(x=>{
				const childOccurrences = element.children.filter(c=>c.tag.toLowerCase()==x.element.toLowerCase()).length;

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
					if (da.type?.options && !da.type?.options?.map(o=>o.name.toLowerCase()).includes(attrValue.toLowerCase())){
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