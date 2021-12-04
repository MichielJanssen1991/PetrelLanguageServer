import { AttributeTypes, ModelElementTypes, Definitions, ModelDetailLevel } from '../symbolsAndReferences';
import { action_argument_element, action_output_element, dev_comment_attribute, include_blocks_element, include_element, merge_instruction_element, model_condition_element } from './shared';
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
			{
				name: "target-namespace",
				description: "Target namespace of the contents of the module. A relative namespace may start with a +, e.g., \"+Preferences\" may result in, e.g., \"Platform.Preferences\". (The target namespace together with the module name makes the module unique.)",
				validations: [
					{
						type: "regex",
						value: "(\\+?[A-Z][a-zA-Z]+(\\.[A-Z][a-zA-Z]+)*)?",
						"message": "Only alphabetic, CamelCased words separated by dots are allowed."
					}
				]
			},
			{
				name: "description",
				description: "Description of contents and purpose."
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
				element: "decorations",
				occurence: "once"
			}
		]
	}],
	type: [{
		type: ModelElementTypes.Type,
		prefixNameSpace: true,
		description: "",
		attributes: [
			{
				name: "persistence",
				description: "The way the data for this type is retrieved and saved.",
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
				}
			},
			{
				name: "persistent-in-type",
				description: "The type on which the virtual persistence is based.",
				type:
				{
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type
				}
				,
				required: true,
				conditions: [
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
				conditions: [
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
				type:
				{
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "yes"
						},
						{
							name: "no"
						}
					]
				}
				,
				conditions: [
					{
						attribute: "persistence",
						condition: "==",
						value: "Virtual"
					}
				]
			},
			{
				name: "audit-trail",
				description: "Specifies if changes to the type instances should be logged in an audit log table.</summary>The audit log includes timestamp, user, and the change.",
				type:
				{
					type: AttributeTypes.Enum,
					"options": [
						{
							name: "yes"
						},
						{
							name: "no"
						}
					]
				}
			},
			{
				name: "type",
				description: "A type this type inherits from.",
				type: {
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Type,
				},
				detailLevel: ModelDetailLevel.References
			}
		]
	}],
	attribute: [{}],
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
		type: ModelElementTypes.Action,
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
				conditions: [
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