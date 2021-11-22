import * as vscode from 'vscode';
import { getDocUri } from '../helper';
import { testCompletionContains, testCompletionDoesNotContain, testCompletionEquals } from './common';

suite('Should do completion', () => {

	test('Completes local-name/remote-name in argument', async () => {
		const docUri = getDocUri('completion\\argument-attributes.xml');
		await testCompletionEquals(docUri, new vscode.Position(4, 14), {
			items: [
				{ label: 'local-name', kind: vscode.CompletionItemKind.Property },
				{ label: 'parseType', kind: vscode.CompletionItemKind.Property },
				{ label: 'precondition', kind: vscode.CompletionItemKind.Property },
				{ label: 'remote-name', kind: vscode.CompletionItemKind.Property },
				{ label: 'value', kind: vscode.CompletionItemKind.Property },
			]
		});
	});

	test('Completes child elements for module', async () => {
		const docUri = getDocUri('completion\\module-children-backend.xml');
		await testCompletionEquals(docUri, new vscode.Position(2, 0), {
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

	test('Completes attributes for action call', async () => {
		const docUri = getDocUri('completion\\action-call-attributes.xml');
		await testCompletionContains(docUri, new vscode.Position(3, 27), {
			items: [
				{ label: 'infoset-name', kind: vscode.CompletionItemKind.Property }
			]
		});
		await testCompletionContains(docUri, new vscode.Position(4, 24), {
			items: [
				{ label: 'rulename', kind: vscode.CompletionItemKind.Property }
			]
		});
	});

	test('Does not completes attributes for action call which are already there', async () => {
		const docUri = getDocUri('completion\\action-call-attributes.xml');
		await testCompletionDoesNotContain(docUri, new vscode.Position(5, 45), {
			items: [
				{ label: 'rulename', kind: vscode.CompletionItemKind.Property }
			]
		});
	});
});

