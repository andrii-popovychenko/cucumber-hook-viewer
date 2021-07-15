import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('cucumber-hooks-viewer.viewHooksList', () => {
		vscode.window.showInformationMessage('Hello World from cucumber-hooks-viewer!');
	});

	context.subscriptions.push(disposable);
}
export function deactivate() {}
