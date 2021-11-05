
import * as vscode from 'vscode';
import { getDocUri, } from '../helper';
import { testDiagnostics, toRange } from './common';

suite('Should get diagnostics for ruleloopaction call', () => {
	
	test('Diagnoses RuleLoopAction call without rulename', async () => {
		const docUri = getDocUri('diagnostics\\ruleloopaction-call\\without-rule-name.xml');
		await testDiagnostics(docUri, [
			{ message: 'RuleLoopAction call without rule name specified.', range: toRange(2, 5, 2, 63), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses RuleLoopAction call with unknown infoset', async () => {
		const docUri = getDocUri('diagnostics\\ruleloopaction-call\\unknown-infoset.xml');
		await testDiagnostics(docUri, [
			{ message: "Infoset with name 'UnknownInfoset' not found.", range: toRange(2, 5, 2, 75), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses RuleLoopAction call with unknown rule', async () => {
		const docUri = getDocUri('diagnostics\\ruleloopaction-call\\unknown-rule.xml');
		await testDiagnostics(docUri, [
			{ message: "Rule with name 'NotAKnownRule' not found.", range: toRange(2, 5, 2, 77), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses RuleLoopAction call with unknown input', async () => {
		const docUri = getDocUri('diagnostics\\ruleloopaction-call\\unknown-input.xml');
		await testDiagnostics(docUri, [
			{ message: "Input 'UnknownInput' not found for Action: 'RuleLoopAction' or Rule: 'KnownRule' or Infoset: 'KnownInfoset'.", range: toRange(3, 5, 3, 43), severity: vscode.DiagnosticSeverity.Warning, source: 'ex' },
		]);
	});
	
	test('Diagnoses RuleLoopAction call with missing mandatory rule input', async () => {
		const docUri = getDocUri('diagnostics\\ruleloopaction-call\\missing-mandatory-rule-input.xml');
		await testDiagnostics(docUri, [
			{ message: "Mandatory input 'MandatoryRuleInput' for Rule with name 'KnownRuleWithMandatoryInput' not provided.", range: toRange(2, 5, 2, 101), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses RuleLoopAction call with missing mandatory infoset input', async () => {
		const docUri = getDocUri('diagnostics\\ruleloopaction-call\\missing-mandatory-infoset-input.xml');
		await testDiagnostics(docUri, [
			{ message: "Mandatory input 'MandatoryInfosetInput' for Infoset with name 'KnownInfosetWithMandatoryInput' not provided.", range: toRange(2, 5, 2, 101), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});
	test('Diagnoses no errors when mandatory input is infoset type attribute', async () => {
		const docUri = getDocUri('diagnostics\\ruleloopaction-call\\mandatory-input-from-type.xml');
		await testDiagnostics(docUri, [
			{ message: "Mandatory input 'UnknownAttribute' for Rule with name 'KnownRuleWithMandatoryInputs' not provided.", range: toRange(6, 5, 6, 102), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses RuleLoopAction call with non preferred capitalization', async () => {
		const docUri = getDocUri('diagnostics\\ruleloopaction-call\\wrong-capitalization.xml');
		await testDiagnostics(docUri, [
			{ message: "Preferred capitalization for Action with name 'ruleLoopAction' is 'RuleLoopAction'.", range: toRange(2, 5, 2, 83), severity: vscode.DiagnosticSeverity.Information, source: 'ex' },
		]);
	});
});

