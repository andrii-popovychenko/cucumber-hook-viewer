import * as vscode from "vscode";
import { HooksDataProvider } from "./hooksProvider";
import { Searcher } from "./searcher";

export function activate(context: vscode.ExtensionContext) {
    const searcher = new Searcher();
    const files = searcher.findFiles();
    files.then(
        (result) =>
            vscode.window.registerTreeDataProvider(
                "cucumberHooksViewer",
                new HooksDataProvider(result.sort())
            ),
        (err) => {
            throw new Error(err);
        }
    );
}
export function deactivate() {}
