import { time, timeEnd } from 'console';
import FuzzySearch = require('fuzzy-search');
import { Position, Range } from 'vscode-languageserver-types';
import { standaloneObjectTypes } from '../model-definition/definitions/other';
import { ModelFileContext } from '../model-definition/modelDefinitionManager';
import { ModelElementTypes } from '../model-definition/types/definitions';
import { Reference, SymbolDeclaration, TreeNode, Attribute } from '../model-definition/types/tree';
import { flattenNestedObjectValues, flattenObjectValues } from '../util/array';
import { pointIsInRange, rangeIsInRange } from '../util/other';
import { walkTree } from '../util/tree';
import { LookupTable } from './lookupTable';

type FileTrees = { [uri: string]: TreeNode }
type FileContexts = { [uri: string]: ModelFileContext | undefined }

export class SymbolAndReferenceManager {
	private symbolLookupTable: LookupTable<SymbolDeclaration> = new LookupTable<SymbolDeclaration>();
	private referenceLookupTable: LookupTable<Reference> = new LookupTable<Reference>();
	private uriToTree: FileTrees = {};
	private uriToModelFileContext: FileContexts = {};

	/**
	 * Get the list of all files known by the reference manager
	 */
	public getFiles(): string[] {
		return Object.keys(this.uriToTree);
	}

	/**
	 * Update the tree for a given file
	 */
	public updateTree(uri: string, tree: TreeNode, modelFileContext?: ModelFileContext) {
		time("Clearing lookup tables for old tree");
		this.symbolLookupTable.clearForUri(uri);
		this.referenceLookupTable.clearForUri(uri);
		timeEnd("Clearing lookup tables for old tree");

		this.uriToTree[uri] = tree;
		this.uriToModelFileContext[uri] = modelFileContext;

		time("Update lookup tables for new tree");
		this.updateTablesForTree(tree);
		timeEnd("Update lookup tables for new tree");
	}

	private updateTablesForTree(tree: TreeNode) {
		walkTree(tree, this.processNodeForDeclarations.bind(this), this.processAttributeForReferences.bind(this));
	}

	/**
	 * Returns the symbols for a given file by name
	 */
	public getSymbolsForFileByName(uri: string) {
		return this.symbolLookupTable.GetForFile(uri);
	}

	/**
	 * Returns the references for a given file by name
	 */
	public getReferencesForFileByName(uri: string) {
		return this.referenceLookupTable.GetForFile(uri);
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
		return flattenObjectValues(this.getSymbolsForFileByName(uri));
	}

	/**
	 * Returns the references for a given file
	 */
	public getReferencesForFile(uri: string) {
		return flattenObjectValues(this.getReferencesForFileByName(uri));
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
		return flattenNestedObjectValues(this.symbolLookupTable.getByNameByFile());
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
		return flattenNestedObjectValues(this.referenceLookupTable.getByNameByFile());
	}

	/**
	 * Find symbols matching the given word.
	 */
	public findSymbolsMatchingWord({ exactMatch, word }: { exactMatch: boolean, word: string }): SymbolDeclaration[] {
		const symbols: SymbolDeclaration[] = this.symbolLookupTable.getNames().flatMap(name => {
			const match = exactMatch ? name === word : name.startsWith(word);
			return match ? this.symbolLookupTable.getForName(name) : [];
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
		const referencedSymbol = (this.symbolLookupTable.getForName(name) || []).find(x => (x.type == reference.type));
		return referencedSymbol;
	}

	/**
	 * Find the references to a given symbol.
	 */
	public getReferencesForSymbol(symbol: SymbolDeclaration) {
		const caseSensitive = !(symbol.type == ModelElementTypes.Action);
		const name = caseSensitive ? symbol.name : symbol.name.toLowerCase();
		const referencesToSymbol = (this.referenceLookupTable.getForName(name) || []).filter(x => (x.type == symbol.type));
		return referencesToSymbol;
	}

	/**
	 * Find references matching the given word.
	 */
	public findReferencesMatchingWord({ exactMatch, word }: { exactMatch: boolean, word: string }): Reference[] {
		const references: Reference[] = this.referenceLookupTable.getNames().flatMap(name => {
			const match = exactMatch ? name === word : name.startsWith(word);
			return match ? this.referenceLookupTable.getForName(name) : [];
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

	/**
	 * printLinesOfCodeSummary: Print a summary of the lines of code and the number of object analyzed
	 */
	public printLinesOfCodeSummary() {
		const lines = {
			total: 0,
			rules: 0,
			views: 0,
			types: 0,
			functions: 0,
			infosets: 0,
			profiles: 0,
		};
		const counts = {
			rules: 0,
			views: 0,
			types: 0,
			functions: 0,
			infosets: 0,
			profiles: 0,
		};
		Object.values(this.uriToTree).forEach(tree => {
			const lastChildOrEmpty = tree.children.reverse().find(() => true);
			lines.total += lastChildOrEmpty ? lastChildOrEmpty?.fullRange.end.line : 0;
			walkTree(
				tree,
				node => {
					const nLines = node.fullRange.end.line - node.fullRange.start.line;
					switch (node.type) {
						case ModelElementTypes.Rule: lines.rules += nLines; counts.rules++; break;
						case ModelElementTypes.View: lines.views += nLines; counts.views++; break;
						case ModelElementTypes.Type: lines.types += nLines; counts.types++; break;
						case ModelElementTypes.Function: lines.functions += nLines; counts.functions++; break;
						case ModelElementTypes.Infoset: lines.infosets += nLines; counts.infosets++; break;
						case ModelElementTypes.Profile: lines.profiles += nLines; counts.profiles++; break;
					}
				},
				() => { return; }
			);
		});
		console.log("Number of code lines analyzed:");
		console.log(lines);
		console.log("Number of objects analyzed:");
		console.log(counts);
	}

	// Below code section contains code for updating the various lookup tables given a update of the parsed tree
	private processNodeForDeclarations(node: TreeNode) {
		if (node.isSymbolDeclaration) {
			const symbol = node as SymbolDeclaration;
			if (standaloneObjectTypes.has(symbol.type)) {
				const name = this.getSymbolKeyNameForLookupTable(symbol);
				this.symbolLookupTable.addObject(symbol, name);
			}
		}
	}

	private processAttributeForReferences(attribute: Attribute) {
		if (attribute.isReference) {
			const ref = attribute as Reference;
			if (standaloneObjectTypes.has(ref.type)) {
				const name = this.getReferenceKeyNameForLookupTable(ref);
				this.referenceLookupTable.addObject(ref, name);
			}
		}
	}

	private getSymbolKeyNameForLookupTable(symbol: SymbolDeclaration) {
		return symbol.type == ModelElementTypes.Action ? symbol.name.toLowerCase() : symbol.name;
	}
	private getReferenceKeyNameForLookupTable(reference: Reference) {
		return reference.type == ModelElementTypes.Action ? reference.value.toLowerCase() : reference.value;
	}
}
