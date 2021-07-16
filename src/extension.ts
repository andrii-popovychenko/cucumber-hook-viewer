import * as vscode from "vscode";
import { HooksDataProvider } from "./hooksProvider";

export function activate() {
    const hooksTreeData = new HooksDataProvider();
    vscode.window.registerTreeDataProvider(
        "cucumberHooksViewer",
        hooksTreeData
    );
    hooksTreeData.refresh();
    vscode.commands.registerCommand("cucumberHooksViewer.refreshData", () =>
        hooksTreeData.refresh()
    );
}
export function deactivate() {}
