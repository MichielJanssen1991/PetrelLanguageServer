import * as vscode from 'vscode';
import { DiagnosticSeverity } from 'vscode';
import { getDocUri } from '../helper';
import { testDiagnostics, toRange } from './common';

suite('Should get diagnostics for rule declaration', () => {

	test('Diagnoses rule declarations which is not referenced (dead code)', async () => {
		const docUri = getDocUri('diagnostics\\rule-definition\\not-referenced.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0005: No references found to Rule with name 'ExampleRuleWhichIsNotReferenced'.",
				range: toRange(2, 2, 2, 47),
				severity: vscode.DiagnosticSeverity.Information,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses rule declarations with unknown local names referenced', async () => {
		const docUri = getDocUri('diagnostics\\rule-definition\\unknown-local-name-referenced.xml');
		await testDiagnostics(docUri, [{
			severity: DiagnosticSeverity.Warning,
			message: "#DC0004: Local name 'UnknownLocalNameUsedInCondition' is not defined.",
			range: toRange(4, 26, 4, 59)
		}, {
			severity: DiagnosticSeverity.Warning,
			message: "#DC0004: Local name 'UnknownLocalNameUsedInRuleAction' is not defined.",
			range: toRange(7, 29, 7, 63)
		}, {
			severity: DiagnosticSeverity.Warning,
			message: "#DC0004: Local name 'UnknownLocalNameUsedInExpression' is not defined.",
			range: toRange(9, 49, 9, 104)
		}, {
			severity: DiagnosticSeverity.Warning,
			message: "#DC0004: Local name 'UnknownLocalNameUsedInOutput' is not defined.",
			range: toRange(12, 58, 12, 88)
		}]);
	});

	test('Diagnoses rule declarations with a local-name which is not used in the rule', async () => {
		const docUri = getDocUri('diagnostics\\rule-definition\\local-name-not-used.xml');
		await testDiagnostics(docUri, [
			{
				message: "#DC0003: Local name 'LocalNameNotUsed' is not used in this rule.",
				range: toRange(4, 23, 4, 41),
				severity: DiagnosticSeverity.Information,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses rule declarations with inputs not used in the rule', async () => {
		const docUri = getDocUri('diagnostics\\rule-definition\\input-not-used.xml');
		await testDiagnostics(docUri, [
			{
				message: "#DC0003: Local name 'InputNotUsedInRule' is not used in this rule.",
				range: toRange(3, 16, 3, 36),
				severity: DiagnosticSeverity.Information,
				source: 'ex'
			},
		]);
	});

});