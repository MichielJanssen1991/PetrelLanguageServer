import * as vscode from 'vscode';
import * as assert from 'assert';
import { activate } from '../helper';

export async function testCompletionEquals(docUri: vscode.Uri, position: vscode.Position, expectedCompletionList: vscode.CompletionList) {
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

export async function testCompletionContains(docUri: vscode.Uri, position: vscode.Position, expectedCompletionList: vscode.CompletionList) {
	await activate(docUri);

	// Executing the command `vscode.executeCompletionItemProvider` to simulate triggering completion
	const actualCompletionList = (await vscode.commands.executeCommand(
		'vscode.executeCompletionItemProvider',
		docUri,
		position
	)) as vscode.CompletionList;

	expectedCompletionList.items.forEach((expectedItem, i) => {
		const actualItem = actualCompletionList.items.find(item => item.label == expectedItem.label);
		assert.strictEqual(actualItem.label, expectedItem.label, "Label");
		assert.strictEqual(actualItem.kind, expectedItem.kind, "Completion kind");
	});
}
