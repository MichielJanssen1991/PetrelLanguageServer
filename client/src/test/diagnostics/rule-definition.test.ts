import * as vscode from 'vscode';
import { getDocUri } from '../helper';
import { testDiagnostics, toRange } from './common';

suite('Should get diagnostics for infoset declaration', () => {
	
	test('Diagnoses rule declarations which is not referenced (dead code)', async () => {
		const docUri = getDocUri('diagnostics\\rule-definition\\not-referenced.xml');
		await testDiagnostics(docUri, [
			{ message: "No references found to Rule with name 'ExampleRuleWhichIsNotReferenced'.", range: toRange(1, 3, 1, 47), severity: vscode.DiagnosticSeverity.Information, source: 'ex' },
		]);
	});

});