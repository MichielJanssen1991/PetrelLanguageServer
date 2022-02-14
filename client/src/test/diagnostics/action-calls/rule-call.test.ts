
import * as vscode from 'vscode';
import { getDocUri, } from '../../helper';
import { testDiagnostics, toRange } from '../common';

suite('Should get diagnostics for rule call', () => {
	const folder = "diagnostics\\action-calls\\rule-call\\";

	test('Diagnoses rule call without name', async () => {
		const docUri = getDocUri(folder + 'without-rule-name.xml');
		await testDiagnostics(docUri, [
			{
				message: '#CC0005: Rule call without rule name specified.',
				range: toRange(3, 4, 3, 24),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses rule call with rulename as argument', async () => {
		const docUri = getDocUri(folder + 'rule-name-as-argument.xml');
		await testDiagnostics(docUri, []);
	});

	test('Diagnoses rule call to unknown rule', async () => {
		const docUri = getDocUri(folder + 'unknown-rule.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0001: Rule with name 'UnknownRule' not found.",
				range: toRange(3, 33, 3, 46),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses rule call with unknown input', async () => {
		const docUri = getDocUri(folder + 'unknown-input.xml');
		await testDiagnostics(docUri, [
			{
				message: "#CC0001: Input 'UnknownInput' not found for Action: 'Rule' or Rule: 'KnownRule'.",
				range: toRange(4, 4, 4, 42),
				severity: vscode.DiagnosticSeverity.Warning,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses rule call with missing mandatory input', async () => {
		const docUri = getDocUri(folder + 'missing-mandatory-input.xml');
		await testDiagnostics(docUri, [
			{
				message: "#CC0003: Mandatory input 'MandatoryRuleInput' for Rule with name 'KnownRuleWithMandatoryInput' not provided.",
				range: toRange(3, 33, 3, 62),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses rule call with non preferred capitalization', async () => {
		const docUri = getDocUri(folder + 'wrong-capitalization.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0002: Preferred capitalization for Action with name 'rule' is 'Rule'.",
				range: toRange(3, 17, 3, 23),
				severity: vscode.DiagnosticSeverity.Information,
				source: 'ex'
			},
		]);
	});
});

