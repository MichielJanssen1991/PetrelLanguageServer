import * as vscode from 'vscode';
import { getDocUri } from '../helper';
import { testDiagnostics, toRange } from './common';

suite('Should get diagnostics for infoset declaration', () => {
	const folder = "diagnostics\\infoset-definition\\";
	test('Diagnoses infoset declarations with search on unknown type', async () => {
		const docUri = getDocUri(folder + 'search-unknown-type.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0001: Type with name 'UnknownType' not found.",
				range: toRange(3, 36, 3, 49),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses infoset declaration with unknown search-column attribute', async () => {
		const docUri = getDocUri(folder + 'searchcolumn-unknown-attribute.xml');
		await testDiagnostics(docUri, [
			{
				message: "#DC0001: Attribute 'UnknownAttribute' not found in Type with name 'KnownType'.",
				range: toRange(4, 40, 4, 58),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses infoset declaration with unknown search-column attribute in subquery', async () => {
		const docUri = getDocUri(folder + 'subquery-searchcolumn-unknown-attribute.xml');
		await testDiagnostics(docUri, [
			{
				message: "#DC0001: Attribute 'UnknownAttribute' not found in Type with name 'KnownType'.",
				range: toRange(6, 29, 6, 47),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses infoset declaration with unknown search-column rule', async () => {
		const docUri = getDocUri(folder + 'searchcolumn-unknown-rule.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0001: Rule with name 'UnknownRule' not found.",
				range: toRange(4, 62, 4, 75),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses infoset declarations which is not referenced (dead code)', async () => {
		const docUri = getDocUri(folder + 'not-referenced.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0004: No references found to Infoset with name 'ExampleInfosetWhichIsNotReferenced'. The infoset could still be used indirectly via it's output variables.",
				range: toRange(2, 2, 2, 53),
				severity: vscode.DiagnosticSeverity.Information,
				source: 'ex'
			},
		]);
	});

	test('No diagnoses for valid infoset call in namespace', async () => {
		const docUri = getDocUri(folder + 'variables-referenced.xml');
		await testDiagnostics(docUri, []);
	});
	
	test('No diagnoses for valid infoset on context-info', async () => {
		const docUri = getDocUri(folder + 'valid-context-info.xml');
		await testDiagnostics(docUri, []);
	});

	test('Diagnoses infoset variable not referenced', async () => {
		const docUri = getDocUri(folder + 'variable-not-referenced.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0005: No references found to InfosetVariable with name 'VariableNotReferenced'.",
				range: toRange(6, 4, 6, 71),
				severity: vscode.DiagnosticSeverity.Information,
				source: 'ex'
			}
		]);
	});
});