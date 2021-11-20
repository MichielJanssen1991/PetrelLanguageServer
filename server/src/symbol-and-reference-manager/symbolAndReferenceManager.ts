import FuzzySearch = require('fuzzy-search');
import { Position } from 'vscode-languageserver-types';
import { objectsTypesWhichRequireContext } from '../model-definition/declarations';
import { ModelFileContext } from '../model-definition/modelDefinitionManager';
import { ModelElementTypes, IsSymbolOrReference, Reference, SymbolDeclaration, SymbolOrReference } from '../model-definition/symbolsAndReferences';
import { flattenNestedListObjects, flattenNestedObjectValues, flattenObjectValues } from '../util/array';
import { pointIsInRange } from '../util/other';

type Symbols = { [name: string]: SymbolDeclaration[] }
type FileSymbols = { [uri: string]: Symbols }
type References = { [name: string]: Reference[] }
type FileReferences = { [uri: string]: References }
type FileTrees = { [uri: string]: SymbolDeclaration }
type FileContexts = { [uri: string]: ModelFileContext | undefined }

export class SymbolAndReferenceManager {
	private uriToSymbols: FileSymbols = {};
	private uriToReferences: FileReferences = {};
	private uriToTree: FileTrees = {};
	private uriToModelFileContext: FileContexts = {};
	private get symbolsByName(): Symbols {
		if (!this.symbolsByNameCached) {
			this.symbolsByNameCached = flattenNestedListObjects(this.uriToSymbols);
		}
		return this.symbolsByNameCached;
	}
	private get referencesByName(): References {
		if (!this.referencesByNameCached) {
			this.referencesByNameCached = flattenNestedListObjects(this.uriToReferences);
		}
		return this.referencesByNameCached;
	}
	private symbolsByNameCached: Symbols | undefined;
	private referencesByNameCached: References | undefined;

	/**
	 * Get the list of all files known by the reference manager
	 */
	public getFiles(): string[] {
		const symbolFiles = Object.keys(this.uriToSymbols);
		const referenceFiles = Object.keys(this.uriToReferences);
		return [...new Set([...symbolFiles, ...referenceFiles])];
	}

	/**
	 * Update the tree for a given file
	 */
	public updateTree(url: string, tree: SymbolDeclaration, modelFileContext?: ModelFileContext) {
		this.referencesByNameCached = undefined;
		this.symbolsByNameCached = undefined;
		this.uriToTree[url] = tree;
		this.uriToSymbols[url] = {};
		this.uriToReferences[url] = {};
		this.uriToModelFileContext[url] = modelFileContext;
		this.walkNodes(tree);
	}

	private walkNodes(node: SymbolOrReference) {
		this.processNode(node);
		node.children.forEach(x => this.walkNodes(x));
		Object.values(node.attributeReferences).forEach(x => this.processNode(x));
	}

	private processNode(node: SymbolOrReference) {
		if (!objectsTypesWhichRequireContext.has(node.type)) {
			switch (node.objectType) {
				case IsSymbolOrReference.Symbol: { this.addSymbolDeclaration(node as SymbolDeclaration); break; }
				case IsSymbolOrReference.Reference: { this.addNamedReference(node as Reference); break; }
			}
		}
	}

	private addNamedReference(reference: Reference) {
		const uri = reference.uri;
		const name = reference.type == ModelElementTypes.Action ? reference.name.toLowerCase() : reference.name;
		const namedReferencesForName = this.uriToReferences[uri][name] || [];
		namedReferencesForName.push(reference);
		this.uriToReferences[uri][name] = namedReferencesForName;
	}

	private addSymbolDeclaration(symbol: SymbolDeclaration) {
		const uri = symbol.uri;
		const name = symbol.type == ModelElementTypes.Action ? symbol.name.toLowerCase() : symbol.name;
		const namedDeclarationsForName = this.uriToSymbols[uri][name] || [];
		namedDeclarationsForName.push(symbol);
		this.uriToSymbols[uri][name] = namedDeclarationsForName;
	}

	/**
	 * Returns the symbols for a given file by name
	 */
	public getSymbolsForFileByName(uri: string) {
		return this.uriToSymbols[uri];
	}

	/**
	 * Returns the references for a given file by name
	 */
	public getReferencesForFileByName(uri: string) {
		return this.uriToReferences[uri];
	}

	/**
	 * Returns the tree for a given file
	 */
	public getTreeForFile(uri: string) {
		return this.uriToTree[uri];
	}

	/**
	 * Returns the symbols for a given file
	 */
	public getSymbolsForFile(uri: string) {
		return flattenObjectValues(this.uriToSymbols[uri]);
	}

	/**
	 * Returns the references for a given file
	 */
	public getReferencesForFile(uri: string) {
		return flattenObjectValues(this.uriToReferences[uri]);
	}

	/**
	 * Returns the references for a given file
	 */
	public getModelFileContextForFile(uri: string) {
		const context = this.uriToModelFileContext[uri];
		return (context != undefined) ? context : ModelFileContext.Unknown;
	}

	/**
	 * Returns the symbols for a given file and popsition
	 */
	public getSymbolsForPosition(uri: string, pos: Position) {
		return this.getSymbolsForFile(uri).filter(ref => pointIsInRange(ref.range, pos));
	}

	/**
	 * Returns the references for a given file and popsition
	 */
	public getReferencesForPosition(uri: string, pos: Position, useExtendedRange?: boolean) {
		if (useExtendedRange != true) {
			return this.getReferencesForFile(uri).filter(ref => pointIsInRange(ref.range, pos));
		}
		else {
			return this.getReferencesForFile(uri).filter(ref => pointIsInRange(ref.fullRange, pos));
		}
	}

	/**
	 * Returns all symbols
	 */
	private getAllSymbols(): SymbolDeclaration[] {
		return flattenNestedObjectValues(this.uriToSymbols);
	}

	/**
	 * Returns all references
	 */
	public getAllReferences(): Reference[] {
		return flattenNestedObjectValues(this.uriToReferences);
	}

	/**
	 * Find symbols matching the given word.
	 */
	public findSymbolsMatchingWord({ exactMatch, word }: { exactMatch: boolean, word: string }): SymbolDeclaration[] {
		const symbols: SymbolDeclaration[] = [];

		Object.keys(this.uriToSymbols).forEach(uri => {
			const declarationsInFile = this.uriToSymbols[uri] || {};
			Object.keys(declarationsInFile).map(name => {
				const match = exactMatch ? name === word : name.startsWith(word);
				if (match) {
					declarationsInFile[name].forEach(symbol => symbols.push(symbol));
				}
			});
		});
		return symbols;
	}

	/**
	 * Find all the symbols where something named 'name' of type 'type' has been defined.
	  */
	public findDefinition(type: string, name: string): SymbolDeclaration[] {
		let symbols: SymbolDeclaration[] = this.findSymbolsMatchingWord({ exactMatch: true, word: name });
		if (type != ModelElementTypes.Unknown) {
			symbols = symbols.filter(x => x.type == type);
		}
		return symbols;
	}

	/**
	 * Find all the symbols matching the query using fuzzy search.
	 */
	public search(query: string): SymbolDeclaration[] {
		const searcher = new FuzzySearch(this.getAllSymbols(), ['name'], {
			caseSensitive: true,
		});
		return searcher.search(query);
	}

	/**
	 * Find the referenced object for a given Reference.
	 */
	public getReferencedObject(reference: Reference) {
		const caseSensitive = !(reference.type == ModelElementTypes.Action);
		const name = caseSensitive ? reference.name : reference.name.toLowerCase();
		const referencedSymbol = (this.symbolsByName[name] || []).find(x => (x.type == reference.type));
		return referencedSymbol;
	}

	/**
	 * Find the references to a given symbol.
	 */
	public getReferencesForSymbol(symbol: SymbolDeclaration) {
		const caseSensitive = !(symbol.type == ModelElementTypes.Action);
		const name = caseSensitive ? symbol.name : symbol.name.toLowerCase();
		const referencesToSymbol = (this.referencesByName[name] || []).filter(x => (x.type == symbol.type));
		return referencesToSymbol;
	}

	/**
	 * Find references matching the given word.
	 */
	public findReferencesMatchingWord({ exactMatch, word }: { exactMatch: boolean, word: string }): Reference[] {
		const references: Reference[] = [];

		Object.keys(this.uriToReferences).forEach(uri => {
			const declarationsInFile = this.uriToReferences[uri] || {};
			Object.keys(declarationsInFile).map(name => {
				const match = exactMatch ? name === word : name.startsWith(word);
				if (match) {
					declarationsInFile[name].forEach(ref => references.push(ref));
				}
			});
		});
		return references;
	}

	/**
	 * Get a list of nodes for the current position in the tree. Each node is a child of the previous node
	 */
	public getNodesForPosition(uri: string, position: Position) {
		const nodes = [this.uriToTree[uri]];
		this.addSubNodesForPosition(nodes, this.uriToTree[uri], position);
		const lastNode = nodes[nodes.length - 1];
		const inTag = pointIsInRange(lastNode.range, position);
		const attribute = Object.values(lastNode.attributeReferences).find(x => pointIsInRange(x.fullRange, position));
		return { nodes, inTag, attribute };
	}

	private addSubNodesForPosition(nodes: SymbolOrReference[], node: SymbolOrReference, position: Position) {
		const childNode = node.children.find(x => pointIsInRange(x.fullRange, position));
		if (childNode) {
			nodes.push(childNode);
			this.addSubNodesForPosition(nodes, childNode, position);
		}
	}

}
