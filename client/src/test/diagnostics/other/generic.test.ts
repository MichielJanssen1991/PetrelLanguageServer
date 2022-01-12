import * as vscode from 'vscode';
import { getDocUri, } from '../../helper';
import { testDiagnostics, toRange } from '../common';

suite('Other behaviours', () => {

	test('Does not give error when rule is obsolete', async () => {
		const docUri = getDocUri('diagnostics\\other\\skip-in-obsolete-context.xml');
		await testDiagnostics(docUri, []);
	});

});