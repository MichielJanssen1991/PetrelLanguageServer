
import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';

suite.only('Should do completion', () => {

	test('Completes local-name/remote-name in argument', async () => {
		const docUri = getDocUri('completion\\argument-attributes.xml');
		await testCompletion(docUri, new vscode.Position(4, 14), {
			items: [
				{ label: 'local-name', kind: vscode.CompletionItemKind.Property },
				{ label: 'remote-name', kind: vscode.CompletionItemKind.Property },
				{ label: 'value', kind: vscode.CompletionItemKind.Property },
			]
		});
	});

	test('Completes child elements for module', async () => {
		const docUri = getDocUri('completion\\module-children-backend.xml');
		await testCompletion(docUri, new vscode.Position(2, 0), {
			items: [
				{ label: 'decorations', kind: vscode.CompletionItemKind.Snippet },
				{ label: 'include', kind: vscode.CompletionItemKind.Snippet },
				{ label: 'include-block', kind: vscode.CompletionItemKind.Snippet },
				{ label: 'include-blocks', kind: vscode.CompletionItemKind.Snippet },
				{ label: 'merge-instruction', kind: vscode.CompletionItemKind.Snippet },
				{ label: 'model-condition', kind: vscode.CompletionItemKind.Snippet },
				{ label: 'module', kind: vscode.CompletionItemKind.Snippet },
				{ label: 'type', kind: vscode.CompletionItemKind.Snippet }
			]
		});
	});
});

async function testCompletion(
	docUri: vscode.Uri,
	position: vscode.Position,
	expectedCompletionList: vscode.CompletionList
) {
	await activate(docUri);

	// Executing the command `vscode.executeCompletionItemProvider` to simulate triggering completion
	const actualCompletionList = (await vscode.commands.executeCommand(
		'vscode.executeCompletionItemProvider',
		docUri,
		position
	)) as vscode.CompletionList;

	assert.ok(actualCompletionList.items.length >= 2);
	expectedCompletionList.items.forEach((expectedItem, i) => {
		const actualItem = actualCompletionList.items[i];
		assert.strictEqual(actualItem.label, expectedItem.label);
		assert.strictEqual(actualItem.kind, expectedItem.kind);
	});
}
