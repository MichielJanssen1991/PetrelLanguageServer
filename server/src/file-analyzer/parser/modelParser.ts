import { Range } from 'vscode-languageserver-types';
import { isNonPetrelModelTag } from '../../model-definition/definitions/other';
import { ModelDefinitionManager, ModelFileContext } from '../../model-definition/modelDefinitionManager';
import { newReference, Reference, newSymbolDeclaration, ModelDetailLevel, ContextQualifiers, IXmlNodeContext, TreeNode, Definition, ModelElementTypes, Attribute, ElementAttribute, newTreeNode } from '../../model-definition/symbolsAndReferences';
import { FileParser } from './fileParser';
import { ISaxParserExtended, newSaxParserExtended, XmlNode, ProcessingInstruction } from './saxParserExtended';

export class ModelParser extends FileParser implements IXmlNodeContext {
	private parser: ISaxParserExtended;
	private parsedObjectStack: { parsedObject: TreeNode, definition?: Definition }[] = [];
	private context: ModelFileContext = ModelFileContext.Unknown;
	private attributeRanges: Record<string, { range: Range, fullRange: Range }> = {};
	protected modelDefinitionManager: ModelDefinitionManager;

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

		this.parsedObjectStack.push({ parsedObject: this.results.tree });
	}

	//FileParser methods
	public parseFile(fileContent: string) {
		this.parser.write(fileContent);
		this.parser.close();
		return this.results;
	}

	//INodeContext implementation
	public getParent() {
		return this.getAncestor(1);
	}

	public getAncestor(level: number) {
		const parentNodeStack = this.parsedObjectStack;
		return parentNodeStack[parentNodeStack.length - level].parsedObject;
	}

	public getCurrentXmlNode() {
		return this.parser.tag;
	}

	public hasParentTag(name: string) {
		return this.parsedObjectStack.some(item => item.parsedObject.tag == name);
	}

	//Methods related to range
	public getTagRange() {
		return this.parser.getTagRange();
	}

	public getAttributeRanges(attribute: { name: string; value: string; }) {
		return { 
			range: this.parser.getAttributeValueRange(attribute), 
			fullRange: this.parser.getAttributeRange(attribute) };
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
		this.addMessage(this.getTagRange(), "MP0001", e.message);
	}

	private onAttribute(attribute: any) {
		//Store the attributes ranges when the parser emits the onAttribute event. Attributes are further parsed in onOpenTag
		this.attributeRanges[attribute.name] = this.getAttributeRanges(attribute);
	}

	private onOpenTag(node: XmlNode) {
		const tagName = node.name;
		this.deduceContextFromTag(tagName);
		this.parseNode(node);
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
	protected pushToParsedObjectStack(parsedObject: TreeNode, definition?: Definition) {
		this.parsedObjectStack.push({ parsedObject, definition });
	}

	// Get the latest ParsedObject from the parsedObjectStack
	protected getLatestParsedObjectFromStack() {
		return this.parsedObjectStack[this.parsedObjectStack.length - 1];
	}

	// Process parsed objects from the parsedObjectStack based on the depth the parser currently is in the xml structure 
	private processParsedObjectStack() {
		const context = this.getContextQualifiers();
		const item = this.parsedObjectStack.pop();
		if (item) {
			const { parsedObject, definition } = item;
			const parentIndex = this.parsedObjectStack.length - 1;
			const parent = parentIndex >= 0 ? this.parsedObjectStack[parentIndex] : undefined;
			//If no definition is found only add the parsed tag when detail level is All 
			if (this.detailLevel == ModelDetailLevel.All || definition) {
				parsedObject.contextQualifiers = context;
				parsedObject.fullRange.end = this.getTagRange().end;
				if (parent) {
					parsedObject.parent = parent.parsedObject;
					this.parsedObjectStack[parentIndex].parsedObject.children.push(parsedObject);
				}
			} else {
				//Transfer children
				if (parent) {
					parsedObject.children.forEach(child => {
						child.parent = parent.parsedObject;
						this.parsedObjectStack[parentIndex].parsedObject.children.push(child);
					});
				}
			}
		}
	}

	//Node parsing
	private parseNode(node: XmlNode) {
		let object;
		//Parse object for definition
		const definition = this.getModelDefinitionForCurrentNodeAndDetailLevel();
		if (definition) {
			object = this.parseNodeForDefinition(node, definition);
		} else {
			//Add bare minimum node if no matching definition found for parsing
			object = newTreeNode(node.name, ModelElementTypes.Unknown, this.getTagRange(), this.uri);
		}
		this.pushToParsedObjectStack(object, definition);
	}

	private parseNodeForDefinition(node: XmlNode, definition: Definition): TreeNode {
		let object: TreeNode;
		const type = definition.type || ModelElementTypes.Unknown;
		if (definition.isSymbolDeclaration) {
			const name = this.getSymbolName(definition, node);
			object = newSymbolDeclaration(name, node.name, type, this.getTagRange(), this.uri, definition.subtype);
			object.comment = node.attributes.comment;
		}
		else {
			object = newTreeNode(node.name, type, this.getTagRange(), this.uri, definition.subtype);
		}

		object.attributes = this.parseAttributes(definition, node);
		object.contextQualifiers = this.parseContextQualifiers(definition, node);
		return object;
	}

	private parseAttributes(definition: Definition, node: XmlNode): Record<string, Reference | Attribute> {
		let attributes: Record<string, Attribute | Reference> = {};
		if (definition.attributes) {
			definition.attributes.forEach(attributeDefinition => {
				const attribute = this.parseAttributeForDefinition(attributeDefinition, node);
				if (attribute) { attributes[attributeDefinition.name] = attribute; }
			});
		}

		// For now add fixed attributes for action calls (e.g. reference to rule / infoset or type).
		if (definition.type == ModelElementTypes.ActionCall) {
			attributes = { ...attributes, ...this.parseAdditionalActionCallAttributes(node) };
		}

		// When detail level is All add all attributes not yet recognized as otherattributes
		if (this.detailLevel == ModelDetailLevel.All) {
			const attributesNotRecognized = this.parseOtherAttributes(attributes, node);
			attributes = { ...attributes, ...attributesNotRecognized };
		}
		return attributes;
	}

	private parseOtherAttributes(attributes: Record<string, Attribute | Reference>, node: XmlNode) {
		const attributesNamesRecognized = new Set(Object.keys(attributes));
		const attributesNamesNotRecognized = Object.keys(node.attributes)
			.filter(attributeName => !attributesNamesRecognized.has(attributeName));
		const attributesNotRecognized = attributesNamesNotRecognized.reduce((obj: Record<string, Attribute>, attributeName) => {
			const attributeValue = node.attributes[attributeName];
			const { range, fullRange } = this.attributeRanges[attributeName];
			const attribute = { name: attributeName, value: attributeValue, range, fullRange };
			obj[attributeName] = attribute;
			return obj;
		}, {});
		return attributesNotRecognized;
	}

	private parseAdditionalActionCallAttributes(node: XmlNode) {
		const attributes: Record<string, Attribute | Reference> = {};
		const otherDefinition = this.modelDefinitionManager.getModelDefinition(ModelFileContext.Unknown);
		const actionCallDefinition = otherDefinition["action"].find(x => x.type == ModelElementTypes.ActionCall);
		if (actionCallDefinition && actionCallDefinition.attributes) {
			actionCallDefinition.attributes.forEach(attributeDefinition => {
				const attribute = this.parseAttributeForDefinition(attributeDefinition, node);
				if (attribute) { attributes[attributeDefinition.name] = attribute; }
			});
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

	private getSymbolName(definition: Definition, node: XmlNode) {
		let name = node.attributes.name;
		if (definition.prefixNameSpace) {
			const nameSpace = this.getNameSpace();
			name = (nameSpace == "") ? name : `${nameSpace}.${name}`;
		}
		return name;
	}

	private getModelDefinitionForCurrentNodeAndDetailLevel(): Definition | undefined {
		const definition = this.modelDefinitionManager.getModelDefinitionForCurrentNode(this.context, this);
		if (definition) {
			const defDetailLevel = definition.detailLevel != undefined ? definition.detailLevel : ModelDetailLevel.All;
			if (this.detailLevel >= defDetailLevel) {
				return definition;
			}
		}
		return undefined;
	}
}