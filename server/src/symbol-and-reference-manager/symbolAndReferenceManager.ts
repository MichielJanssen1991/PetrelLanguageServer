import { time, timeEnd } from 'console';
import FuzzySearch = require('fuzzy-search');
import { Position, Range } from 'vscode-languageserver-types';
import { standaloneObjectTypes } from '../model-definition/definitions/other';
import { ModelFileContext } from '../model-definition/modelDefinitionManager';
import { ModelElementTypes, Reference, SymbolDeclaration, TreeNode, Attribute } from '../model-definition/symbolsAndReferences';
import { flattenNestedObjectValues, flattenObjectValues } from '../util/array';
import { pointIsInRange, rangeIsInRange } from '../util/other';
import { walkTree } from '../util/tree';

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
	private symbolsByName: Symbols = {}
	private referencesByName: References = {}

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
	public updateTree(uri: string, tree: TreeNode, modelFileContext?: ModelFileContext) {
		time("Clearing lookup tables for old tree");
		this.clearLookupTablesForFile(uri);
		timeEnd("Clearing lookup tables for old tree");

		this.uriToTree[uri] = tree;
		this.uriToSymbols[uri] = {};
		this.uriToReferences[uri] = {};
		this.uriToModelFileContext[uri] = modelFileContext;
		time("Update lookup tables for new tree");
		this.updateTablesForTree(tree);
		timeEnd("Update lookup tables for new tree");
	}

	private updateTablesForTree(tree: TreeNode) {
		walkTree(tree, this.processNodeForDeclaratations.bind(this), this.processAttributeForReferences.bind(this));
	}

	private clearLookupTablesForFile(uri:string) {
		const references = this.uriToReferences[uri];
		if(references){
			const referenceNames = Object.keys(references);
			referenceNames.forEach(name=> this.removeReference(uri,name));
		}
		const symbols = this.uriToSymbols[uri];
		if(symbols){
			const symbolNames = Object.keys(symbols);
			symbolNames.forEach(name=> this.removeSymbolDeclaration(uri,name));
		}
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
		const attribute: Reference | Attribute | undefined = Object.values(node.attributes).find(x => pointIsInRange(position, x.range));
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

	// Below code section contains code for updating the various lookup tables given a update of the parsed tree
	private processNodeForDeclaratations(node: TreeNode) {
		if (standaloneObjectTypes.has(node.type)) {
			if (node.isSymbolDeclaration) {
				this.addSymbolDeclaration(node as SymbolDeclaration);
			}
		}
	}

	private processAttributeForReferences(attribute: Attribute) {
		if (attribute.isReference) {
			const ref = attribute as Reference;
			if (standaloneObjectTypes.has(ref.type)) {
				this.addReference(ref);
			}
		}
	}

	private pushToReferencesByName(name: string, reference: Reference) {
		const referencesForName = this.referencesByName[name] || [];
		referencesForName.push(reference);
		this.referencesByName[name] = referencesForName;
	}

	private pushToSymbolsByName(name: string, symbol: SymbolDeclaration) {
		const namedDeclarationsForName = this.symbolsByName[name] || [];
		namedDeclarationsForName.push(symbol);
		this.symbolsByName[name] = namedDeclarationsForName;
	}

	private pushToReferencesByNameByFile(uri: string, name: string, reference: Reference) {
		const namedReferencesForNameAndFile = this.uriToReferences[uri][name] || [];
		namedReferencesForNameAndFile.push(reference);
		this.uriToReferences[uri][name] = namedReferencesForNameAndFile;
	}

	private pushToSymbolsByNameByFile(uri: string, name: string, symbol: SymbolDeclaration) {
		const namedDeclarationsForNameAndFile = this.uriToSymbols[uri][name] || [];
		namedDeclarationsForNameAndFile.push(symbol);
		this.uriToSymbols[uri][name] = namedDeclarationsForNameAndFile;
	}

	private addReference(reference: Reference) {
		const uri = reference.uri;
		const name = this.getReferenceKeyNameForLookupTable(reference);
		this.pushToReferencesByName(name, reference);
		this.pushToReferencesByNameByFile(uri, name, reference);
	}

	private addSymbolDeclaration(symbol: SymbolDeclaration) {
		const uri = symbol.uri;
		const name = this.getSymbolKeyNameForLookupTable(symbol);
		this.pushToSymbolsByName(name, symbol);
		this.pushToSymbolsByNameByFile(uri, name, symbol);
	}

	private removeReference(uri: string, name:string) {
		let namedDeclarationsForName = this.referencesByName[name] || [];
		namedDeclarationsForName = namedDeclarationsForName.filter(x => x.uri != uri);
		this.referencesByName[name] = namedDeclarationsForName;
	}

	private removeSymbolDeclaration(uri: string, name:string) {
		let namedDeclarationsForName = this.symbolsByName[name] || [];
		namedDeclarationsForName = namedDeclarationsForName.filter(x => x.uri != uri);
		this.symbolsByName[name] = namedDeclarationsForName;
	}

	private getSymbolKeyNameForLookupTable(symbol: SymbolDeclaration) {
		return symbol.type == ModelElementTypes.Action ? symbol.name.toLowerCase() : symbol.name;
	}
	private getReferenceKeyNameForLookupTable(reference: Reference) {
		return reference.type == ModelElementTypes.Action ? reference.value.toLowerCase() : reference.value;
	}
}
