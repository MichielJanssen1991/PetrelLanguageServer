import * as LSP from 'vscode-languageserver';
import { symbolDeclarationDefinitions } from '../../model-definition/declarations';
import { ModelDefinitionManager, ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { referenceDefinitions } from '../../model-definition/references';
import { newReference, Reference, SymbolDeclaration, Definition, newSymbolDeclaration, ModelDetailLevel, ContextQualifiers, INodeContext, SymbolOrReference, NewDefinition, ModelElementTypes, ChildDefinition } from '../../model-definition/symbolsAndReferences';
import { FileParser } from './fileParser';
import { ISaxParserExtended, newSaxParserExtended, ProcessingInstruction } from './saxParserExtended';

export class ModelParser extends FileParser implements INodeContext {
	private parser: ISaxParserExtended;
	private parsedObjectStack: { depth: number, parsedObject: SymbolOrReference }[]
	private context: ModelFileContext = ModelFileContext.Unknown
	private contextModelDefinition: NewDefinition[] = [];
	private modelDefinitionManager: ModelDefinitionManager;
	private static MESSAGES: any = {
		NO_DEFINITION_FOUND_FOR_TAG: (tagName: string) => `No definition found for tag: '${tagName}'`,
		INVALID_CHILD_TAG: (tagName: string, tagNameParent: string, validChildren: ChildDefinition[]) => `Invalid child: Tag ${tagName} not known for parent: '${tagNameParent}'. Valid children are: ${validChildren.map(x => x.element)}`,
	}

	constructor(uri: string, detailLevel: ModelDetailLevel, modelDefinitionManager: ModelDefinitionManager) {
		super(uri, detailLevel);
		this.parser = newSaxParserExtended(this.onError.bind(this), this.onOpenTag.bind(this), this.onCloseTag.bind(this), this.onProcessingInstruction.bind(this));
		this.parsedObjectStack = [];
		this.modelDefinitionManager = modelDefinitionManager;

		this.parsedObjectStack.push({ depth: -1, parsedObject: this.results.tree });
	}

	public parseFile(fileContent: string) {
		this.parser.write(fileContent);
		this.parser.close();
		return this.getResults();
	}

	public getResults() {
		return this.results;
	}

	public getFirstParent() {
		return this.parser.getFirstParent();
	}

	public findParent(predicate: (n: any) => boolean) {
		return this.parser.findParent(predicate);
	}

	public hasParentTag(name: string) {
		return this.parser.hasParentTag(name);
	}

	public getRange() {
		return this.parser.getRange();
	}

	private onError(e: any) {
		this.addError(e.message);
	}

	private onOpenTag(node: any) {
		const tagName = node.name;
		this.validateNode(node);
		const definitions = symbolDeclarationDefinitions[tagName];
		let symbol, reference;
		if (definitions) {
			definitions.some(def => {
				symbol = this.parseNodeForDefinition(node, def);
				if (symbol) {
					this.pushToParsedObjectStack(symbol);
					return true;
				}
			});
		}

		if (!symbol) {
			const refDefinitions = referenceDefinitions[tagName];
			if (refDefinitions) {
				refDefinitions.some(def => {
					reference = this.parseNodeForReference(node, def);
					if (reference) {
						this.pushToParsedObjectStack(reference);
						return true;
					}
				});
			}
		}

		if (!symbol && !reference) {
			symbol = newSymbolDeclaration(node.name, node.name, ModelElementTypes.Unknown, this.getRange(), this.uri, false);
			this.pushToParsedObjectStack(symbol);
		}
	}

	private onCloseTag() {
		this.processParsedObjectStack();
	}

	private onProcessingInstruction(instruction: ProcessingInstruction) {
		if (instruction.name == "cp-edit") {
			switch (instruction.body.split("/")[1]) {
				case "rules": this.setModelFileContext(ModelFileContext.Rules); break;
				case "backend": this.setModelFileContext(ModelFileContext.Backend); break;
				case "frontend": this.setModelFileContext(ModelFileContext.Frontend); break;
				case "infosets": this.setModelFileContext(ModelFileContext.Infosets); break;
				default: break;
			}
		}
		return;
	}

	private setModelFileContext(context: ModelFileContext) {
		this.context = context;
		this.contextModelDefinition = this.modelDefinitionManager.getModelDefinition(context);
		this.results.modelFileContext = this.context;
	}

	private getNameSpace(): string {
		return this.getContextQualifiers().nameSpace || "";
	}

	private getContextQualifiers(): ContextQualifiers {
		const context: any = {};
		this.parsedObjectStack.forEach(item => {
			const currentContext = item.parsedObject.contextQualifiers;
			Object.keys(currentContext).forEach(key => {
				context[key] = (currentContext as any)[key];
			});
		});
		return context;
	}

	private getCurrentDepth() {
		return this.parser.tags.length;
	}

	// Push the ParsedObject to the parsedObjectStack
	private pushToParsedObjectStack(parsedObject: SymbolOrReference) {
		const depth = this.getCurrentDepth();
		this.parsedObjectStack.push({ depth: depth, parsedObject });
	}

	// Process parsed objects from the parsedObjectStack based on the depth the parser currently is in the xml structure 
	private processParsedObjectStack() {
		const depth = this.getCurrentDepth();
		let lastIndex = this.parsedObjectStack.length - 1;
		while (lastIndex >= 0 && this.parsedObjectStack[lastIndex].depth > depth) {
			lastIndex--;
			const item = this.parsedObjectStack.pop();
			if (item) {
				this.processParsedObjectFromStack(item, lastIndex);
			}
		}
	}

	private processParsedObjectFromStack(item: { depth: number; parsedObject: SymbolOrReference; }, lastIndex: number) {
		const { parsedObject } = item;
		parsedObject.contextQualifiers = this.getContextQualifiers();
		parsedObject.fullRange.end = this.getRange().end;
		const firstParent = lastIndex >= 0 ? this.parsedObjectStack[lastIndex] : undefined;
		if (firstParent) {
			this.parsedObjectStack[lastIndex].parsedObject.children.push(parsedObject);
		}
	}

	private parseNodeForDefinition(node: any, definition: Definition): SymbolDeclaration | undefined {
		const conditionMatches = this.conditionMatches(definition, node, this);
		if (conditionMatches && this.detailLevel >= definition.detailLevel) {
			const name = this.parseNodeForName(definition, node);
			const isObsolete = node.attributes.obsolete == "yes";
			const comment = node.attributes.comment;
			const symbol: SymbolDeclaration = newSymbolDeclaration(name, node.name, definition.type, this.getRange(), this.uri, isObsolete, comment);
			symbol.otherAttributes = this.parseOtherAttributes(definition, node);
			symbol.attributeReferences = this.parseAtributeRerences(definition, node);
			symbol.contextQualifiers = this.parseContextQualifiers(definition, node);
			return symbol;
		}

		return undefined;
	}

	private parseNodeForReference(node: any, definition: Definition): Reference | undefined {
		const conditionMatches = this.conditionMatches(definition, node, this);
		if (conditionMatches && this.detailLevel >= definition.detailLevel) {
			const name = this.parseNodeForName(definition, node);
			const reference = newReference(name, node.name, definition.type, this.getRange(), this.uri);

			reference.otherAttributes = this.parseOtherAttributes(definition, node);
			reference.attributeReferences = this.parseAtributeRerences(definition, node);
			reference.contextQualifiers = this.parseContextQualifiers(definition, node);
			return reference;
		}
		return undefined;
	}

	private validateNode(node: any) {
		const tagName = node.name;
		if (this.contextModelDefinition.length > 0) {
			const definition = this.contextModelDefinition.find(x => x.element == tagName);
			if (!definition) {
				this.addError(ModelParser.MESSAGES.NO_DEFINITION_FOUND_FOR_TAG(tagName));
			} else {
				const tagNameParent = this.parser.getFirstParent()?.name;
				const parentDefinition = this.contextModelDefinition?.find(x => x.element == tagNameParent);
				if (parentDefinition?.childs) {
					const childSelected = parentDefinition.childs.find(x => x.element == tagName);
					if (!childSelected) {
						this.addError(ModelParser.MESSAGES.INVALID_CHILD_TAG(tagName, tagNameParent, parentDefinition.childs));
					}
				}
			}
		}
	}

	private addError(message: string) {
		this.results.problems.push(LSP.Diagnostic.create(
			this.getRange(),
			message,
			LSP.DiagnosticSeverity.Error
		));
	}

	private parseAtributeRerences(definition: Definition, node: any): Record<string, Reference> {
		const attributeReferences: Record<string, Reference> = {};
		if (definition.attributeReferences) {
			definition.attributeReferences.forEach(attributeRefDefinition => {
				const attributeName = attributeRefDefinition.attribute;
				const attributeValue = node.attributes[attributeName];
				if (attributeValue) {
					const attributeReference = newReference(attributeValue, node.name, attributeRefDefinition.type, this.getRange(), this.uri);
					attributeReference.contextQualifiers = this.getContextQualifiers();
					attributeReferences[attributeName] = attributeReference;
				}
			});
		}
		return attributeReferences;
	}

	private parseOtherAttributes(definition: Definition, node: any) {
		const otherAttributesDefinition = definition.otherAttributes;
		const otherAttributes: Record<string, string | number | boolean> = {};
		if (otherAttributesDefinition) {
			Object.keys(otherAttributesDefinition).forEach(attr => {
				otherAttributes[attr] = otherAttributesDefinition[attr](node, this);
			});
		}
		return otherAttributes;
	}

	private parseContextQualifiers(definition: Definition, node: any) {
		const contextQualifierDefinition = definition.contextQualifiers;
		const contextQualifiers = contextQualifierDefinition ? contextQualifierDefinition(node, this) : {};
		if (node.attributes.obsolete == "yes") {
			contextQualifiers.isObsolete = true;
		}
		if (node.name == "module") {
			const nameSpace: string = node.attributes["target-namespace"];
			if (nameSpace) {
				contextQualifiers.nameSpace = nameSpace;
			}
		}

		return contextQualifiers;
	}

	private parseNodeForName(definition: Definition, node: any) {
		const nameFunction = definition.name || (function (node: any) { return node.attributes.name; });
		let name = nameFunction(node);
		if (definition.prefixNameSpace) {
			const nameSpace = this.getNameSpace();
			name = (nameSpace == "") ? name : `${nameSpace}.${name}`;
		}
		return name;
	}

	private conditionMatches(definition: Definition, node: any, nodeContext: INodeContext) {
		return (!definition.matchCondition) || (definition.matchCondition && definition.matchCondition(node, nodeContext));
	}
}