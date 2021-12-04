import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver';
import { AttributeTypes, ChildDefinition, IsSymbolOrReference, ModelElementTypes, Definition, Reference, SymbolDeclaration, SymbolOrReference, IXmlNodeContext } from '../model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import { ModelDefinitionManager, ModelFileContext } from '../model-definition/modelDefinitionManager';
import { CompletionContext } from './completionContext';

export class CompletionProvider {
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private modelDefinitionManager: ModelDefinitionManager;

	constructor(symbolAndReferenceManager: SymbolAndReferenceManager, modelDefinitionManager: ModelDefinitionManager) {
		this.symbolAndReferenceManager = symbolAndReferenceManager;
		this.modelDefinitionManager = modelDefinitionManager;
	}

	public getCompletionItems(context: CompletionContext): CompletionItem[] {
		const { word, inTag, inAttribute, uri, attribute } = context;
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

	private getAttributeCompletions(modelFileContext: ModelFileContext, context: CompletionContext) {
		let attributeCompletions: CompletionItem[] = [];
		const node = context.currentNode;
		if (node) {
			// get default attributes based on model definition
			const modelDefinition = this.modelDefinitionManager.getModelDefinitionForCurrentNode(modelFileContext, context);
			const attributesForTag = modelDefinition?.attributes?.map(x => x.name) || [];

			// get attributes based on the action called
			let attributesForAction: string[] = [];
			if (node.type == ModelElementTypes.Action && node.objectType == IsSymbolOrReference.Reference) {
				const actionReference = node as Reference;
				const referencedAction = this.symbolAndReferenceManager.getReferencedObject(actionReference);
				attributesForAction = referencedAction?.children.filter(x => x.type == ModelElementTypes.Attribute).map(x => x.name) || [];
			}

			let allAttributes = [...attributesForAction, ...attributesForTag];
			// remove already available attributes
			const allExistingAttributes = [...Object.keys(node.attributeReferences), ...Object.keys(node.otherAttributes)];
			allAttributes = allAttributes.filter(item => !allExistingAttributes.includes(item));

			attributeCompletions = this.mapAttributesToCompletionItem(allAttributes);

			return attributeCompletions;
		}
		return [];
	}

	private getAttributeValueCompletions(modelFileContext: ModelFileContext, context: CompletionContext): CompletionItem[] {
		const elementDefinition = this.modelDefinitionManager.getModelDefinitionForCurrentNode(modelFileContext, context);
		const attribute = context.attribute;
		let symbols = [{ label: "no posibilities found" }];
		if (attribute && elementDefinition && elementDefinition.attributes) {
			const attrName = typeof (attribute) == 'string' ? attribute : (attribute as Reference).name;
			const attrDefinition = elementDefinition.attributes.find(attr => attr.name == attrName);
			const type = attrDefinition?.type;
			if (attrDefinition && type) {
				if (type.type == AttributeTypes.Reference) {
					// concept ............ need 'some' work :)
					const ruleContext = context.getRuleContext();
					symbols = ruleContext?.availableParams.map(param => ({ label: param })) || [{ label: "no parames found" }];
				} else if (type.type == AttributeTypes.Enum && type.options) {
					symbols = type.options.map(option => ({ label: option.name }));
				}
			}
		}

		return symbols;
	}

	private getChildElementCompletions(modelFileContext: ModelFileContext, context: CompletionContext): CompletionItem[] {
		const elementDefinition = this.modelDefinitionManager.getModelDefinitionForCurrentNode(modelFileContext, context);
		let childCompletions: CompletionItem[] = [];
		if (elementDefinition) {
			const children = elementDefinition.childs;
			if (children) {
				childCompletions = this.mapChildrenToCompletionItems(children, modelFileContext);
			}
		}

		return childCompletions;
	}

	private mapAttributesToCompletionItem(attributes: string[]): CompletionItem[] {
		return attributes.map(att => ({
			label: att,
			kind: CompletionItemKind.Property,
			detail: "Attribute"
		}));
	}

	private mapChildrenToCompletionItems(children: ChildDefinition[], modelFileContext: ModelFileContext): CompletionItem[] {
		return children.map(
			(child: ChildDefinition) => {
				const childsOwnDefinition = this.modelDefinitionManager.getModelDefinitionForTagWitouthContext(modelFileContext, child.element);//TODO: should pass node and context of child
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
	 * - If one or more childs of the definition is required it will be auto added as a child element (recursive)
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
			const attributeType = attribute.type;
			if (attributeType) {
				if (attributeType.type == AttributeTypes.Enum && attributeType.options) {
					if (attributeType.options.find(option => option.default)) {
						attributeOptions = `|${attributeType.options.find(option => option.default)?.name}|`;
					} else if (tabIndent == "") {
						attributeOptions += `|${attributeType.options.map(option => option.name).join(',')}|`;
					}
				}
			}
			// only parent node can use tabs... (tabIndent empty is only on the top element level. Recursive childs gets a \t in the tabIndent)
			const attrValue = (tabIndent == "") ? `\${${i + 1}${attributeOptions}}` : `${attributeOptions.replace(/\|/g, "")}`;

			return `${attribute.name}="${attrValue}"`;
		}).join(" ") || "";
		const childChildren = childsOwnDefinition?.childs;

		// get the required child nodes and add them to the snippet
		const childSnippets: string[] = [];
		childChildren?.filter(childNode => childNode.required).forEach(item => {
			const childDefinition = this.modelDefinitionManager.getModelDefinitionForTagWitouthContext(modelFileContext, item.element);
			childSnippets.push(this.buildChildElementSnippet(modelFileContext, item, childDefinition, tabIndent + `\t`));
		});

		// construct snipped. Put element sting, attribute string and child string together.
		const lastTab = (tabIndent == "") ? `\${${(childsAttributes?.length || 0) + 1}}` : "";
		const snippet = childChildren != undefined && childChildren.length > 0
			? `${tabIndent}<${elementName} ${attributes}> \n${childSnippets.join(`\n`)} ${lastTab} \n${tabIndent}</${elementName}>`
			: `${tabIndent}<${elementName} ${attributes} ${lastTab}/>`;
		return snippet;
	}
}