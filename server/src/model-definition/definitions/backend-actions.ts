import { AttributeTypes, Definition, Definitions, ModelDetailLevel, ModelElementTypes } from '../types/definitions';
import { default_yes_no_attribute_type, comment_attribute, description_attribute, include_element } from './shared';

const action_definition_argument_element: Definition = {
	description: "Allows to define attributes/inputs/outputs shared per module",
	attributes: [
		{
			name: "name",
			required: true
		},
		{
			name: "type",
			types: [{
				type: AttributeTypes.Enum,
				options: [
					{
						name: "string"
					},
					{
						name: "integer"
					},
					{
						name: "boolean"
					},
					{
						name: "numeric"
					},
					{
						name: "xml"
					},
					{
						name: "xml-string"
					},
					{
						name: "mixed"
					},
					{
						name: "iid"
					},
					{
						name: "pipedlist"
					},
					{
						name: "xml-list"
					},
				]
			}]
		},
	],
	children: [
		{
			element: "annotation",
			occurence: "once"
		}
	]
};

export const BACKEND_ACTIONS_DEFINITION: Definitions = {
	"module": [{
		isGroupingElement:true,
		description: "Group action definitions",
		attributes: [
			{
				name: "name",
				description: "Namespace caption.",
				autoadd: true
			},
			{
				name: "description",
				description: "Caption to show to the user.",
				autoadd: true
				//required: true
			}
		],
		children: [] //For grouping element parents children are used
	}],
	"actions": [{
		description: "a collection of actions",
		attributes: [
			{
				name: "name",
				description: "Namespace caption."
			},
			description_attribute
		],
		children: [
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
				types: [default_yes_no_attribute_type]
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
				types: [default_yes_no_attribute_type]
			},
		],
		children: [
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
		attributes: [comment_attribute],
		children: [
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
				types: [{
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
				}]
			},
			comment_attribute
		],
		children: [
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
		attributes: [comment_attribute],
		children: [
			{
				element: "xml-text",
				occurence: "once"
			}
		]
	}],
	"validation-description": [{
		description: "A description of the desired value for this element. (TODO: Only for attributes where a validatestring is defined.)",
		attributes: [comment_attribute],
		children: [
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
		attributes: [comment_attribute],
		children: [
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
				types: [{
					type: AttributeTypes.Enum,
					options: [
						{
							name: "string"
						},
						{
							name: "bool"
						},
						{
							name: "int",
							obsolete: true // use numeric
						},
						{
							name: "numeric"
						},
						{
							name: "enum"
						},
						{
							name: "radio",
							obsolete: true // use enum
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
				}]			
			},
			{
				name: "required",
				description: "",
				types: [default_yes_no_attribute_type]
			},
			{
				name: "unique",
				description: "",
				types: [default_yes_no_attribute_type]
			},
			{
				name: "only-unique-if-set",
				description: "",
				types: [default_yes_no_attribute_type]
			},
			{
				name: "use-as-caption",
				description: "Indicates whether the value of this attribute is shown in the element label.",
				types: [default_yes_no_attribute_type]
			},
			{
				name: "default",
				description: "",
				types: [default_yes_no_attribute_type]
			},
			{
				name: "readonly",
				description: "",
				types: [default_yes_no_attribute_type]
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
			comment_attribute
		],
		children: [
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
			comment_attribute
		],
		children: [
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
				types: [{
					type: AttributeTypes.Enum,
					options: [
						{
							name: "true"
						},
						{
							name: "false"
						},
					]
				}]
			},
			comment_attribute
		],
		children: [
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
			comment_attribute
		],
		children: [
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
				types: [{
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute	// TODO: filter in ancestor attributes
				}]
			},
			{
				name: "compare",
				required: true,
				types: [{
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
				}]
			},
			{
				name: "value",
			},
			comment_attribute
		],
		children: []
	}],
	"inherit": [{
		description: "Inherits at attribute-level (to use attribute types)",
		attributes: [
			{
				name: "name",
				required: true,
				types: [{
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute	// TODO: filter in root attributes
				}]
			},
			comment_attribute
		],
		children: [
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
		attributes: [comment_attribute],
		children: []
	}],	
	"custom-rule": [{
		attributes: [comment_attribute],
		children: []
	}],	// no documentation available TODO check with platform if it's still in use
	"variable": [{
		attributes: [comment_attribute],
		children: []
		// only useful for modeler
	}],
	"include": [include_element]


};