import { time, timeEnd } from 'console';
import FuzzySearch = require('fuzzy-search');
import { Position, Range } from 'vscode-languageserver-types';
import { standaloneObjectTypes } from '../model-definition/definitions/other';
import { ModelFileContext } from '../model-definition/modelDefinitionManager';
import { ModelElementTypes, Reference, SymbolDeclaration, TreeNode, Attribute } from '../model-definition/symbolsAndReferences';
import { flattenNestedListObjects, flattenNestedObjectValues, flattenObjectValues } from '../util/array';
import { pointIsInRange, rangeIsInRange } from '../util/other';

type Symbols = { [name: string]: SymbolDeclaration[] }
type FileSymbols = { [uri: string]: Symbols }
type References = { [name: string]: Reference[] }
type FileReferences = { [uri: string]: References }
type FileTrees = { [uri: string]: TreeNode }
type FileContexts = { [uri: string]: ModelFileContext | undefined }

export class SymbolAndReferenceManager {
	private uriToSymbols: FileSymbols = {};
	private uriToReferences: FileReferences = {};
	private uriToTree: FileTrees = {};
	private uriToModelFileContext: FileContexts = {};
	private get symbolsByName(): Symbols {
		if (!this.symbolsByNameCached) {
			time("Reevaluating symbols by name cache");
			this.symbolsByNameCached = flattenNestedListObjects(this.uriToSymbols);
			timeEnd("Reevaluating symbols by name cache");
		}
		return this.symbolsByNameCached;
	}
	private get referencesByName(): References {
		if (!this.referencesByNameCached) {
			time("Reevaluating references by name cache");
			this.referencesByNameCached = flattenNestedListObjects(this.uriToReferences);
			timeEnd("Reevaluating references by name cache");
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
	public updateTree(url: string, tree: TreeNode, modelFileContext?: ModelFileContext) {
		this.referencesByNameCached = undefined;
		this.symbolsByNameCached = undefined;
		this.uriToTree[url] = tree;
		this.uriToSymbols[url] = {};
		this.uriToReferences[url] = {};
		this.uriToModelFileContext[url] = modelFileContext;
		this.walkNodes(tree);
	}

	private walkNodes(node: TreeNode) {
		this.processNode(node);
		node.children.forEach(x => this.walkNodes(x));

		Object.values(node.attributes).forEach(x => this.processAttribute(x));
	}

	private processNode(node: TreeNode) {
		if (standaloneObjectTypes.has(node.type)) {
			if (node.isSymbolDeclaration) {
				this.addSymbolDeclaration(node as SymbolDeclaration);
			}
		}
	}
	private processAttribute(attribute: Attribute) {
		if (attribute.isReference) {
			const ref = attribute as Reference;
			if (standaloneObjectTypes.has(ref.type)) {
				this.addReference(ref);
			}
		}
	}

	private addReference(reference: Reference) {
		const uri = reference.uri;
		const name = reference.type == ModelElementTypes.Action ? reference.value.toLowerCase() : reference.value;
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
	 * Returns all symbols
	 */
	private getAllSymbols(): SymbolDeclaration[] {
		return flattenNestedObjectValues(this.uriToSymbols);
	}

	/**
	 * Returns all symbols of a given type
	 */
	public getAllSymbolsForType(type: ModelElementTypes): SymbolDeclaration[] {
		return this.getAllSymbols().filter(x => x.type == type);
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
		const symbols: SymbolDeclaration[] = Object.keys(this.symbolsByName).flatMap(name => {
			const match = exactMatch ? name === word : name.startsWith(word);
			return match ? this.symbolsByName[name] : [];
		});
		return symbols;
	}

	/**
	 * Find all the symbols where something named 'name' of type 'type' has been defined.
	  */
	public findDefinition(type: ModelElementTypes, name: string): SymbolDeclaration[] {
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
		const name = caseSensitive ? reference.value : reference.value.toLowerCase();
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
		const references: Reference[] = Object.keys(this.referencesByName).flatMap(name => {
			const match = exactMatch ? name === word : name.startsWith(word);
			return match ? this.referencesByName[name] : [];
		});
		return references;
	}

	/**
	 * Get the node for the current position in the tree. Returns
	 * node: The deepest node representing the xml tag that the position is located in
	 * inTag: Whether the position is in the opening tag
	 * attribute: Which attribute the current position is in 
	 */
	public getNodeForPosition(uri: string, position: Position) {
		const node = this.findNodeForPositionInChildNodes(this.uriToTree[uri], position);
		const inTag = pointIsInRange(position, node.range);
		const attribute: Reference | Attribute | undefined = Object.values(node.attributes).find(x => pointIsInRange(position, x.fullRange));
		return { node, inTag, attribute };
	}

	private findNodeForPositionInChildNodes(node: TreeNode, position: Position): TreeNode {
		const childNode = node.children.find(x => pointIsInRange(position, x.fullRange));
		if (childNode) {
			return this.findNodeForPositionInChildNodes(childNode, position);
		} else {
			return node; //No matching child node, return self
		}
	}

	/**
	 * Get the node covering the range. Returns the deepest node for which the range is completely included in the node
	 * node: The deepest node representing the xml tag that the position is located in
	 */
	public getNodeCoveringRange(uri: string, range: Range) {
		return this.findDescendantCoveringRange(this.uriToTree[uri], range);
	}

	private findDescendantCoveringRange(node: TreeNode, range: Range): TreeNode {
		const childNode = node.children.find(node => rangeIsInRange(range, node.fullRange));
		if (childNode) {
			return this.findDescendantCoveringRange(childNode, range);
		} else {
			return node; //No matching child node, return self
		}
	}
}
