import {
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    Uri,
    TextDocument,
} from "vscode";
import * as path from "path";
import * as vscode from "vscode";
import { Parser } from "./parser";

export class HooksDataProvider implements TreeDataProvider<TreeItem> {
    constructor(private files: Uri[]) {}

    getTreeItem(element: FilesLevel | TreeItem): TreeItem {
        return element;
    }

    getChildren(element?: FilesLevel | HookTypeLevel | undefined) {
        if (!element) {
            return this.files.map(
                (file) =>
                    new FilesLevel(
                        path.basename(file.fsPath),
                        file.fsPath,
                        TreeItemCollapsibleState.Collapsed
                    )
            );
        } else {
            if (element instanceof FilesLevel) {
                const uriFile = Uri.file(element.fsPath);
                return vscode.workspace
                    .openTextDocument(uriFile)
                    .then((result) => this.collectChildrenFromDoc(result));
            } else if (element instanceof HookTypeLevel) {
                return element.children;
            }
        }
    }

    private collectChildrenFromDoc(document: TextDocument) {
        const children: HookTypeLevel[] = [];
        const hooksData = Parser.parseHooksFromFile(document);
        for (const [hookType, hooks] of hooksData) {
            children.push(
                new HookTypeLevel(
                    hookType,
                    hooks.map(
                        (hook) => new HooksLevel(hook.tag, hook.description)
                    )
                )
            );
        }
        return children;
    }
}

class FilesLevel extends TreeItem {
    constructor(
        public label: string,
        public fsPath: string,
        public collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.fsPath = fsPath;
    }
}
class HookTypeLevel extends TreeItem {
    constructor(public label: string, public children?: HooksLevel[]) {
        super(
            label,
            children === undefined
                ? TreeItemCollapsibleState.None
                : TreeItemCollapsibleState.Collapsed
        );
        this.children = children;
    }
}
class HooksLevel extends TreeItem {
    constructor(public label: string, comments: string) {
        super(label, TreeItemCollapsibleState.None);
        this.tooltip = comments || "No comments provided";
        this.iconPath = new vscode.ThemeIcon("circle-outline");
    }
}
