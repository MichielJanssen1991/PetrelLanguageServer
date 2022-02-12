import * as vscode from 'vscode';
import { getDocUri, } from '../../helper';
import { testDiagnostics, toRange } from '../common';

suite('Required attributes', () => {
	test('Missing required attribute', async () => {
		const docUri = getDocUri('diagnostics\\structure\\required-attributes.xml');
		await testDiagnostics(docUri, [
			{
				message: "#MDC0007: Missing required attribute 'persistent-in-type' for element 'type'",
				range: toRange(14, 6, 14, 65),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
			{
				message: "#MDC0006: Missing required attribute 'name' for element 'attribute'",
				range: toRange(15, 8, 15, 23),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});
});