import * as vscode from 'vscode';
import * as assert from 'assert';
import { activate } from '../helper';

async function activateAndGetCompletionItems(docUri: vscode.Uri, position: vscode.Position) {
	await activate(docUri);

	// Executing the command `vscode.executeCompletionItemProvider` to simulate triggering completion
	const actualCompletionList = (await vscode.commands.executeCommand(
		'vscode.executeCompletionItemProvider',
		docUri,
		position
	)) as vscode.CompletionList;
	return actualCompletionList;
}

export async function testCompletionEquals(docUri: vscode.Uri, position: vscode.Position, expectedCompletionList: vscode.CompletionList) {
	const actualCompletionList = await activateAndGetCompletionItems(docUri, position);

	assert.strictEqual(actualCompletionList.items.length, expectedCompletionList.items.length, "length");
	expectedCompletionList.items.forEach((expectedItem, i) => {
		const actualItem = actualCompletionList.items[i];
		assert.strictEqual(actualItem.label, expectedItem.label);
		assert.strictEqual(actualItem.kind, expectedItem.kind, "Completion kind");
	});
}



export async function testCompletionContains(docUri: vscode.Uri, position: vscode.Position, expectedCompletionList: vscode.CompletionList) {
	const actualCompletionList = await activateAndGetCompletionItems(docUri, position);

	expectedCompletionList.items.forEach((expectedItem, i) => {
		const actualItem = actualCompletionList.items.find(item => item.label == expectedItem.label);
		assert.strictEqual(actualItem.label, expectedItem.label, "Label");
		assert.strictEqual(actualItem.kind, expectedItem.kind, "Completion kind");
	});
}

export async function testCompletionDoesNotContain(docUri: vscode.Uri, position: vscode.Position, doesNotContainList: vscode.CompletionList) {
	const actualCompletionList = await activateAndGetCompletionItems(docUri, position);

	doesNotContainList.items.forEach((expectedItem, i) => {
		const actualItem = actualCompletionList.items.find(item => item.label == expectedItem.label);
		assert.strictEqual(actualItem, undefined, "Missing completion actually is there");
	});
}

