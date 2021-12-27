import * as vscode from 'vscode';
import { getDocUri } from '../helper';
import { testDiagnostics, toRange } from './common';

suite('Should get diagnostics for infoset declaration', () => {
	
	test('Diagnoses infoset declarations with search on unknown type', async () => {
		const docUri = getDocUri('diagnostics\\infoset-definition\\search-unknown-type.xml');
		await testDiagnostics(docUri, [
			{ message: "Type with name 'UnknownType' not found.", range: toRange(2, 36, 2, 49), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses infoset declaration with unknown search-column attribute', async () => {
		const docUri = getDocUri('diagnostics\\infoset-definition\\searchcolumn-unknown-attribute.xml');
		await testDiagnostics(docUri, [
			{ message: "Attribute 'UnknownAttribute' not found in Type with name 'Type_Test_SearchColumnUnknownAttribute'.", range: toRange(5, 40, 5, 58), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses infoset declaration with unknown search-column attribute in subquery', async () => {
		const docUri = getDocUri('diagnostics\\infoset-definition\\subquery-searchcolumn-unknown-attribute.xml');
		await testDiagnostics(docUri, [
			{ message: "Attribute 'UnknownAttribute' not found in Type with name 'Type_Test_SearchColumnUnknownAttributeInSubquery'.", range: toRange(8, 29, 8, 47), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});
	
	test('Diagnoses infoset declaration with unknown search-column rule', async () => {
		const docUri = getDocUri('diagnostics\\infoset-definition\\searchcolumn-unknown-rule.xml');
		await testDiagnostics(docUri, [
			{ message: "Rule with name 'Rule_Test_SearchColumnUnknownRule' not found.", range: toRange(6, 61, 6, 96), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses infoset declarations which is not referenced (dead code)', async () => {
		const docUri = getDocUri('diagnostics\\infoset-definition\\not-referenced.xml');
		await testDiagnostics(docUri, [
			{ message: "No references found to Infoset with name 'ExampleInfosetWhichIsNotReferenced'.", range: toRange(1, 3, 1, 53), severity: vscode.DiagnosticSeverity.Information, source: 'ex' },
		]);
	});
});