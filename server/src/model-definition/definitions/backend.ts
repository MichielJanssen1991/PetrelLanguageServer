import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { action_argument_element, action_output_element, dev_comment_attribute, default_yes_no_attribute_type, target_namespace_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element, dev_obsolete_attribute, dev_obsolete_message_attribute, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute } from './shared';
export const BACKEND_DEFINITION: Definitions = {
	"root": [{
		attributes: [
			{
				name: "documentlocation",
				description: "relative location for the documents which are included in the rules"
			}
		],
		childs: [
			{
				element: "application",
				occurence: "once"
			}
		]
	}],
	"application": [{
		attributes: [
			{
				name: "name",
				description: "The unique name of the application"
			}
		],
		childs: [
			{
				element: "module"
			},
			{
				element: "type"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			},
			{
				element: "include"
			},
			{
				element: "model-condition"
			},
			{
				element: "merge-instruction"
			},
			{
				element: "decorators"
			},
			{
				element: "decorations",
				occurence: "once"
			}
		]
	}],
	"module": [{
		type: ModelElementTypes.Module,
		description: "Used for grouping model entities and model namespacing.",
		attributes: [
			{
				name: "name",
				description: "The name of the module"
			},
			target_namespace_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "module"
			},
			{
				element: "type"
			},
			{
				element: "include-blocks"
			},
			{
				element: "include-block"
			},
			{
				element: "include"
			},
			{
				element: "model-condition"
			},
			{
				element: "merge-instruction"
			},
			{
				element: "decorations",
				occurence: "once"
			}
		]
	}],
	"type": [{
		type: ModelElementTypes.Type,
		prefixNameSpace: true,
		description: "",
		attributes: [
			{
				name: "name",
				description: "Unique name for the type. The type name should only consist of letters and numbers and should start with a letter. This name is also used in the table definition in the database.Recommendation: It is of the utmost importance to use a clear and unambiguous method of naming. Philips VitalHealth recommends to assign a name to the type in plural and to let it start with a capital.",
				required: true,
				validations: [
					{
						type: "regex",
						value: /[A-Za-z][A-Za-z0-9]*/,
						message: "The type name should only consist of letters and numbers and should start with a letter."
					}
				]
			},
			{
				name: "type",
				description: "A type this type inherits from.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				},
				detailLevel: ModelDetailLevel.References
			},
			{
				name: "caption",
				description: "Type Caption. The caption should be a human readable name for the type, and is meant to be used in the user interface. The caption is also used when generating webservices.The description of the caption is retrieved via the translation module.",
				autoadd: true
			},
			{
				name: "searchcolumn",
				description: "Default list search column in the frontend."
			},
			{
				name: "is-abstract",
				description: "If the type is abstract, that is, cannot have instances. Can be used for type inheritance structures.",
				type: default_yes_no_attribute_type
			},
			{
				name: "system-table",
				description: "If the type is a system type. This influences, e.g., if the type is included in Export.",
				type:
				{
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "yes"
						},
						{
							name: "no",
						},
						{
							name: "",
							description: "(default) no"
						}
					]
				}
			},
			{
				name: "iid-field",
				description: "The field which contains the identifier of the instances."
			},
			{
				name: "store-context-info",
				description: "If context info storage should be enabled for this type specifically. May be used for logging types. See also the corresponding application setting.",
				type: default_yes_no_attribute_type
			},
			{
				name: "persistence",
				description: "The way the data for this type is retrieved and saved.",
				type: {
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "",
							description: "Default XML Persistence"
						},
						{
							name: "Virtual",
							description: "This persistence saves and gets the data from a different type (specified with the attribute \"persistent-in-type\"). This is a technical solution that may be used for more purposes.</summary>One use is that subclasses of a type may be represented, such as PhlegmaticPatient as a subclass of Patients. A \"virtual filter\" may be added in this case to filter the Patients on the property \"suffers-from\" with the value \"Phlegmatism\". Another use is to provide different views on a type for performance reasons. You can e.g. provide a simple Patient type and a Patient type with also contains some relation fields."
						},
						{
							name: "CompanyInspecific",
							description: "A table multiple companies share."
						},
						{
							name: "Null",
							description: ""
						},
						{
							name: "Cache",
							description: ""
						},

					]
				}
			},
			{
				name: "company-specific-caching",
				description: "If the persistence is set to cache, this specifies whether or not to use the company name as key for the caching. By default it does (yes). If no, then the key will be company inspecific, hence the cache will be company inspecific.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "persistence",
						condition: "==",
						value: "Cache"
					}
				]
			},
			{
				name: "base-persistence",
				description: "The persistence used as base persistence.",
				type: {
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "Virtual",
							description: "This persistence saves and gets the data from a different type (specified with the attribute \"persistent-in-type\"). This is a technical solution that may be used for more purposes.</summary>One use is that subclasses of a type may be represented, such as PhlegmaticPatient as a subclass of Patients. A \"virtual filter\" may be added in this case to filter the Patients on the property \"suffers-from\" with the value \"Phlegmatism\". Another use is to provide different views on a type for performance reasons. You can e.g. provide a simple Patient type and a Patient type with also contains some relation fields."
						},
						{
							name: "CompanyInspecific",
							description: "A table multiple companies share."
						}						
					]
				},
				visibilityConditions: [
					{
						attribute: "persistence",
						condition: "==",
						value: "CompanyInspecific"
					}
				]
			},
			{
				name: "persistent-in-type",
				description: "The type on which the virtual persistence is based.",
				type:
				{
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				},
				visibilityConditions: [
					{
						attribute: "persistence",
						condition: "==",
						value: "Virtual"
					}
				],
				requiredConditions: [
					{
						attribute: "persistence",
						condition: "==",
						value: "Virtual"
					}
				]
			},
			{
				name: "virtual-filter",
				description: "A filter from the base type to select. It is also possible to define a virtual-filter under this type instead.",
				visibilityConditions: [
					{
						attribute: "persistence",
						condition: "==",
						value: "Virtual"
					}
				]
			},
			{
				name: "include-persistencetype-checks",
				description: "If the server events on the type that is used for persistence should be executed. This is only of technical use to provide a lightweight view of a type, e.g. skipping validation and other default loading actions.",
				type: default_yes_no_attribute_type
				,
				visibilityConditions: [
					{
						attribute: "persistence",
						condition: "==",
						value: "Virtual"
					}
				]
			},
			{
				name: "cache-persistence",
				description: "The persistence the cache persistence uses for loading data.",
				type: {
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "Virtual",
							description: "This persistence saves and gets the data from a different type (specified with the attribute \"persistent-in-type\"). This is a technical solution that may be used for more purposes.</summary>One use is that subclasses of a type may be represented, such as PhlegmaticPatient as a subclass of Patients. A \"virtual filter\" may be added in this case to filter the Patients on the property \"suffers-from\" with the value \"Phlegmatism\". Another use is to provide different views on a type for performance reasons. You can e.g. provide a simple Patient type and a Patient type with also contains some relation fields."
						},
						{
							name: "CompanyInspecific",
							description: "A table multiple companies share."
						}						
					]
				},
				visibilityConditions: [
					{
						attribute: "persistence",
						condition: "==",
						value: "Cache"
					}
				]
			},
			{
				name: "audit-trail",
				description: "Specifies if changes to the type instances should be logged in an audit log table.</summary>The audit log includes timestamp, user, and the change.",
				type: default_yes_no_attribute_type
			},
			{
				name: "skip-privacy-protection",
				description: "If the type doesn't store private information such as PHI in its attributes or attached files, this property may be set to \"yes\" for performance (such as caching on the client).",
				type: default_yes_no_attribute_type
			},
			{
				name: "x-elementName",
				description: "The name of the XML element."
			},
			{
				name: "x-parentRelation",
				description: "A relation that points to a parent that has to be taken as parent element."
			},
			{
				name: "x-isParentElement",
				description: "is metadata XML parent element",
				type: default_yes_no_attribute_type
			},
			{
				name: "x-isOverload",
				description: "If the type is a child of a type that is not abstract, and should not be used while parsing.",
				type: default_yes_no_attribute_type
			},
			{
				name: "x-acceptedChilds",
				description: "A pipe-separated list of allowed childs.",
				visibilityConditions: [
					{
						attribute: "x-isParentElement",
						condition: "!=",
						value: "yes"
					}
				]
			},			
			dev_obsolete_attribute,
			dev_ignore_modelcheck_attribute,
			dev_ignore_modelcheck_justification_attribute,
			dev_comment_attribute
		],
		childs: [
			{
				element: "attribute",
				occurence: "at-least-once"
			},
			{
				element: "keys",
				occurence: "once"
			},
			{
				element: "server-events",
				occurence: "once"
			},
			{
				element: "messages",
				occurence: "once"
			},
			{
				element: "filters",
				occurence: "once"
			},
			{
				element: "file-categories",
				occurence: "once"
			},
			{
				element: "one-to-many"
			},
		]
	}],
	"attribute": [{
		type: ModelElementTypes.Attribute,
		description: "Describes an attribute of this type.",
		attributes: [
			{
				name: "name",
				required: true,
				description: "",
			},
			{
				name: "type",
				description: "Determines field type and the saved attribute value.",
				type: 
				{
					type: AttributeTypes.Enum,
					options: [
						{
							name: "string",
						},
						{
							name: "text",
						},
						{
							name: "richtext",
						},
						{
							name: "enum",
						},
						{
							name: "boolset",
						},
						{
							name: "bool",
						},
						{
							name: "date",
						},
						{
							name: "datetime",
						},
						{
							name: "numeric",
						},
						{
							name: "autofield",
						},
						{
							name: "image",
						},
						{
							name: "attachment",
						},
						{
							name: "none",
							description: "Only the label is displayed"
						},
						{
							name: "drawing",
						},
					]
				},
				visibilityConditions: [
					{
						attribute: "relation-type",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "relation-field",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "empty-allowed",
				description: "If the attribute or field can be left empty.",
				type: 
				{
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "yes",
							default: true
						},
						{
							name: "no"						
						}
					]
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "!=",
						value: "bool"
					}
				]
			},
			{
				name: "key",
				description: "",
			},
			{
				name: "sort",
				description: "",
			},
			{
				name: "sort-type",
				description: "",
				visibilityConditions: [
					{
						attribute: "sort",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "relation-type",
				description: "Set relation type to let this attribute represent a relation to an object of this type. For example, the attribute 'Patient' in a type 'Consults per patient' has as relation type value 'Patients'. When the relation type is specified, the attribute can have linked relation attributes using the relation field property (see below).",
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "multiselect"
					},
					{
						operator: "or",
						attribute: "type",
						condition: "==",
						value: ""
					}
				]
			},
			{
				name: "list-relation-type",	// TODO: move to frontend
				description: "",
				visibilityConditions: [
					{
						attribute: "relation-type",
						condition: "==",
						value: "Platform.Lists"
					}
				]
			},
			{
				name: "relation-type-multiple",			// TODO: move to frontend
				description: "The relation type for the multiple relation.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "multiselect"
					}
				]
			},
			{
				name: "relation-field",
				description: "Set relation field to let this attribute represent another attribute of a related type. This type of attribute is called a \"relation attribute\". Relation attributes *must* be defined in the backend because the backend otherwise will not send data to the frontend.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "relation-type",
						condition: "==",
						value: ""
					},
				]
			},
			{
				name: "allow-new",
				description: "If it is allowed to enter a new not existing item as relation. This relation will be saved then to the related type.</summary>To this end it is necessary that the compulsory fields are present as not-read-only relation attributes, otherwise the record can not be saved.",
				type: {
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "yes"
						},
						{
							name: "",
							description: "no"							
						}
					]
				},
				visibilityConditions: [
					{
						attribute: "relation-type-multiple",
						condition: "==",
						value: ""
					},
					{
						operator: "and",
						attribute: "relation-type",
						condition: "==",
						value: ""
					},
				]
			},
			{
				name: "display-as",
				description: "An attribute of the related type to display. Display-as can only be used when a relation type or relation field is specified.",
				type: 
					{
						type: AttributeTypes.Reference,
						relatedTo: ModelElementTypes.Attribute	// TODO add specification what attributes need to be displayed. Filter on parent type name OR related type attribute
					},
				visibilityConditions: [
					{
						attribute: "relation-type",
						condition: "!=",
						value: ""
					},
					{
						operator: "or",
						attribute: "relation-field",
						condition: "!=",
						value: ""
					},
					{
						operator: "or",
						attribute: "relation-type-multiple",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "max-length",
				description: "Specifies the field width, defined in number of characters displayed.",
				validations: [
					{
						type: "regex",
						value: /\d+/,
						message: "Please enter a numeric value."
					}
				]
			},
			{
				name: "allowed-file-extensions",
				description: "The extensions that are allowed for uploading, separated by pipes ('|'). E.g.,\".txt|.rtf|.doc|.docx|.odt|.pdf\".",
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "image"
					},
					{
						operator: "or",
						attribute: "type",
						condition: "==",
						value: "attachment"
					}
				]
			},
			{
				name: "max-list-items",
				description: "",
			},
			{
				name: "show-colorfield",
				description: "Show the field with the color value",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "color"
					}
				]
			},
			{
				name: "field",	// TODO check if this is still available in the platform
				description: "The password field to check the strength of.",
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "passwordstrength"
					}
				]
			},
			{
				name: "username-field", // TODO check if this is still available in the platform
				description: "The username field that belongs to the password field. Used to check username occurances in the password",
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "passwordstrength"
					}
				]
			},
			{
				name: "translatable",
				description: "",
				type: default_yes_no_attribute_type
			},
			{
				name: "always-in-sidedata",
				description: "If the attribute should be stored in side data by default. This may be necessary for advanced querying possibilities.",
				type: default_yes_no_attribute_type
			},
			{
				name: "encrypted",
				description: "Relation attributes are encrypted at the type to which they belong.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "relation-field",
						condition: '!=',
						value: ""
					}
				]

			}
		]
	}],
	"option": [{}],
	"keys": [{}],
	"key": [{}],
	"keyfield": [{}],
	"format": [{}],
	"image": [{}],
	"text": [{}],
	"server-events": [{}],
	"server-event": [{}],
	"decorators": [{}],
	"decorator": [{}],
	"decoration": [{}],
	"action": [{
		type: ModelElementTypes.ActionCall,
		description: "The action to perform.",
		attributes: [
			{
				name: "name",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Action

				}
			},
			{
				name: "input-all"
			},
			{
				name: "output-all"
			},
			{
				name: "dataless",
				description: "If the standard added data argument should be left out. It is now left out by default for performance (unless input-all is set). (Currently, only applicable for frontend calls to server actions.)"
			},
			{
				name: "rulename"
			},
			{
				name: "user-created",
				description: "Set this flag to yes in case the rule name is not hard-coded. In that case the platform will check whether the current user is allowed to invoke the rule (the rule should be marked as external-invocable in the security.xml).",
				visibilityConditions: [
					{
						attribute: "name",
						condition: "==",
						value: "rule"
					}
				]
			}
		]
	}],
	"argument": [action_argument_element],
	"include-blocks": [include_blocks_element],
	"include-block": [{
		type: ModelElementTypes.IncludeBlock
	}],
	"include": [include_element],
	"model-condition": [model_condition_element],
	"auto-key": [{
		"parent": {
			element: "attribute"
		}
	}],
	"merge-instruction": [merge_instruction_element],
	"input": [{
		type: ModelElementTypes.Input,
		isSymbolDeclaration:true,
		attributes: [
			{
				name: "required",
				detailLevel: ModelDetailLevel.Declarations
			}
		],
		detailLevel: ModelDetailLevel.Declarations
	}],
	"output": [action_output_element]
};