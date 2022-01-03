import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { action_argument_element, action_output_element, dev_comment_attribute, default_yes_no_attribute_type, target_namespace_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element, dev_obsolete_attribute, dev_ignore_modelcheck_attribute, dev_ignore_modelcheck_justification_attribute, decorator_context_entity_element, decorations_element, decoration_element, decoration_argument_element, decorators_element, decorator_element, decorator_input_element, target_element, backend_action_element, dev_description_attribute } from './shared';
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
		detailLevel: ModelDetailLevel.Declarations,
		description: "Used for grouping model entities and model namespacing.",
		attributes: [
			{
				name: "name",
				description: "The module name.",
				autoadd: true
			},
			target_namespace_attribute,
			dev_description_attribute,
			dev_comment_attribute,
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
		detailLevel: ModelDetailLevel.Declarations,
		isSymbolDeclaration: true,
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
						value: /^[A-Za-z][A-Za-z0-9]*$/,
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
				type: default_yes_no_attribute_type
			},
			{
				name: "iid-field",
				description: "The field which contains the identifier of the instances.",
				type: {
					type: AttributeTypes.Numeric
				}
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
				description: "Specifies if changes to the type instances should be logged in an audit log table.The audit log includes timestamp, user, and the change.",
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
				element: "attribute"
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
				element: "decorations"
			},
			{
				element: "include"
			},
			{
				element: "one-to-many"
			},
			{
				element: "include"
			},
			{
				element: "model-condition"
			}
		]
	}],
	"attribute": [{
		type: ModelElementTypes.Attribute,
		detailLevel: ModelDetailLevel.Declarations,
		description: "Describes an attribute of this type.",
		attributes: [
			{
				name: "name",
				required: true,
				description: "",
			},
			{
				name: "caption",
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
							name: "time",
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
				description: "One or more attributes of a type can be defined as key. These attributes together determine the primary key, which allows for a default sort order and ensures uniqueness of the fields.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "relation-field",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "attribute",
				description: "An attribute to inherit all properties from.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute // TODO: add Context of current type
				}
			},
			{
				name: "attribute-template",		// TODO: check if platform still supports this
				description: "A template this attribute is based on.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute // TODO: change this to AttributeTemplates once it's clear that platform it still supports
				}
			},
			{
				name: "allow-existing",
				description: "When set to 'no', an existing option is not allowed.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "relation-type",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "delete-cascade",
				description: "Specifies if with the removal of the referred object it is allowed to remove this relation. Indicates that when removing the parent to which this attribute is related, child records also have to be deleted. This is only useful for an identifying relation of e.g. \"Consults per patient\" (as childs) to parent \"Patient\". If false (default) an exception is thrown when one tries to delete the refered object and the relation still exists.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "relation-type",
						condition: "!=",
						value: ""
					}
				]
			},
			{
				name: "sort",
				description: "A consecutive numeric value (starting with 1) which indicates the sort order index.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "sort-type",
				description: "If the sorting on this field should be ascending or descending.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "ASC",
							description: "Ascending"
						},
						{
							name: "DESC",
							description: "Descending"
						}
					]
				},
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
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				},
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
				type: {
					type: AttributeTypes.Numeric
				}
			},
			{
				name: "display-length",
				description: "Specifies the field width, defined in number of characters displayed.",
				type: {
					type: AttributeTypes.Numeric
				}
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
				description: "Limit the enum list to a maximum",
				type: {
					type: AttributeTypes.Numeric
				},
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "enum"
					}
				]
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
				description: "If this attribute is multilingual. If so, the attribute will store a translation ID. The attribute will be translated before sending it to the front-end. See [Multilingual data]",
				type: default_yes_no_attribute_type
			},
			{
				name: "always-in-sidedata",
				description: "If the attribute should be stored in side data by default. This may be necessary for advanced querying possibilities.",
				type: default_yes_no_attribute_type
			},
			{
				name: "always-in-multidata",
				description: "",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "type",
						condition: "==",
						value: "boolset"
					}
				]
			},
			{
				name: "encrypted",
				description: "Relation attributes are encrypted at the type to which they belong.",
				type: default_yes_no_attribute_type,
				visibilityConditions: [
					{
						attribute: "relation-field",
						condition: '==',
						value: ""
					}
				]

			}
		],
		childs: [
			{
				element: "option"
			},
			{
				element: "include"
			},
			{
				element: "format",
				occurence: "once"
			},
			{
				element: "auto-key",
				occurence: "once"
			},
			{
				element: "auto-field-filter",
				occurence: "once"
			}
		]
	}],
	"option": [{
		description: "A field value option. Options may be used for enums, radios and boolsets.",
		attributes: [
			{
				name: "value",
				description: "The value of the option. Options with the empty value can be used to represent the situation when the attribute has no value, and thus will be presented by default (not applicable to boolean sets). The values should be unique inside the field.",
				validations: [
					{
						type: "regex",
						value: /^[a-zA-Z]+[a-zA-Z0-9\s\-_.]*$/,
						message: "The value can only contain 'letters, numbers, spaces, dashes, underscores or dots. The value must begin with a letter'."
					}
				]
			},
			{
				name: "caption",
				required: true,
				description: "The representation of the option to the user. The caption should be unique inside the field."
			},
			{
				name: "label-width",
				description: "The width of the option label in the frontend."
			},
			{
				name: "src",
				description: "URL for an option image.",
				visibilityConditions: [
					{
						attribute: "parent::attribute::type",	// TODO: figure out how to get the attribute of parent element
						condition: '==',
						value: "enum"
					}
				]
			},
			{
				name: "width",
				description: "The width of the option image.",
				visibilityConditions: [
					{
						attribute: "src",
						condition: '!=',
						value: ""
					},
					{
						operator: "and",
						attribute: "parent::format::child[width]",	// TODO: figure out how to get the attribute of parent element
						condition: '==',
						value: ""
					}
				]
			},
			{
				name: "height",
				description: "The height of the option image.",
				visibilityConditions: [
					{
						attribute: "src",
						condition: '!=',
						value: ""
					},
					{
						operator: "and",
						attribute: "parent::format::child[height]",	// TODO: figure out how to get the attribute of parent element
						condition: '==',
						value: ""
					}
				]
			},
			dev_comment_attribute
		]
	}],
	"keys": [{
		description: "Database indexing keys. These are the sorting keys for creating (non) unique indices, as a result of which a performance improvement can be realised. Keys are when possible, used for queries. When no suitable key is found, the framework searches for the minimal set (this will however be usually bigger than when with a suitable key). From this set, at the server, those records that not satisfactory with a slower mechanism, are removed.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "key",
				required: true,
				occurence: "at-least-once"
			}
		]
	}],
	"key": [{
		description: "A database indexing key. Max lenght of 25 letters",
		attributes: [
			{
				name: "name",
				required: true,
				description: "The name of the key.",
				validations: [
					{
						type: "regex",
						value: /^\w{1,25}$/,
						message: "Name can not be longer then 25 characters and only contain letters"
					}
				]
			},
			{
				name: "is-unique",
				description: "Defines an unique key. The combination of all fields contained in the key have to be unique.",
				type: default_yes_no_attribute_type
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "keyfield",
				occurence: "at-least-once"
			}
		]
	}],
	"keyfield": [{
		description: "",
		attributes: [
			{
				name: "name",
				required: true,
				description: "The link to the field in the type which has to be included in this key. (Notice this is only useful for attributes (including relations), not for relation attributes.)",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Attribute // TODO: filter on parent type
				}
			}
		]
	}],
	"format": [{
		description: "Defines a lay-out.",
		childs: [
			{
				element: "image"
			},
			{
				element: "text"
			}
		]
	}],
	"image": [{
		description: "Displays the option images.",
		attributes: [
			{
				name: "width",
				description: "The width of the option images."
			},
			{
				name: "height",
				description: "The height of the option images."
			}
		]
	}],
	"text": [{
		description: "Displays the option labels.",
		attributes: [
			{
				name: "width",
				description: "The width of the option labels."
			}
		]
	}],
	"server-events": [{
		description: "A server event registration.",
		attributes: [dev_comment_attribute],
		childs: [
			{
				element: "server-event",
				required: true,
				occurence: "at-least-once"
			}
		]
	}],
	"server-event": [{
		description: "Server side event.",
		attributes: [
			{
				name: "name",
				required: true,
				description: "The type of event to listen to.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "onbeforeload",
							description: "Before loading an existing record"
						},
						{
							name: "onafterload",
							description: "After loading an existing record"
						},
						{
							name: "onbeforeupdate",
							description: "Before updating an existing record"
						},
						{
							name: "onbeforeinsert",
							description: "Before inserting a new record"
						},
						{
							name: "onbeforesave",
							description: "Before saving a record (insert or update)"
						},
						{
							name: "onbeforepersist",
							description: "Before writing a record to the persistence"
						},
						{
							name: "onafterpersist",
							description: "After writing a record to the persistence"
						},
						{
							name: "onaftersave",
							description: "After saving a record (insert or update)"
						},
						{
							name: "onafterinsert",
							description: "After inserting a new record"
						},
						{
							name: "onafterupdate",
							description: "After updating an existing record"
						},
						{
							name: "onbeforedelete",
							description: "Before deleting a record"
						},
						{
							name: "onafterdelete",
							description: "After deleting a record successfully"
						},
						{
							name: "ondeletefailed",
							description: "After failure of deleting a record"
						},
					]
				}
			},
			{
				name: "assembly",
				description: "The assembly which implements the event."
			},
			{
				name: "class",
				description: "The class which implements the event."
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "action"
			},
			{
				element: "clear-var"
			}
		]
	}],
	"decorations": [decorations_element],
	"decoration": [decoration_element],
	"decoration-argument": [decoration_argument_element],
	"decorators": [decorators_element],
	"decorator": [decorator_element],
	"decorator-input": [decorator_input_element],
	"target": [target_element],
	"decorator-context-entity": [decorator_context_entity_element],
	"argument": [action_argument_element],
	"action": [backend_action_element],
	"include-blocks": [include_blocks_element],
	"include-block": [{
		type: ModelElementTypes.IncludeBlock,
		detailLevel: ModelDetailLevel.Declarations,
		description: "A model fragment that is included by includes.",
		attributes: [
			{
				name: "name",
				description: "Unique identifier",
				required: true,
				autoadd: true,
			},
			{
				name: "meta-name",
				description: "For which element to apply rules.",
				required: true,
				autoadd: true,
				type:
				{
					type: AttributeTypes.Enum,
					options: [
						{
							name: ModelElementTypes.Module
						},
						{
							name: ModelElementTypes.Type
						},
						{
							name: ModelElementTypes.Attribute
						},
						{
							name: ModelElementTypes.Action
						},
						{
							name: "server-events"
						},
						{
							name: "server-event"
						},
						{
							name: "keys"
						},
						{
							name: "key"
						}
					]
				}
			},
			{
				name: "meta-index",
				description: "For which element to apply rules."
			},
			dev_comment_attribute
		],
		childs: {
			matchElementFromAttribute: "meta-name"
		}
	}],
	"include": [include_element],
	"model-condition": [model_condition_element],
	"auto-key": [{
		"description": "Automatically generates a value, based on some counting method. This can be used e.g. for sequence numbers. The value of this attribute is automatically incremented with each new record.",
		attributes: [
			{
				name: "type",
				description: "The counter representation.",
				type: {
					type: AttributeTypes.Enum,
					options: [
						{
							name: "numeric",
							default: true
						}
					]
				}
			},
			{
				name: "places",
				description: "Length of string. Empty means: not restricted.",
				type: {
					type: AttributeTypes.Numeric
				}
			},
			dev_comment_attribute
		]
	}],
	"merge-instruction": [merge_instruction_element],
	"input": [{
		type: ModelElementTypes.Input,
		isSymbolDeclaration: true,
		attributes: [
			{
				name: "required",
				detailLevel: ModelDetailLevel.Declarations
			}
		],
		detailLevel: ModelDetailLevel.Declarations
	}],
	"output": [action_output_element],
	"filters": [{
		description: "Defines search filters for this type.",
		childs: [
			{
				element: "search"
			}
		]
	}],
	"search": [{
		description: "A filter on the instances of a type.",
		attributes: [
			{
				name: "name",
				description: "Unique filter identifier."
			},
			{
				name: "add-relations",
				description: "Select relation attributes too. Set to 'yes' if you want to link a variable to a related attribute.",
				type: default_yes_no_attribute_type
			},
			{
				name: "filter",
				description: "The type filter to apply for search."
			},
			{
				name: "all-when-empty-filter",
				description: "If 'no' the search returns nothing (matches no record) when the filter is empty or if all the parameter based search columns are left out; if 'yes' it  all records (matches all records).",
				type: default_yes_no_attribute_type
			},
			dev_comment_attribute
		],
		childs: [
			{
				element: "searchcolumn"
			},
			{
				element: "searchcolumn-submatch"
			},
			{
				element: "or"
			},
			{
				element: "and"
			},
			{
				element: "group"
			},
			{
				element: "in"
			},
			{
				element: "include"
			},
			{
				element: "full-text-query",
				occurence: "once"
			},
		]
	}],
	"searchcolumn": [{}],
	"searchcolumn-submatch": [{}],
	"or": [{}],
	"and": [{}],
	"group": [{}],
	"in": [{}],
	"full-text-query": [{}],
};