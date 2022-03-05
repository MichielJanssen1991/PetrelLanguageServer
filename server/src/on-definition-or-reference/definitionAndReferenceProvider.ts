import { Location, LocationLink } from 'vscode-languageserver-protocol';
import { ActionContext } from '../generic/actionContext';
import { Reference, SymbolDeclaration } from '../model-definition/types/tree';
import { ModelManager } from '../symbol-and-reference-manager/modelManager';

export class DefinitionAndReferenceProvider {
	private modelManager: ModelManager;

	constructor(modelManager: ModelManager) {
		this.modelManager = modelManager;
	}

	public onDefinition(context: ActionContext) {
		const { node, word, attribute } = context;
		let symbols: SymbolDeclaration[] = [];
		if (node && attribute?.isReference) {
			const reference = attribute as Reference;
			const symbol = this.modelManager.getReferencedObject(reference);
			symbols = symbol ? [symbol] : [];
		} else {
			symbols = this.modelManager.findSymbolsMatchingWord({ exactMatch: true, word });
		}
		return this.getSymbolDefinitionLocationLinks(symbols);
	}

	public onReference(context: ActionContext) {
		const { node, word } = context;
		let references: Reference[] = [];
		if (node && node.isSymbolDeclaration && (node as SymbolDeclaration).name.endsWith(`.${word}`)) {
			references = this.modelManager.getReferencesForSymbol(node as SymbolDeclaration);
		} else {
			references = this.modelManager.findReferencesMatchingWord({ exactMatch: true, word });
		}

		return this.getReferenceLocations(references);
	}

	public async getSymbolDefinitionLocationLinks(symbols: SymbolDeclaration[]): Promise<LocationLink[]> {
		return symbols.map((def) => this.symbolDefinitionToLocationLink(def));
	}

	private symbolDefinitionToLocationLink(symbol: SymbolDeclaration): LocationLink {
		const locLink: LocationLink = {
			targetRange: symbol.range,
			targetSelectionRange: symbol.range,
			targetUri: symbol.uri,
		};
		return locLink;
	}

	private async getReferenceLocations(symbols: Reference[]): Promise<Location[]> {
		return symbols.map((def) => this.referenceToLocation(def));
	}

	private referenceToLocation(symbol: Reference): Location {
		const locLink: Location = {
			range: symbol.range,
			uri: symbol.uri,
		};
		return locLink;
	}
}