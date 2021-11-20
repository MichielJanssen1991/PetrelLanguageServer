import { Range } from 'vscode-languageserver-types';
import { definitionsPerTag } from '../../model-definition/declarations';
import { ModelDefinitionManager, ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { newReference, Reference, Definition, newSymbolDeclaration, ModelDetailLevel, ContextQualifiers, INodeContext, SymbolOrReference, NewDefinition, ModelElementTypes, ChildDefinition } from '../../model-definition/symbolsAndReferences';
import { FileParser } from './fileParser';
import { ISaxParserExtended, newSaxParserExtended, ProcessingInstruction } from './saxParserExtended';

export class ModelParser extends FileParser implements INodeContext {
	private parser: ISaxParserExtended;
	private parsedObjectStack: { depth: number, parsedObject: SymbolOrReference, definition?: Definition }[]
	private context: ModelFileContext = ModelFileContext.Unknown
	private contextModelDefinition: NewDefinition[] = [];
	private modelDefinitionManager: ModelDefinitionManager;
	private attributeRanges: Record<string, Range> = {};
	private static MESSAGES: any = {
		NO_DEFINITION_FOUND_FOR_TAG: (tagName: string) => `No definition found for tag: '${tagName}'`,
		INVALID_CHILD_TAG: (tagName: string, tagNameParent: string, validChildren: ChildDefinition[]) => `Invalid child: Tag ${tagName} not known for parent: '${tagNameParent}'. Valid children are: ${validChildren.map(x => x.element)}`,
	}

	constructor(uri: string, detailLevel: ModelDetailLevel, modelDefinitionManager: ModelDefinitionManager) {
		super(uri, detailLevel);
		this.parser = newSaxParserExtended(
			this.onError.bind(this),
			this.onOpenTag.bind(this),
			this.onAttribute.bind(this),
			this.onCloseTag.bind(this),
			this.onProcessingInstruction.bind(this)
		);
		this.parsedObjectStack = [];
		this.modelDefinitionManager = modelDefinitionManager;

		this.parsedObjectStack.push({ depth: -1, parsedObject: this.results.tree });
	}

	//FileParser methods
	public parseFile(fileContent: string) {
		this.parser.write(fileContent);
		this.parser.close();
		return this.results;
	}

	//INodeContext implementation
	public getFirstParent() {
		return this.parser.getFirstParent();
	}

	public findParent(predicate: (n: any) => boolean) {
		return this.parser.findParent(predicate);
	}

	public hasParentTag(name: string) {
		return this.parser.hasParentTag(name);
	}

	//Methods related to range or depth 
	public getTagRange() {
		return this.parser.getTagRange();
	}

	public getAttributeRange(attribute: { name: string; value: string; }) {
		return this.parser.getAttributeRange(attribute);
	}

	private getCurrentDepth() {
		return this.parser.tags.length;
	}

	//Namespace and other context qualifiers
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

	//Parser events
	private onError(e: any) {
		this.addError(this.getTagRange(), e.message);
	}

	private onAttribute(attribute: any) {
		this.attributeRanges[attribute.name] = this.getAttributeRange(attribute);
	}

	private onOpenTag(node: any) {
		const tagName = node.name;
		const definitions = definitionsPerTag[tagName];
		let object;

		// Validate node using new definition structure (might completely replace the old parsing)
		this.validateNode(node);
		
		//Parse object for definition, first matching definition wins
		if (definitions) {
			definitions.some(def => {
				object = this.parseNodeForDefinition(node, def);
				if (object) {
					this.pushToParsedObjectStack(object, def);
					return true;
				}
			});
		}

		//If no definition is found only add the parsed tag when detail level is All 
		if(this.detailLevel == ModelDetailLevel.All)
		{
			if (!object) {
				object = newSymbolDeclaration(node.name, node.name, ModelElementTypes.Unknown, this.getTagRange(), this.uri);
				this.pushToParsedObjectStack(object);
			}
		}

		this.attributeRanges = {};
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

	// Push the ParsedObject to the parsedObjectStack
	private pushToParsedObjectStack(parsedObject: SymbolOrReference, definition?: Definition) {
		const depth = this.getCurrentDepth();
		this.parsedObjectStack.push({ depth: depth, parsedObject, definition });
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
		parsedObject.fullRange.end = this.getTagRange().end;
		const firstParent = lastIndex >= 0 ? this.parsedObjectStack[lastIndex] : undefined;
		if (firstParent) {
			this.parsedObjectStack[lastIndex].parsedObject.children.push(parsedObject);
		}
	}

	private parseNodeForDefinition(node: any, definition: Definition): SymbolOrReference | undefined {
		const conditionMatches = this.conditionMatches(definition, node, this);
		if (conditionMatches && this.detailLevel >= definition.detailLevel) {
			const name = this.parseNodeForName(definition, node);
			let object: SymbolOrReference;
			const comment = node.attributes.comment;
			if (definition.isReference) {
				object = newReference(name, node.name, definition.type, this.getTagRange(), this.uri, comment);
			}
			else {
				object = newSymbolDeclaration(name, node.name, definition.type, this.getTagRange(), this.uri, comment);
			}

			const { attributeReferences, otherAttributes } = this.parseAttributes(definition, node);
			object.otherAttributes = otherAttributes;
			object.attributeReferences = attributeReferences;
			object.contextQualifiers = this.parseContextQualifiers(definition, node);
			return object;
		}

		return undefined;
	}

	private validateNode(node: any) {
		const tagName = node.name;
		if (this.contextModelDefinition.length > 0) {
			const definition = this.contextModelDefinition.find(x => x.element == tagName);
			if (!definition) {
				this.addError(this.getTagRange(), ModelParser.MESSAGES.NO_DEFINITION_FOUND_FOR_TAG(tagName));
			} else {
				const tagNameParent = this.parser.getFirstParent()?.name;
				const parentDefinition = this.contextModelDefinition?.find(x => x.element == tagNameParent);
				if (parentDefinition?.childs) {
					const childSelected = parentDefinition.childs.find(x => x.element == tagName);
					if (!childSelected) {
						this.addError(this.getTagRange(), ModelParser.MESSAGES.INVALID_CHILD_TAG(tagName, tagNameParent, parentDefinition.childs));
					}
				}
			}
		}
	}

	private parseAttributes(definition: Definition, node: any): { attributeReferences: Record<string, Reference>, otherAttributes: Record<string, string | boolean | number> } {
		const attributeReferences: Record<string, Reference> = {};
		const otherAttributes: Record<string, string | number | boolean> = {};
		if (definition.attributes) {
			definition.attributes.forEach(attributeRefDefinition => {
				const attributeName = attributeRefDefinition.attribute;
				const attributeValue = node.attributes[attributeName];
				if (attributeValue) {
					if (attributeRefDefinition.type != ModelElementTypes.Value) {
						const range = this.attributeRanges[attributeName];
						const attributeReference = newReference(attributeValue, node.name, attributeRefDefinition.type, range, this.uri);
						attributeReference.contextQualifiers = this.getContextQualifiers();
						attributeReferences[attributeName] = attributeReference;
					}
					else {
						otherAttributes[attributeName] = attributeValue;
					}
				}
			});
		}
		return { attributeReferences, otherAttributes };
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