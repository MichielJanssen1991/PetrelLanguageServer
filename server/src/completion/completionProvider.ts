import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver';
import { Reference, SymbolDeclaration, TreeNode } from '../model-definition/types/tree';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import { ModelDefinitionManager, ModelFileContext } from '../model-definition/modelDefinitionManager';
import { ActionContext } from '../generic/actionContext';
import { NAMES } from '../model-definition/types/constants';
import { AttributeTypes, ChildDefinition, Definition, ElementAttribute, ModelElementTypes } from '../model-definition/types/definitions';

export class CompletionProvider {
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private modelDefinitionManager: ModelDefinitionManager;

	constructor(symbolAndReferenceManager: SymbolAndReferenceManager, modelDefinitionManager: ModelDefinitionManager) {
		this.symbolAndReferenceManager = symbolAndReferenceManager;
		this.modelDefinitionManager = modelDefinitionManager;
	}

	public getCompletionItems(context: ActionContext): CompletionItem[] {
		const { word, inTag, inAttribute, uri/*,  attribute */ } = context;
		const modelFileContext = this.symbolAndReferenceManager.getModelFileContextForFile(uri);
		const currentNode = context.currentNode;

		let attributeValueCompletions: CompletionItem[] = [];
		if (inAttribute && word != null && currentNode) {
			attributeValueCompletions = this.getAttributeValueCompletions(modelFileContext, context);
		}

		let attributeCompletions: CompletionItem[] = [];
		if (!inAttribute && inTag && currentNode) {
			attributeCompletions = this.getAttributeCompletions(modelFileContext, context);
		}

		let childElementCompletions: CompletionItem[] = [];
		if (!inTag && currentNode) {
			childElementCompletions = this.getChildElementCompletions(modelFileContext, context);
		}

		const allCompletions = [
			...attributeCompletions,
			...attributeValueCompletions,
			...childElementCompletions
		];

		if (word) {
			// Filter to only return suffixes of the current word
			return allCompletions.filter(item => item.label.startsWith(word));
		}

		return allCompletions;
	}

	private getAttributeCompletions(modelFileContext: ModelFileContext, context: ActionContext) {
		let attributeCompletions: CompletionItem[] = [];
		const node = context.currentNode;
		if (node) {
			// get default attributes based on model definition
			const modelDefinition = this.modelDefinitionManager.getModelDefinitionForTreeNode(modelFileContext, node);

			// get a lit of nonvisible elements (attributes which should not appear in the completion list because they do not apply )
			const attributesForTag = this.getVisibleAttributes(modelDefinition, node);

			// get attributes based on the action called
			let attributesForAction: ElementAttribute[] = [];
			if (node.type == ModelElementTypes.ActionCall) {
				attributesForAction = this.getAttributesForActionCall(node);
			}

			let allAttributes = [...attributesForAction, ...attributesForTag];

			// remove already available attributes
			const existingAttributes = [...Object.keys(node.attributes)];
			allAttributes = allAttributes.filter(item => !existingAttributes.includes(item.name));

			attributeCompletions = this.mapAttributesToCompletionItem(allAttributes);
			if (attributeCompletions.length > 0) {
				return attributeCompletions;
			} 
			return [{label: "no attribute options found for " + node.tag}];
		}
		return [{label: "no attribute options found"}];
	}

	/**
	 * Get a list of additional atributes applicable to the action call. For example 'rule-name' for action call of type 'Rule'
	 * @param actionCall the action call node
	 * @returns a list of attributes specific to this action.
	 */
	private getAttributesForActionCall(actionCall: TreeNode) {
		let attributesForAction: ElementAttribute[] = [];
		const actionReference = actionCall.attributes["name"] as Reference;
		const referencedAction = this.symbolAndReferenceManager.getReferencedObject(actionReference);
		if (referencedAction) {
			attributesForAction = (referencedAction?.children
				.filter(x => x.type == ModelElementTypes.Attribute) as SymbolDeclaration[])
				.map(x => {
					return { name: x.name, description: "geen" };
				}) || [];
		}
		return attributesForAction;
	}

	/**
	 * Get a list of non visible attributes based on the visibilityConditions of the Model Definition
	 * @param modelDefinition 
	 * @param node 
	 * @returns a list of non visible attribute names 
	 */
	private getVisibleAttributes(modelDefinition: Definition | undefined, node: TreeNode) {
		// get all attributes without visibilityConditions
		const a = modelDefinition?.attributes.filter(
			attr => !attr.visibilityConditions
		) || [];

		// get all attributes with visibilityConditions and conditions did match
		const b = modelDefinition?.attributes.filter(
			attr => {
				let totRetVal: boolean | undefined;
				const nodeAttributes: any = node.attributes;

				attr.visibilityConditions?.forEach(visCond => {
					switch (visCond.condition) {
						case "==":
							if (nodeAttributes[visCond.attribute]) {
								totRetVal = this.returnEqualsOperationResult(totRetVal, visCond.operator, visCond.value, nodeAttributes[visCond.attribute].value);
							} else {
								totRetVal = this.returnEqualsOperationResult(totRetVal, visCond.operator, visCond.value);
							}
							break;
						case "!=":
							if (nodeAttributes[visCond.attribute]) {
								totRetVal = this.returnUnEqualsOperationResult(totRetVal, visCond.operator, visCond.value, nodeAttributes[visCond.attribute].value);
							} else {
								totRetVal = this.returnUnEqualsOperationResult(totRetVal, visCond.operator, visCond.value);
							}
							break;
						case "misses":
							// not implemented yet
							totRetVal = false;
							break;
						case "not-in":
							// not implemented yet
							totRetVal = false;
							break;
						case "not-in-like":
							// not implemented yet
							totRetVal = false;
							break;
						default:
							totRetVal = false;
							break;
					}
				});
				return totRetVal;
			}
		) || [];

		return [...a, ...b];
	}

	/**
	 * A basic function to calculate the EQUALS operation value (overall boolean result + new conditions) based on the given operator.
	 * When no operator is given, it default uses OR conditions
	 * @param returnResult 
	 * @param operator 
	 * @param conditionValue 
	 * @param nodevalue 
	 * @returns 
	 */
	private returnEqualsOperationResult(returnResult: boolean | undefined, operator: string | undefined, conditionValue: string, nodevalue = ""): boolean {
		if (!operator || operator == "or") {
			returnResult = returnResult || nodevalue == conditionValue;
		} else {
			returnResult = returnResult && nodevalue == conditionValue;
		}
		return returnResult || false;
	}

	/**
	 * A basic function to calculate the UNEQUALS operation value (overall boolean result + new conditions) based on the given operator.
	 * When no operator is given, it default uses AND conditions
	 * @param returnResult 
	 * @param operator 
	 * @param conditionValue 
	 * @param nodevalue 
	 * @returns 
	 */
	private returnUnEqualsOperationResult(returnResult: boolean | undefined, operator: string | undefined, conditionValue: string, nodevalue = ""): boolean {
		if (returnResult !== undefined && (!operator || operator == "and")) {
			returnResult = returnResult && nodevalue != conditionValue;
		} else {
			returnResult = returnResult || nodevalue != conditionValue;
		}
		return returnResult || false;
	}

	private getAttributeValueCompletions(modelFileContext: ModelFileContext, context: ActionContext): CompletionItem[] {
		const node = context.currentNode as TreeNode;
		const elementDefinition = this.modelDefinitionManager.getModelDefinitionForTreeNode(modelFileContext, node);
		const attribute = context.attribute;
		let symbols = [{ label: "no posibilities found" }];
		if (attribute && elementDefinition && elementDefinition.attributes) {
			const attrName = typeof (attribute) == 'string' ? attribute : (attribute as Reference).name;
			const attrDefinition = elementDefinition.attributes.find(attr => attr.name == attrName);
			const types = attrDefinition?.types;
			let nameSpacePrefix = "";
			if (attrDefinition && types) {
				types.forEach(type => {
					if (type.type == AttributeTypes.Reference && type.relatedTo) {
						switch (type.relatedTo) {
							case ModelElementTypes.RuleContext:
								symbols = context
									.getFromContext(ModelElementTypes.Rule, [
										{type: ModelElementTypes.ActionCallOutput, attribute: NAMES.ATTRIBUTE_LOCALNAME},
										{type: ModelElementTypes.Input, attribute: NAMES.ATTRIBUTE_NAME},
										{type: ModelElementTypes.SetVar, attribute: NAMES.ATTRIBUTE_NAME}
									])
									?.availableParams.filter(param=>param!=undefined).map(param => ({ label: param })) || [
										{ label: "no params found" },
									];
								break;
							default:
								if (type.prefixNameSpace && node.contextQualifiers.nameSpace) { nameSpacePrefix = node.contextQualifiers.nameSpace + "."; }
								symbols = this.symbolAndReferenceManager.getAllSymbolsForType(type.relatedTo).filter(x => x.name != undefined && (nameSpacePrefix == "" || x.name.startsWith(nameSpacePrefix))).map(x => ({ label: x.name.substring(nameSpacePrefix.length) })) || [
									{ label: `no ${type.relatedTo}s found` }];
								break;
						}
					} else if (type.type == AttributeTypes.Enum && type.options) {
						symbols = type.options.filter(option=>!option.obsolete).map(option => ({ label: option.name }));
					}
				});
			}
		}
		return symbols;
	}

	/**
	 * Get the possible children of an element. 
	 * ModelDefinition.children could contain:
	 * - nothing (the completions will be empty)
	 * - list of children (the completions will filled with these items)
	 * - object with attribute matchElementFromAttribute referring to another element (the completions will be filled with the children of that element)
	 * - object with matchFromParent. (the completions will be filled with the children of the parent)
	 * @param modelFileContext 
	 * @param context 
	 * @returns 
	 */
	private getChildElementCompletions(modelFileContext: ModelFileContext, context: ActionContext): CompletionItem[] {
		const node = context.currentNode as TreeNode;
		return this.getChildElementCompletionsForNode(modelFileContext, node);
	}

	private getChildElementCompletionsForNode(modelFileContext: ModelFileContext, node: TreeNode): CompletionItem[]{
		const elementDefinition = this.modelDefinitionManager.getModelDefinitionForTreeNode(modelFileContext, node);
		//Return parents children if the current node is a grouping element
		if(elementDefinition?.isGroupingElement && node.parent){
			return this.getChildElementCompletionsForNode(modelFileContext, node.parent);
		}
		if (elementDefinition && elementDefinition.children.length > 0) {
			return this.mapChildrenToCompletionItems(elementDefinition.children, modelFileContext);
		}
		return [{label: "no child options found for " + node.tag }];
	}

	private mapAttributesToCompletionItem(attributes: ElementAttribute[]): CompletionItem[] {
		return attributes.map(att => ({
			label: att.name,
			kind: CompletionItemKind.Snippet,
			insertText: `${att.name}="\${0}"`,
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: att.description,
			detail: att.description
		}));
	}

	private mapChildrenToCompletionItems(children: ChildDefinition[], modelFileContext: ModelFileContext): CompletionItem[] {
		return children.map(
			(child: ChildDefinition) => {
				const childsOwnDefinition = this.modelDefinitionManager.getModelDefinitionForTagAndType(modelFileContext, child.element, child.type||ModelElementTypes.All, child.subtype);
				const snippet = this.buildChildElementSnippet(modelFileContext, child, childsOwnDefinition);
				return {
					label: child.element,
					kind: CompletionItemKind.Snippet,
					insertText: snippet,
					insertTextFormat: InsertTextFormat.Snippet,
					documentation: childsOwnDefinition?.description,
					detail: childsOwnDefinition?.description
				};
			},
		);
	}

	/**
	 * Construct a snippet of xml-model based on the requested definition. Following things will be handled:
	 * - If one or more children of the definition is required it will be auto added as a child element (recursive)
	 * - Required Attributes and Attributes marked as 'autoadd' in the definition will be added to the snippet
	 * - vscode 'tabs' will be active on the attributes of the first element layer.
	 * @param modelFileContext 
	 * @param child 
	 * @param childsOwnDefinition 
	 * @param tabIndent the indent of the child element
	 * @returns string of the generated snippet
	 */
	private buildChildElementSnippet(modelFileContext: ModelFileContext, child: ChildDefinition, childsOwnDefinition?: Definition, tabIndent = "") {
		const elementName = child.element;
		const childsAttributes = childsOwnDefinition?.attributes;
		const attributes = childsAttributes?.filter(attribute => (attribute.autoadd || attribute.required)).map((attribute, i) => {
			// get element attributes. When element is not a child element (because of the recursive call) then the 'tabs' are applied
			let attributeOptions = "";
			attribute.types?.forEach(attributeType => {
				if (attributeType) {
					if (attributeType.type == AttributeTypes.Enum && attributeType.options) {
						if (attributeType.options.find(option => option.default)) {
							attributeOptions = `|${attributeType.options.find(option => option.default)?.name}|`;
						} else if (tabIndent == "") {
							attributeOptions += `|${attributeType.options.map(option => option.name).join(',')}|`;
						}
					}
				}
			});
			// only parent node can use tabs... (tabIndent empty is only on the top element level. Recursive children gets a \t in the tabIndent)
			const attrValue = (tabIndent == "") ? `\${${i + 1}${attributeOptions}}` : `${attributeOptions.replace(/\|/g, "")}`;

			return `${attribute.name}="${attrValue}"`;
		}).join(" ") || "";
		const childChildren = childsOwnDefinition?.children;

		// get the required child nodes and add them to the snippet
		const childSnippets: string[] = [];
		if (Array.isArray(childChildren) && childChildren) {
			childChildren?.filter(childNode => childNode.required).forEach(item => {
				const childDefinition = this.modelDefinitionManager.getModelDefinitionForTagAndType(modelFileContext, item.element, item.type || ModelElementTypes.All);
				childSnippets.push(this.buildChildElementSnippet(modelFileContext, item, childDefinition, tabIndent + `\t`));
			});
		}

		// construct snipped. Put element sting, attribute string and child string together.
		const lastTab = (tabIndent == "") ? `\${${(childsAttributes?.length || 0) + 1}}` : "";
		const snippet = childChildren != undefined && (!Array.isArray(childChildren) || (Array.isArray(childChildren) && childChildren.length > 0))
			? `${tabIndent}<${elementName} ${attributes}> \n${childSnippets.join(`\n`)} ${lastTab} \n${tabIndent}</${elementName}>`
			: `${tabIndent}<${elementName} ${attributes} ${lastTab}/>`;
		return snippet;
	}
}
