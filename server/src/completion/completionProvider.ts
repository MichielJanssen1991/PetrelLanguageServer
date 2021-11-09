import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';
import { ModelElementTypes, Reference, SymbolDeclaration } from '../model-definition/symbolsAndReferences';
import { SymbolAndReferenceManager } from '../symbol-and-reference-manager/symbolAndReferenceManager';
import * as ReservedWords from '../model-definition/attributes';

export enum CompletionItemDataType {
	ReservedWord,
	Symbol,
}

export type CompletionContext = {
	inAttribute: boolean,
	references: Reference[],
	declarations: SymbolDeclaration[],
	parentReference?: Reference,
	tag: string,
	word: string
}

export class CompletionProvider {
	private symbolAndReferenceManager: SymbolAndReferenceManager;
	constructor(symbolAndReferenceManager: SymbolAndReferenceManager) {
		this.symbolAndReferenceManager = symbolAndReferenceManager;
	}

	public getCompletionItems(context: CompletionContext): CompletionItem[] {
		const { word, inAttribute } = context;
		let symbolCompletions: CompletionItem[] = [];
		if (inAttribute && word != null) {
			symbolCompletions = this.getSymbolCompletions(word, context);
		}

		let attributeCompletions: CompletionItem[] = [];
		if (!inAttribute) {
			attributeCompletions = this.getAttributeCompletions(context);
		}

		const allCompletions = [
			...attributeCompletions,
			...symbolCompletions
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

	private getSymbolCompletions(word: string, context: CompletionContext): CompletionItem[] {
		let symbols = this.symbolAndReferenceManager.findSymbolsMatchingWord({ exactMatch: false, word });

		const reference = context.references.find(x => x.name == word);
		if (reference) {
			symbols = symbols.filter(x => x.type == reference.type);
		}
		const symbolCompletions: CompletionItem[] = this.mapSymbolsToCompletionItems(symbols);
		return symbolCompletions;
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

	private getDocumentationForSymbol(symbol: SymbolDeclaration): string {
		return symbol.comment || "";
	}

	private mapSymbolTypeToCompletionKind(type: ModelElementTypes): CompletionItemKind {
		switch(type)
		{
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