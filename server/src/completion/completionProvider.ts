import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver';
import { ChildDefinition, ModelElementTypes, NewDefinition, Reference, SymbolDeclaration } from '../model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import * as ReservedWords from '../model-definition/attributes';
import { ModelDefinitionManager } from '../model-definition/modelDefinitionManager';

export enum CompletionItemDataType {
	ReservedWord,
	Symbol,
	Snippet
}

export type CompletionContext = {
	inAttribute: boolean,
	references: Reference[],
	declarations: SymbolDeclaration[],
	parentReference?: Reference,
	tag: string,
	word: string,
	uri: string
}

export class CompletionProvider {
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	private modelDefinitionManager: ModelDefinitionManager;
	
	constructor(symbolAndReferenceManager: SymbolAndReferenceManager, modelDefinitionManager:ModelDefinitionManager) {
		this.symbolAndReferenceManager = symbolAndReferenceManager;
		this.modelDefinitionManager = modelDefinitionManager;
	}

	public getCompletionItems(context: CompletionContext): CompletionItem[] {
		const { word, inAttribute, tag } = context;
		let symbolCompletions: CompletionItem[] = [];
		if (inAttribute && word != null) {
			symbolCompletions = this.getSymbolCompletions(context);
		}

		let attributeCompletions: CompletionItem[] = [];
		if (!inAttribute && tag != "") {
			attributeCompletions = this.getAttributeCompletions(context);
		}

		let childElementCompletions: CompletionItem[] = [];
		if (tag == "") {
			childElementCompletions = this.getChildElementCompletions(context);
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

	private getAttributeCompletions(context: CompletionContext) {
		let attributeCompletions: CompletionItem[] = [];
		const actionRef = context.references.find(x => x.type == ModelElementTypes.Action);
		let attributesForAction: string[] = [];
		if (actionRef) {
			const referencedAction = this.symbolAndReferenceManager.getReferencedObject(actionRef);
			attributesForAction = referencedAction?.children.filter(x => x.type == ModelElementTypes.Attribute).map(x => x.name) || [];
		}
		const attributesForTag = ReservedWords.ATTRIBUTES_PER_TAG[context.tag] || [];
		const allAttributes = [...attributesForTag, ...attributesForAction];
		attributeCompletions = this.mapAttributesToCompletionItem(allAttributes);
		return attributeCompletions;
	}

	private getSymbolCompletions(context: CompletionContext): CompletionItem[] {
		const word = context.word;
		let symbols = this.symbolAndReferenceManager.findSymbolsMatchingWord({ exactMatch: false, word });

		const reference = context.references.find(x => x.name == word);
		if (reference) {
			symbols = symbols.filter(x => x.type == reference.type);
		}
		const symbolCompletions: CompletionItem[] = this.mapSymbolsToCompletionItems(symbols);
		return symbolCompletions;
	}

	private getChildElementCompletions(context: CompletionContext): CompletionItem[] {
		const modelFileContext = this.symbolAndReferenceManager.getModelFileContextForFile(context.uri);
		const xmlDefinition = this.modelDefinitionManager.getModelDefinition(modelFileContext);
		let childCompletions: CompletionItem[] = [];
		if (xmlDefinition.length>0) {
			const declarations = context.declarations;
			const declaration = declarations.length > 0 ? declarations[declarations.length - 1] : undefined;
			if (declaration) {
				const elementDefintion = xmlDefinition.find(x => x.element == declaration.tag);
				const children = elementDefintion?.childs;
				if (children) {
					childCompletions = this.mapChildrenToCompletionItems(children, xmlDefinition);
				}
			}
		}

		return childCompletions;
	}

	private mapAttributesToCompletionItem(attributes: string[]): CompletionItem[] {
		return attributes.map(att => ({
			label: att,
			kind: CompletionItemKind.Property,
			data: {
				name: att,
				type: CompletionItemDataType.ReservedWord,
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
					name: symbol.name,
					type: CompletionItemDataType.Symbol
				},
				documentation: this.getDocumentationForSymbol(symbol),
				detail: symbol.type
			}),
		);
	}

	private mapChildrenToCompletionItems(children: ChildDefinition[], xmlDefinition: NewDefinition[]): CompletionItem[] {
		return children.map(
			(child: ChildDefinition) => {
				const childsOwnDefinition = xmlDefinition.find(x => x.element == child.element);
				const childsAttributes = childsOwnDefinition?.attributes;
				let childPlaceHolders = childsAttributes?.map((x, i)=> `${x.name}="\${${i+1}}"`).join(" ");
				childPlaceHolders = childPlaceHolders||""; 
				const childChildren = childsOwnDefinition?.childs;
				const snippet = childChildren != undefined && childChildren.length > 0
					? `<${child.element} ${childPlaceHolders}> \n \${${(childsAttributes?.length||0)+1}} \n </${child.element}>`
					: `<${child.element} ${childPlaceHolders} \${${(childsAttributes?.length||0)+1}}/>`;
				return {
					label: child.element,
					kind: CompletionItemKind.Snippet,
					insertText: snippet,
					insertTextFormat: InsertTextFormat.Snippet,
					data: {
						name: child.element,
						type: CompletionItemDataType.Snippet
					},
					documentation: childsOwnDefinition?.description,
					detail: childsOwnDefinition?.description
				};
			},
		);
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