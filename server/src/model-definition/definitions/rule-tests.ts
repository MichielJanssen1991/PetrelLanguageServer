import { AttributeTypes, Definitions, ModelDetailLevel, ModelElementTypes } from '../types/definitions';
import { comment_attribute, default_children, default_yes_no_attribute_type, include_blocks_element, include_element, merge_instruction_element, module_element } from './shared';

export const RULE_TESTS_DEFINITION: Definitions = {
	"rule-tests": [{
		description: "Rule-tests model (defining the tests).",
		attributes: [
			comment_attribute
		],
		children: [
			{
				element: "module",
			},
			{
				element: "rule-test-set",
			},
			...include_blocks_element.children,
			...default_children
		]
	}],
	"application": [{
		description: "The model of an application contained in the project. A project may contain multiple named applications, and a 'default application' (modeled as an unnamed application element), from which all other applications inherit.",
		attributes: [],
		children: [
			{
				element: "include"
			},
			{
				element: "rule-test-set",
				occurence: "at-least-once"
			},
			...include_blocks_element.children,
			...default_children
		]
	}],
	"rule-test-set": [{
		description: "A set of test cases for a rule.",
		type: ModelElementTypes.RuleTestSets,
		detailLevel: ModelDetailLevel.Declarations,
		prefixNameSpace: true,
		attributes: [
			{
				name: "name",
				required: true,
				autoadd: true,
				description: "The name of the rule to test.",
				types: [{
					type: AttributeTypes.Reference,
					relatedTo: ModelElementTypes.Rule,
					prefixNameSpace: true
				}]
			},
			{
				name: "use-specific-action-dependencies",
				description: "Use specific action dependencies",
				types: [default_yes_no_attribute_type]

			}
		],
		children: [
			{
				element: "test"
			},
			...include_blocks_element.children,
			...default_children
		]
	}],
	"test": [{
		description: "A single test case for the rule.",
		type: ModelElementTypes.RuleTests,
		detailLevel: ModelDetailLevel.Declarations,
		attributes: [{
			name: "description",
			description: "The description of the test case.",
			required: true,
			autoadd: true
		}],
		children: [
			{
				element: "input"
			},
			{
				element: "stub-action"
			},
			{
				element: "action-dependency"
			},
			{
				element: "assert-output"
			},
			{
				element: "assert-action"
			},
			{
				element: "assert-throws",
				occurence: "once"
			},
			...include_blocks_element.children,
			...default_children
		]
	}],
	"input": [{
		description: "Provides input parameters to the rule.",
		attributes: [
			{
				name: "name",
				description: "The name of the input parameter.",
				required: true,
				autoadd: true
			},
			{
				name: "value",
				description: "The value of the input parameter.",
				autoadd: true
			},
		],
		children: []
	}],
	"stub-action": [{
		description: "Stubs the output of an action.",
		attributes: [{
			name: "name",
			description: "The action name",
			required: true,
			autoadd: true
		}],
		children: [
			{
				element: "match-attribute"
			},
			{
				element: "match-argument"
			},
			{
				element: "output"
			},
		]
	}],
	"action-dependency": [{
		description: "Executes the action using the Platform. WARNING: This can introduce e.g. time or database dependencies that can make the test unstable and slow.",
		attributes: [{
			name: "name",
			description: "The action name",
			required: true,
			autoadd: true
		}],
		children: [
			{
				element: "match-attribute"
			},
			{
				element: "match-argument"
			},
			{
				element: "output"
			},
		]
	}],
	"output": [{
		description: "Returns an output variable from the stubbed action.",
		attributes: [
			{
				name: "name",
				description: "The name of the output parameter.",
				required: true,
				autoadd: true
			},
			{
				name: "value",
				description: "The value of the output parameter.",
				autoadd: true
			},
		],
		children: []
	}],
	"assert-output": [{
		description: "Asserts a certain output variable has an expected value.",
		attributes: [
			{
				name: "name",
				description: "The name of the output variable.",
				required: true,
				autoadd: true
			},
			{
				name: "value",
				description: "The expected value of the output variable.",
				autoadd: true
			},
		],
		children: []
	}],
	"assert-action": [{
		description: "Asserts a certain action was called with the given parameters.",
		attributes: [
			{
				name: "name",
				description: "The action name",
				required: true,
				autoadd: true
			},
			{
				name: "times",
				description: "The number of times the action is expected to be called. Default 1.",
				autoadd: true,
				types: [{ type: AttributeTypes.Numeric }]
			},
		],
		children: [
			{
				element: "match-attribute"
			},
			{
				element: "match-argument"
			},
		]
	}],
	"assert-throws": [{
		description: "Asserts the rule execution throws an exception.",
		attributes: [
			{
				name: "message",
				description: "The exception message.",
				required: true,
				autoadd: true
			},
		],
		children: []
	}],
	"match-argument": [{
		description: "Matches an argument value.",
		attributes: [
			{
				name: "name",
				description: "The name of the argument.",
				required: true,
				autoadd: true
			},
			{
				name: "value",
				description: "The value of the argument.",
				autoadd: true
			},
		],
		children: []
	}],
	"match-attribute": [{
		description: "Matches an attribute value.",
		attributes: [
			{
				name: "name",
				description: "The name of the attribute.",
				required: true,
				autoadd: true
			},
			{
				name: "value",
				description: "The value of the attribute.",
				autoadd: true
			},
		],
		children: []
	}],
	"include": [include_element],
	"merge-instruction": [merge_instruction_element],
	"module": [module_element],
};