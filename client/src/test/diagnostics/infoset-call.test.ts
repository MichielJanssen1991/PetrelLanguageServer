import * as vscode from 'vscode';
import { getDocUri, } from '../helper';
import { testDiagnostics, toRange } from './common';

suite('Should get diagnostics for infoset call', () => {
	
	test('Diagnoses infoset call without name', async () => {
		const docUri = getDocUri('diagnostics\\infoset-call\\without-infoset-name.xml');
		await testDiagnostics(docUri, [
			{ message: 'Infoset call without infoset name specified.', range: toRange(2, 5, 2, 27), severity: vscode.DiagnosticSeverity.Warning, source: 'ex' },
		]);
	});

	test('Diagnoses infoset call to unknown infoset', async () => {
		const docUri = getDocUri('diagnostics\\infoset-call\\unknown-infoset.xml');
		await testDiagnostics(docUri, [
			{ message: "Infoset with name 'NotAKnownInfoset' not found.", range: toRange(2, 40, 2, 58), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses infoset call with unknown input', async () => {
		const docUri = getDocUri('diagnostics\\infoset-call\\unknown-input.xml');
		await testDiagnostics(docUri, [
			{ message: "Input 'UnknownInput' not found for Action: 'Infoset' or Infoset: 'KnownInfoset'.", range: toRange(3, 5, 3, 43), severity: vscode.DiagnosticSeverity.Warning, source: 'ex' },
		]);
	});
	
	test('Diagnoses infoset call with missing mandatory input', async () => {
		const docUri = getDocUri('diagnostics\\infoset-call\\missing-mandatory-input.xml');
		await testDiagnostics(docUri, [
			{ message: "Mandatory input 'MandatoryInfosetInput' for Infoset with name 'KnownInfosetWithMandatoryInput' not provided.", range: toRange(2, 40, 2, 72), severity: vscode.DiagnosticSeverity.Error, source: 'ex' },
		]);
	});

	test('Diagnoses infoset call with non preferred capitalization', async () => {
		const docUri = getDocUri('diagnostics\\infoset-call\\wrong-capitalization.xml');
		await testDiagnostics(docUri, [
			{ message: "Preferred capitalization for Action with name 'infoset' is 'Infoset'.", range: toRange(4, 17, 4, 26), severity: vscode.DiagnosticSeverity.Information, source: 'ex' },
		]);
	});
	
	test('No diagnoses for valid infoset call', async () => {
		const docUri = getDocUri('diagnostics\\infoset-call\\valid.xml');
		await testDiagnostics(docUri, []);
	});
});

