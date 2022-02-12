
import * as vscode from 'vscode';
import { getDocUri, } from '../../helper';
import { testDiagnostics, toRange } from '../common';

suite('Should get diagnostics for ruleloopaction call', () => {
	const folder = "diagnostics\\action-calls\\ruleloopaction-call\\";

	test('Diagnoses RuleLoopAction call without rulename', async () => {
		const docUri = getDocUri(folder + 'without-rule-name.xml');
		await testDiagnostics(docUri, [
			{
				message: '#CC0004: RuleLoopAction call without rule name specified.',
				range: toRange(3, 4, 3, 63),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses RuleLoopAction call with unknown infoset', async () => {
		const docUri = getDocUri(folder + 'unknown-infoset.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0001: Infoset with name 'UnknownInfoset' not found.",
				range: toRange(3, 37, 3, 53),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses RuleLoopAction call with unknown rule', async () => {
		const docUri = getDocUri(folder + 'unknown-rule.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0001: Rule with name 'NotAKnownRule' not found.",
				range: toRange(3, 61, 3, 76),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses RuleLoopAction call with unknown input', async () => {
		const docUri = getDocUri(folder + 'unknown-input.xml');
		await testDiagnostics(docUri, [
			{
				message: "#CC0001: Input 'UnknownInput' not found for Action: 'RuleLoopAction' or Rule: 'KnownRule' or Infoset: 'KnownInfoset'.",
				range: toRange(4, 4, 4, 42),
				severity: vscode.DiagnosticSeverity.Warning,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses RuleLoopAction call with missing mandatory rule input', async () => {
		const docUri = getDocUri(folder + 'missing-mandatory-rule-input.xml');
		await testDiagnostics(docUri, [
			{
				message: "#CC0006: Mandatory input 'MandatoryRuleInput' for Rule with name 'KnownRuleWithMandatoryInput' not provided.",
				range: toRange(3, 4, 3, 101),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses RuleLoopAction call with missing mandatory infoset input', async () => {
		const docUri = getDocUri(folder + 'missing-mandatory-infoset-input.xml');
		await testDiagnostics(docUri, [
			{
				message: "#CC0006: Mandatory input 'MandatoryInfosetInput' for Infoset with name 'KnownInfosetWithMandatoryInput' not provided.",
				range: toRange(3, 4, 3, 101),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});
	test('Diagnoses no errors when mandatory input is infoset type attribute', async () => {
		const docUri = getDocUri(folder + 'mandatory-input-from-type.xml');
		await testDiagnostics(docUri, [
			{
				message: "#CC0006: Mandatory input 'UnknownAttribute' for Rule with name 'KnownRuleWithMandatoryInputs' not provided.",
				range: toRange(9, 4, 9, 102),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses RuleLoopAction call with non preferred capitalization', async () => {
		const docUri = getDocUri(folder + 'wrong-capitalization.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0002: Preferred capitalization for Action with name 'ruleLoopAction' is 'RuleLoopAction'.",
				range: toRange(3, 17, 3, 33),
				severity: vscode.DiagnosticSeverity.Information,
				source: 'ex'
			},
		]);
	});
});

