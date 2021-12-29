import * as vscode from 'vscode';
import { getDocUri, } from '../../helper';
import { testDiagnostics, toRange } from '../common';

suite('Required attributes', () => {
	test('Missing required attribute', async () => {
		const docUri = getDocUri('diagnostics\\structure\\required-attributes.xml');
		await testDiagnostics(docUri, [
			{
				message: 'Missing required attribute \'persistent-in-type\' for element \'type\'',
				range: toRange(14, 7, 14, 65),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
			{
				message: 'Missing required attribute \'name\' for element \'attribute\'',
				range: toRange(15, 9, 15, 23),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'ex'
			},
		]);
	});
});