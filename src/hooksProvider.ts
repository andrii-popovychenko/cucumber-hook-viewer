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

    getChildren(element?: FilesLevel | undefined) {
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
            const uriFile = Uri.file(element.fsPath);
            return vscode.workspace
                .openTextDocument(uriFile)
                .then((result) => this.collectChildrenFromDoc(result));
        }
    }

    private collectChildrenFromDoc(document: TextDocument) {
        const children: TreeItem[] = [];
        const hooksData = Parser.parseHooksFromFile(document);
        for (const [key, value] of hooksData) {
            children.push(new HooksLevel(value.tag, value.description));
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

class HooksLevel extends TreeItem {
    constructor(public label: string, comments: string) {
        super(label, TreeItemCollapsibleState.None);
        this.tooltip = comments || "No comments provided";
        this.iconPath = new vscode.ThemeIcon("circle-outline");
    }
}
