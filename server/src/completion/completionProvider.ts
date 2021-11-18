import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver';
import { ChildDefinition, JsonElementVariable, ModelElementTypes, NewDefinition, ObjectIdentifierTypes, Reference, SymbolDeclaration, SymbolOrReference } from '../model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import * as ReservedWords from '../model-definition/attributes';
import { ModelDefinitionManager, ModelFileContext } from '../model-definition/modelDefinitionManager';

export type CompletionContext = {
	inAttribute: boolean,
	inTag: boolean
	nodes: SymbolOrReference[],
	word: string,
	uri: string
}

export class CompletionProvider {
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private modelDefinitionManager: ModelDefinitionManager;

	constructor(symbolAndReferenceManager: SymbolAndReferenceManager, modelDefinitionManager: ModelDefinitionManager) {
		this.symbolAndReferenceManager = symbolAndReferenceManager;
		this.modelDefinitionManager = modelDefinitionManager;
	}

	public getCompletionItems(context: CompletionContext): CompletionItem[] {
		const { word, inTag, inAttribute, uri } = context;
		const modelFileContext = this.symbolAndReferenceManager.getModelFileContextForFile(uri);
		const numberOfNodes = context.nodes.length;
		const lastNode = numberOfNodes > 0 ? context.nodes[numberOfNodes - 1] : undefined;



		let symbolCompletions: CompletionItem[] = [];
		if (inAttribute && word != null && lastNode) {
			symbolCompletions = this.getSymbolCompletions(lastNode, word);
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
			let attributesForAction: string[] = [];
			if (node.type == ModelElementTypes.Action && node.objectType == ObjectIdentifierTypes.Reference) {
				const actionRef = node as Reference;
				const referencedAction = this.symbolAndReferenceManager.getReferencedObject(actionRef);
				attributesForAction = referencedAction?.children.filter(x => x.type == ModelElementTypes.Attribute).map(x => x.name) || [];
			}

			//Using the old predefined attributes per tag (which will be removed later)
			const attributesForTag: string[] = ReservedWords.ATTRIBUTES_PER_TAG[node.tag] || [];

			//Using the new model definition
			const modelDefinition = this.modelDefinitionManager.getModelDefinitionForTag(modelFileContext, node.tag);
			const attributesForTagNew = modelDefinition?.attributes?.map(x => x.name) || [];

			const allAttributes = [...attributesForTag, ...attributesForAction, ...attributesForTagNew];
			attributeCompletions = this.mapAttributesToCompletionItem(allAttributes);
			return attributeCompletions;
		}
		return [];
	}

	private getSymbolCompletions(node: SymbolOrReference, word: string): CompletionItem[] {
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
				const snippet = this.buildChildElementSnippet(child, childsOwnDefinition);
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

	private buildChildElementSnippet(child: ChildDefinition, childsOwnDefinition?: NewDefinition) {
		const elementName = child.element;
		const childsAttributes = childsOwnDefinition?.attributes;
		const attributes = childsAttributes?.map((attribute, i) => {
			let attributeOptions = ""; 
			if(attribute.types){
				attribute.types.map((attributeType) => {
					if (attributeType.type == 'enum' && attributeType.options){
						attributeOptions += `|${attributeType.options.map(option=>option.name).join(',')}|`;
					}
				});				
			}
			return `${attribute.name}="\${${i + 1}${attributeOptions}}"`;
		}).join(" ") || "";
		const childChildren = childsOwnDefinition?.childs;
		const lastTab = `\${${(childsAttributes?.length || 0) + 1}}`;
		const snippet = childChildren != undefined && childChildren.length > 0
			? `<${elementName} ${attributes}> \n ${lastTab} \n </${elementName}>`
			: `<${elementName} ${attributes} ${lastTab}/>`;
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