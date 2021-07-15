import * as vscode from 'vscode';
import { Searcher } from './searcher';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('cucumber-hooks-viewer.viewHooksList', () => {
	});

	context.subscriptions.push(disposable);
}
export function deactivate() {}
