import * as vscode from 'vscode';
import { getDocUri, } from '../../helper';
import { testDiagnostics, toRange } from '../common';

suite('Should get diagnostics for infoset call', () => {
	const folder = "diagnostics\\action-calls\\infoset-call\\";

	test('Diagnoses infoset call without name', async () => {
		const docUri = getDocUri(folder + 'without-infoset-name.xml');
		await testDiagnostics(docUri, [
			{
				message: '#CC0007: Infoset call without infoset-name specified.',
				range: toRange(3, 4, 3, 27),
				severity: vscode.DiagnosticSeverity.Information,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses infoset call to unknown infoset', async () => {
		const docUri = getDocUri(folder + 'unknown-infoset.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0001: Infoset with name 'NotAKnownInfoset' not found.",
				range: toRange(3, 40, 3, 58),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses infoset call with unknown input', async () => {
		const docUri = getDocUri(folder + 'unknown-input.xml');
		await testDiagnostics(docUri, [
			{
				message: "#CC0001: Input 'UnknownInput' not found for Action: 'Infoset' or Infoset: 'KnownInfoset'.",
				range: toRange(4, 4, 4, 42),
				severity: vscode.DiagnosticSeverity.Warning,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses infoset call with missing mandatory input', async () => {
		const docUri = getDocUri(folder + 'missing-mandatory-input.xml');
		await testDiagnostics(docUri, [
			{
				message: "#CC0003: Mandatory input 'MandatoryInfosetInput' for Infoset with name 'KnownInfosetWithMandatoryInput' not provided.",
				range: toRange(3, 40, 3, 72),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});

	test('Diagnoses infoset call with non preferred capitalization', async () => {
		const docUri = getDocUri(folder + 'wrong-capitalization.xml');
		await testDiagnostics(docUri, [
			{
				message: "#ROC0002: Preferred capitalization for Action with name 'infoset' is 'Infoset'.",
				range: toRange(3, 17, 3, 26),
				severity: vscode.DiagnosticSeverity.Information,
				source: 'ex'
			},
		]);
	});

	test('No diagnoses for valid infoset call', async () => {
		const docUri = getDocUri(folder + 'valid.xml');
		await testDiagnostics(docUri, []);
	});
});

