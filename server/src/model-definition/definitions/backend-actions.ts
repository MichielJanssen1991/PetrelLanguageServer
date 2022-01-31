import { AttributeTypes, Definitions, ModelDetailLevel, ModelElementTypes } from '../symbolsAndReferences';
import { action_definition_argument_element, default_yes_no_attribute_type, dev_comment_attribute } from './shared';

export const BACKEND_ACTIONS_DEFINITION: Definitions = {
	"module": [{
		isGroupingElement:true,
		description: "Group action definitions",
		attributes: [
			{
				name: "name",
				description: "Namespace caption.",
				required: true
			},
			{
				name: "description",
				description: "Caption to show to the user.",
				//required: true
			}
		],
		childs: [
			{
				element: "module"
			},
			{
				element: "action"
			},
			{
				element: "attribute"
			},
			{
				element: "input"
			},
			{
				element: "output"
			},
			{
				element: "annotation"
			}
		]
	}],
	"actions": [{
		description: "a collection of actions",
		attributes: [
			{
				name: "name",
				description: "Namespace caption."
			},
			{
				name: "description",
				description: ""
			},
		],
		childs: [
			{
				element: "annotation",
				required: true,
				occurence: "once"
			},
			{
				element: "module"
			},
			{
				element: "action"
			},
			{
				element: "element",
				occurence: "once"
			}
		]
	}],
	"action": [{
		description: "An action definition, containing instructions for the server how to handle this action.",
		type: ModelElementTypes.Action,
		isSymbolDeclaration: true,
		prefixNameSpace: true,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "show-in-frontend",
				type: default_yes_no_attribute_type
			},
			{
				name: "assembly",
				description: "Name of DLL where action is located",
			},
			{
				name: "rulename",	// TODO: check with platform if this is still used
				obsolete: true,
				description: "Links an action to a rule.",
				visibilityConditions: [
					{
						attribute: "assembly",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "classname",
			},
			{
				name: "name",
				required: true
			},
			{
				name: "caption",
				autoadd: true
			},
			{
				name: "external-invocable",
				description: "If the action may be called from the client (and frontend.xml), or only server side definitions (rules.xml and backend.xml) are allowed.",
				autoadd: true,
				type: default_yes_no_attribute_type
			},
		],
		childs: [
			{
				element: "attribute"
			},
			{
				element: "attribute-group"
			},
			{
				element: "input"
			},
			{
				element: "output"
			},
			{
				element: "annotation"
			}
		]
	}],
	"annotation": [{
		description: "Developer's comment on this element.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "documentation",
				required: true,
				occurence: "once"
			}
		]
	}],
	"documentation": [{
		description: "Documentation by Language",
		attributes: [
			{
				name: "xml:lang",
				description: "language",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "",
							description: "default"
						},
						{
							name: "NL",
							description: "Nederlands"
						},
						{
							name: "EN",
							description: "English"
						},
					]
				}
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "summary",
				occurence: "once"
			},
			{
				element: "xml-text"
			},
			{
				element: "validation-description",
				occurence: "once"
			},
			{
				element: "link"
			}
		]
	}],
	"summary": [{
		description: "Summarises the function of an element.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "xml-text",
				occurence: "once"
			}
		]
	}],
	"validation-description": [{
		description: "A description of the desired value for this element. (TODO: Only for attributes where a validatestring is defined.)",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "xml-text",
				occurence: "once"
			}
		]
	}],
	"xml-text": [
		// does nothing
	],
	"link": [
		// does nothing	
	],
	"element": [{
		description: "sharing, prototyping of attributes (refer by name) -- used by xmleditor rules production",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "attribute"
			},
			{
				element: "annotation"
			},
			{
				element: "variable"
			}
		]
	}],
	"input": [action_definition_argument_element],
	"output": [action_definition_argument_element],
	"attribute": [{
		description: "Metadata attribute.",
		type: ModelElementTypes.Attribute,
		isSymbolDeclaration: true,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "name",
				description: "Name of the attribute",
				required: true
			},
			{
				name: "caption",
				description: "The caption which the user will see. This can be used if the name cannot be changed (because of, e.g., backward compatibility issues) but it is badly chosen.",
			},
			{
				name: "type",
				description: "",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "string"
						},
						{
							name: "bool"
						},
						{
							name: "int"
						},
						{
							name: "enum"
						},
						{
							name: "text"
						},
						{
							name: "color"
						},
						{
							name: "file"
						},
						{
							name: "field-with-button"
						},
						{
							name: "lookup"
						},
					]
				}				
			},
			{
				name: "required",
				description: "",
				type: default_yes_no_attribute_type
			},
			{
				name: "unique",
				description: "",
				type: default_yes_no_attribute_type
			},
			{
				name: "only-unique-if-set",
				description: "",
				type: default_yes_no_attribute_type
			},
			{
				name: "use-as-caption",
				description: "Indicates whether the value of this attribute is shown in the element label.",
				type: default_yes_no_attribute_type
			},
			{
				name: "default",
				description: "",
				type: default_yes_no_attribute_type
			},
			{
				name: "readonly",
				description: "",
				type: default_yes_no_attribute_type
			},
			{
				name: "validatestring",
				description: "regular expression for validating this attribute (for type=string or type=text)",
				visibilityConditions:[
					{
						attribute: "type",
						condition: "==",
						value: "text"
					}
				]
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "option"
			},
			{
				element: "inherit"
			},
			{
				element: "annotation",
				occurence: "once"
			},
		]
	}],
	"attribute-group": [{
		description: "Grouped set of attributes.",
		type: ModelElementTypes.Attribute,
		isSymbolDeclaration: true,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [
			{
				name: "title",
				description: "Unique label of the group."
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "attribute-group"
			},
			{
				element: "attribute"
			},
			{
				element: "attribute-hide"
			}
		]
	}],
	"attribute-hide": [{
		description: "Conditional hiding of attributes.",
		attributes: [
			{
				name: "flag",
				description: "Used as a unique identifier."
			},
			{
				name: "negate",
				description: "",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "true"
						},
						{
							name: "false"
						},
					]
				}
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "when"
			},
			{
				element: "attribute"
			},
			{
				element: "attribute-group"
			},
			{
				element: "attribute-hide"
			}
		]
	}],
	"option": [{
		description: "Metadata attribute value.",
		attributes: [
			{
				name: "value"
			},
			{
				name: "caption"
			},
			{
				name: "icon"
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "annotation"
			}
		]
	}],
	"when": [{
		description: "Attribute hide condition (add more for OR).",
		attributes: [
			{
				name: "attribute",
				required: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute	// TODO: filter in ancestor attributes
				}
			},
			{
				name: "compare",
				required: true,
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "EQ",
							description: "equals"
						},
						{
							name: "NEQ",
							description: "does not equal"
						},
						{
							name: "EQi",
							description: "equals (case insensitive)"
						}
					]
				}
			},
			{
				name: "value",
			},
			dev_comment_attribute
		],
		childs: []
	}],
	"inherit": [{
		description: "Inherits at attribute-level (to use attribute types)",
		attributes: [
			{
				name: "name",
				required: true,
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute	// TODO: filter in root attributes
				}
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "include"
			},
			{
				element: "xml-rules"
			},
		]
	}],
	"xml-rules": [{	// TODO check with platform if it's still in use
		description: "XML Modeler rules additions.",
		attributes: [dev_comment_attribute],
		childs: []
	}],	
	"custom-rule": [{
		attributes: [dev_comment_attribute],
		childs: []
	}],	// no documentation available TODO check with platform if it's still in use
	"variable": [{
		attributes: [dev_comment_attribute],
		childs: []
		// only useful for modeler
	}],

};