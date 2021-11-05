import * as vscode from 'vscode';
import * as assert from 'assert';
import { activate } from '../helper';

export async function testDiagnostics(docUri: vscode.Uri, expectedDiagnostics: vscode.Diagnostic[]) {
	await activate(docUri);

	const actualDiagnostics = vscode.languages.getDiagnostics(docUri);
	
	assert.strictEqual(actualDiagnostics.length, expectedDiagnostics.length, `Actual: ${JSON.stringify(actualDiagnostics)}\nExpected: ${JSON.stringify(expectedDiagnostics)}`);

	expectedDiagnostics.forEach((expectedDiagnostic, i) => {
		const actualDiagnostic = actualDiagnostics[i];
		assert.strictEqual(actualDiagnostic.message, expectedDiagnostic.message);
		assert.deepStrictEqual(actualDiagnostic.range, expectedDiagnostic.range, "Range");
		assert.strictEqual(actualDiagnostic.severity, expectedDiagnostic.severity, "Severity");
	});
}

export function toRange(sLine: number, sChar: number, eLine: number, eChar: number) {
	const start = new vscode.Position(sLine, sChar);
	const end = new vscode.Position(eLine, eChar);
	return new vscode.Range(start, end);
}