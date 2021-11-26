import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver';
import { AttributeTypes, ChildDefinition, IsSymbolOrReference, ModelElementTypes, NewDefinition, Reference, SymbolDeclaration, SymbolOrReference } from '../model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import { ModelDefinitionManager, ModelFileContext } from '../model-definition/modelDefinitionManager';

export type CompletionContext = {
	inAttribute: boolean,
	inTag: boolean
	nodes: SymbolOrReference[],
	word: string,
	uri: string,
	attribute?: Reference
}

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
		const numberOfNodes = context.nodes.length;
		const lastNode = numberOfNodes > 0 ? context.nodes[numberOfNodes - 1] : undefined;



		let symbolCompletions: CompletionItem[] = [];
		if (inAttribute && word != null && lastNode) {
			symbolCompletions = this.getSymbolCompletions(lastNode, word, attribute);
		}

		let attributeCompletions: CompletionItem[] = [];
		if (!inAttribute && inTag && lastNode) {
			attributeCompletions = this.getAttributeCompletions(lastNode, modelFileContext);
		}

		let childElementCompletions: CompletionItem[] = [];
		if (!inTag && lastNode) {
			childElementCompletions = this.getChildElementCompletions(lastNode, modelFileContext);
		}

		const allCompletions = [
			...attributeCompletions,
			...symbolCompletions,
			...childElementCompletions
		];

		if (word) {
			// Filter to only return suffixes of the current word
			return allCompletions.filter(item => item.label.startsWith(word));
		}

		return allCompletions;
	}

	private getAttributeCompletions(node: SymbolOrReference, modelFileContext: ModelFileContext) {
		let attributeCompletions: CompletionItem[] = [];
		if (node) {
			// get default attributes based on model definition
			const modelDefinition = this.modelDefinitionManager.getModelDefinitionForTag(modelFileContext, node.tag);
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

	private getSymbolCompletions(node: SymbolOrReference, word: string, attribute? : Reference): CompletionItem[] {
		let symbols = this.symbolAndReferenceManager.findSymbolsMatchingWord({ exactMatch: false, word });
		const reference = node.children.find(x => x.name == word);
		if (reference) {
			symbols = symbols.filter(x => x.type == reference.type);
		}
		const symbolCompletions: CompletionItem[] = this.mapSymbolsToCompletionItems(symbols);
		return symbolCompletions;
	}

	private getChildElementCompletions(node: SymbolOrReference, modelFileContext: ModelFileContext): CompletionItem[] {
		const elementDefinition = this.modelDefinitionManager.getModelDefinitionForTag(modelFileContext, node.tag);
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
			data: {
				name: att
			},
			detail: "Attribute"
		}));
	}
		
	private mapSymbolsToCompletionItems(symbols: SymbolDeclaration[]): CompletionItem[] {
		return symbols.map(
			(symbol: SymbolDeclaration) => ({
				label: symbol.name,
				kind: this.mapSymbolTypeToCompletionKind(symbol.type),
				data: {
					name: symbol.name
				},
				documentation: this.getDocumentationForSymbol(symbol),
				detail: symbol.type
			}),
		);
	}

	private mapChildrenToCompletionItems(children: ChildDefinition[], modelFileContext: ModelFileContext): CompletionItem[] {
		return children.map(
			(child: ChildDefinition) => {
				const childsOwnDefinition = this.modelDefinitionManager.getModelDefinitionForTag(modelFileContext, child.element);
				const snippet = this.buildChildElementSnippet(modelFileContext, child, childsOwnDefinition);
				return {
					label: child.element,
					kind: CompletionItemKind.Snippet,
					insertText: snippet,
					insertTextFormat: InsertTextFormat.Snippet,
					data: {
						name: child.element
					},
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
	private buildChildElementSnippet(modelFileContext: ModelFileContext, child: ChildDefinition, childsOwnDefinition?: NewDefinition, tabIndent: string="") {
		const elementName = child.element;
		const childsAttributes = childsOwnDefinition?.attributes;
		const attributes = childsAttributes?.filter(attribute=>(attribute.autoadd || attribute.required)).map((attribute, i) => {
			// get element attributes. When element is not a child element (because of the recursive call) then the 'tabs' are applied
			let attributeOptions = ""; 
			if(attribute.types){
				attribute.types.map((attributeType) => {
					if (attributeType.type == AttributeTypes.Enum && attributeType.options){
						if (attributeType.options.find(option=>option.default)){
							attributeOptions = `|${attributeType.options.find(option=>option.default)?.name}|`;
						} else if (tabIndent == ""){
							attributeOptions += `|${attributeType.options.map(option=>option.name).join(',')}|`;
						}						
					}
				});				
			}			
			// only parent node can use tabs... (tabIndent empty is only on the top element level. Recursive childs gets a \t in the tabIndent)
			const attrValue = (tabIndent == "") ? `\${${i + 1}${attributeOptions}}` : `${attributeOptions.replace(/\|/g, "")}`;

			return `${attribute.name}="${attrValue}"`;
		}).join(" ") || "";
		const childChildren = childsOwnDefinition?.childs;
		
		// get the required child nodes and add them to the snippet
		let childSnippets : string[] = [];
		childChildren?.filter(childNode=>childNode.required).forEach(item=>{
			const childDefinition = this.modelDefinitionManager.getModelDefinitionForTag(modelFileContext, item.element);
			childSnippets.push(this.buildChildElementSnippet(modelFileContext, item, childDefinition, tabIndent + `\t`));
		});

		// construct snipped. Put element sting, attribute string and child string together.
		const lastTab = (tabIndent == "") ? `\${${(childsAttributes?.length || 0) + 1}}` : "";
		const snippet = childChildren != undefined && childChildren.length > 0
			? `${tabIndent}<${elementName} ${attributes}> \n${childSnippets.join(`\n`)} ${lastTab} \n${tabIndent}</${elementName}>`
			: `${tabIndent}<${elementName} ${attributes} ${lastTab}/>`;
		return snippet;
	}

	private getDocumentationForSymbol(symbol: SymbolDeclaration): string {
		return symbol.comment || "";
	}

	private mapSymbolTypeToCompletionKind(type: ModelElementTypes): CompletionItemKind {
		switch (type) {
			case ModelElementTypes.Action: return CompletionItemKind.Function;
			case ModelElementTypes.Infoset: return CompletionItemKind.Function;
			case ModelElementTypes.Rule: return CompletionItemKind.Function;
			case ModelElementTypes.NameSpace: return CompletionItemKind.Module;
			case ModelElementTypes.Input: return CompletionItemKind.TypeParameter;
			case ModelElementTypes.Function: return CompletionItemKind.Function;
		}
		return CompletionItemKind.Variable;
	}
}