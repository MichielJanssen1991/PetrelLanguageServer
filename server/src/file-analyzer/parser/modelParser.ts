import { Range } from 'vscode-languageserver-types';
import { isNonPetrelModelTag } from '../../model-definition/definitions/other';
import { ModelDefinitionManager, ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { newReference, Reference, newSymbolDeclaration, ModelDetailLevel, ContextQualifiers, IXmlNodeContext, TreeNode, Definition, ModelElementTypes, ChildDefinition, Attribute, Definitions, ElementAttribute, newTreeNode } from '../../model-definition/symbolsAndReferences';
import { FileParser } from './fileParser';
import { ISaxParserExtended, newSaxParserExtended, XmlNode, ProcessingInstruction } from './saxParserExtended';

export class ModelParser extends FileParser implements IXmlNodeContext {
	private parser: ISaxParserExtended;
	private parsedObjectStack: { depth: number, parsedObject: TreeNode, definition?: Definition }[] = [];
	private context: ModelFileContext = ModelFileContext.Unknown;
	private modelDefinitionManager: ModelDefinitionManager;
	private attributeRanges: Record<string, { range: Range, fullRange: Range }> = {};
	private static MESSAGES: any = {
		NO_DEFINITION_FOUND_FOR_TAG: (tagName: string) => `No definition found for tag: '${tagName}'`,
		INVALID_CHILD_TAG: (tagName: string, tagNameParent: string, validChildren: ChildDefinition[]) => `Invalid child: Tag ${tagName} not known for parent: '${tagNameParent}'. Valid children are: ${validChildren.map(x => x.element)}`,
	}

	constructor(uri: string, detailLevel: ModelDetailLevel, modelDefinitionManager: ModelDefinitionManager) {
		super(uri, detailLevel);
		this.setModelFileContext(ModelFileContext.Unknown);
		this.parser = newSaxParserExtended(
			this.onError.bind(this),
			this.onOpenTag.bind(this),
			this.onAttribute.bind(this),
			this.onCloseTag.bind(this),
			this.onProcessingInstruction.bind(this)
		);
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

	public hasParentTag(name: string) {
		return this.parser.hasParentTag(name);
	}

	public getCurrentXmlNode() {
		return this.parser.getCurrentXmlNode();
	}

	//Methods related to range or depth 
	public getTagRange() {
		return this.parser.getTagRange();
	}

	public getAttributeRanges(attribute: { name: string; value: string; }) {
		return { range: this.parser.getAttributeValueRange(attribute), fullRange: this.parser.getAttributeRange(attribute) };
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
		//Store the attributes ranges when the parser emits the onAttribute event. Attributes are further parsed in onOpenTag
		this.attributeRanges[attribute.name] = this.getAttributeRanges(attribute);
	}

	private onOpenTag(node: XmlNode) {
		const tagName = node.name;
		this.deduceContextFromTag(tagName);
		const definition = this.getModelDefinitionForCurrentNode();
		let object;

		// Validate node using new definition structure (To be removed when these checks are included in ModelDefinitionCheck)
		if (this.context != ModelFileContext.Unknown) {
			this.validateNode(node, definition);
		}

		//Parse object for definition
		if (definition) {
			object = this.parseNodeForDefinition(node, definition);
			if (object) {
				this.pushToParsedObjectStack(object, definition);
			}
		}

		//If no definition is found only add the parsed tag when detail level is All 
		if (this.detailLevel == ModelDetailLevel.All && !object) {
			object = newTreeNode(node.name, ModelElementTypes.Unknown, this.getTagRange(), this.uri);
			this.pushToParsedObjectStack(object);
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
				case "actions.backend": this.setModelFileContext(ModelFileContext.BackendActions); break;
				default: break;
			}
		}
		return;
	}

	private deduceContextFromTag(tagName: string) {
		//To be compatible with premium files the modelFileContext is swithed to Other when premium specific tags are found
		if (isNonPetrelModelTag(tagName)) {
			this.setModelFileContext(ModelFileContext.Unknown);
		}
		return;
	}

	private setModelFileContext(context: ModelFileContext) {
		this.context = context;
		this.results.modelFileContext = this.context;
	}

	// Push the ParsedObject to the parsedObjectStack
	private pushToParsedObjectStack(parsedObject: TreeNode, definition?: Definition) {
		const depth = this.getCurrentDepth();
		this.parsedObjectStack.push({ depth: depth, parsedObject, definition });
	}

	// Process parsed objects from the parsedObjectStack based on the depth the parser currently is in the xml structure 
	private processParsedObjectStack() {
		const depth = this.getCurrentDepth();
		let lastIndex = this.parsedObjectStack.length - 1;
		while (lastIndex >= 0 && this.parsedObjectStack[lastIndex].depth > depth) {
			lastIndex--;
			const context = this.getContextQualifiers();
			const item = this.parsedObjectStack.pop();
			if (item) {
				this.processParsedObjectFromStack(item, context);
			}
		}
	}

	private processParsedObjectFromStack(item: { depth: number; parsedObject: TreeNode; }, context: ContextQualifiers) {
		const { parsedObject } = item;
		parsedObject.contextQualifiers = context;
		parsedObject.fullRange.end = this.getTagRange().end;
		const parentIndex = this.parsedObjectStack.length - 1;
		const firstParent = parentIndex >= 0 ? this.parsedObjectStack[parentIndex] : undefined;
		if (firstParent) {
			parsedObject.parent = firstParent.parsedObject;
			this.parsedObjectStack[parentIndex].parsedObject.children.push(parsedObject);
		}
	}

	private parseNodeForDefinition(node: XmlNode, definition: Definition): TreeNode | undefined {
		if (this.detailLevel >= (definition.detailLevel != undefined ? definition.detailLevel : ModelDetailLevel.All)) {
			let object: TreeNode;
			const comment = node.attributes.comment;
			const type = definition.type || ModelElementTypes.Unknown;
			if (definition.isSymbolDeclaration) {
				const name = this.parseNodeForName(definition, node);
				object = newSymbolDeclaration(name, node.name, type, this.getTagRange(), this.uri, comment);
			}
			else {
				object = newTreeNode(node.name, type, this.getTagRange(), this.uri);
			}

			object.attributes = this.parseAttributes(definition, node);
			object.contextQualifiers = this.parseContextQualifiers(definition, node);
			return object;
		}

		return undefined;
	}

	private validateNode(node: XmlNode, definition?: Definition) {
		const tagName = node.name;
		if (!definition) {
			this.addError(this.getTagRange(), ModelParser.MESSAGES.NO_DEFINITION_FOUND_FOR_TAG(tagName, node));
		} else {
			const parentNode = this.parser.getFirstParent();
			const parentDefinition = this.getModelDefinitionForParentNode();
			if (parentNode && parentDefinition) {
				if (parentDefinition?.childs) {
					const tagNameParent = parentNode.name;
					if (Array.isArray(parentDefinition.childs)){
						const childSelected = parentDefinition.childs.find(x => x.element == tagName);
						if (!childSelected) {
							this.addError(this.getTagRange(), ModelParser.MESSAGES.INVALID_CHILD_TAG(tagName, tagNameParent, parentDefinition.childs));
						}
					}					
				}
			}
		}
	}

	private parseAttributes(definition: Definition, node: XmlNode):  Record<string, Reference|Attribute> {
		let attributes: Record<string, Attribute|Reference> = {};
		if (definition.attributes) {
			definition.attributes.forEach(attributeDefinition => {
				const attribute = this.parseAttributeForDefinition(attributeDefinition, node);
					if (attribute) { attributes[attributeDefinition.name] = attribute; }
			});
		}

		// For now add fixed attributes for action calls (e.g. reference to rule / infoset or type) based on the old definition, should use action defintions 
		if (definition.type == ModelElementTypes.ActionCall) {
			const otherDefinition = this.modelDefinitionManager.getModelDefinition(ModelFileContext.Unknown);
			const actionCallDefinition = otherDefinition["action"].find(x => x.type == ModelElementTypes.ActionCall);
			if (actionCallDefinition && actionCallDefinition.attributes) {
				actionCallDefinition.attributes.forEach(attributeDefinition => {
					const attribute = this.parseAttributeForDefinition(attributeDefinition, node);
					if (attribute) { attributes[attributeDefinition.name] = attribute; }
				});
			}
		}

		// When detail level is All add all attributes not yet recognized as otherattributes
		if (this.detailLevel == ModelDetailLevel.All) {
			const attributesRecognized = new Set(Object.keys(attributes));
			const attributesNotRecognized = Object.keys(node.attributes).filter(attributeName => !attributesRecognized.has(attributeName)).reduce((obj: Record<string, Attribute>, attributeName) => {
				const attributeValue = node.attributes[attributeName];
				const { range, fullRange } = this.attributeRanges[attributeName];
				const attribute = { name: attributeName, value: attributeValue, range, fullRange };
				obj[attributeName] = attribute;
				return obj;
			}, {});
			attributes = { ...attributes, ...attributesNotRecognized };
		}
		return attributes;
	}

	private parseAttributeForDefinition(attributeDefinition: ElementAttribute, node: XmlNode) {
		let attribute;
		const attributeName = attributeDefinition.name;
		const attributeValue = node.attributes[attributeName];
		if (attributeValue) {
			const { range, fullRange } = this.attributeRanges[attributeName];
			const relatedto = attributeDefinition.type?.relatedTo;
			if (relatedto) {
				attribute = newReference(attributeName, attributeValue, relatedto, range, fullRange, this.uri);
			}
			else {
				attribute = { name: attributeName, value: attributeValue, range, fullRange };
			}
		}
		return attribute;
	}

	private parseContextQualifiers(definition: Definition, node: XmlNode) {
		const contextQualifierDefinition = definition.contextQualifiers;
		const contextQualifiers = contextQualifierDefinition ? contextQualifierDefinition(this) : {};
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

	private parseNodeForName(definition: Definition, node: XmlNode) {
		const nameFunction = definition.name || (function (node: XmlNode) { return node.attributes.name; });
		let name = nameFunction(node);
		if (definition.prefixNameSpace) {
			const nameSpace = this.getNameSpace();
			name = (nameSpace == "") ? name : `${nameSpace}.${name}`;
		}
		return name;
	}

	private getModelDefinitionForCurrentNode() {
		return this.modelDefinitionManager.getModelDefinitionForCurrentNode(this.context, this);
	}

	private getModelDefinitionForParentNode() {
		const numberOfParsedParents = this.parsedObjectStack.length;
		if (numberOfParsedParents > 0) {
			return this.parsedObjectStack[numberOfParsedParents - 1].definition;
		}
	}
}