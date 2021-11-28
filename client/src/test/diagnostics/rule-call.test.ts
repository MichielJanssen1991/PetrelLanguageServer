
import * as vscode from 'vscode';
import { getDocUri, } from '../helper';
import { testDiagnostics, toRange } from './common';

suite('Should get diagnostics for rule call', () => {
	
	test('Diagnoses rule call without name', async () => {
		const docUri = getDocUri('diagnostics\\rule-call\\without-rule-name.xml');
		await testDiagnostics(docUri, [
			{ message: 'Rule call without rule name specified.', range: toRange(2, 5, 2, 24), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses rule call with rulename as argument', async () => {
		const docUri = getDocUri('diagnostics\\rule-call\\rule-name-as-argument.xml');
		await testDiagnostics(docUri, []);
	});

	test('Diagnoses rule call to unknown rule', async () => {
		const docUri = getDocUri('diagnostics\\rule-call\\unknown-rule.xml');
		await testDiagnostics(docUri, [
			{ message: "Rule with name 'UnknownRule' not found.", range: toRange(2, 33, 2, 46), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses rule call with unknown input', async () => {
		const docUri = getDocUri('diagnostics\\rule-call\\unknown-input.xml');
		await testDiagnostics(docUri, [
			{ message: "Input 'UnknownInput' not found for Action: 'Rule' or Rule: 'KnownRule'.", range: toRange(3, 5, 3, 43), severity: vscode.DiagnosticSeverity.Warning, source: 'ex' },
		]);
	});
	
	test('Diagnoses rule call with missing mandatory input', async () => {
		const docUri = getDocUri('diagnostics\\rule-call\\missing-mandatory-input.xml');
		await testDiagnostics(docUri, [
			{ message: "Mandatory input 'MandatoryRuleInput' for Rule with name 'KnownRuleWithMandatoryInput' not provided.", range: toRange(2, 33, 2, 62), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses rule call with non preferred capitalization', async () => {
		const docUri = getDocUri('diagnostics\\rule-call\\wrong-capitalization.xml');
		await testDiagnostics(docUri, [
			{ message: "Preferred capitalization for Action with name 'rule' is 'Rule'.", range: toRange(2, 5, 2, 45), severity: vscode.DiagnosticSeverity.Information, source: 'ex' },
		]);
	});
});

