import * as ts from "typescript";
import { TextDocument } from "vscode";
import { Hook } from "./types";

export class Parser {
    static parseHooksFromFile = (textDocument: TextDocument) => {
        const node = ts.createSourceFile(
            textDocument.fileName,
            textDocument.getText(),
            ts.ScriptTarget.Latest
        );
        const hooksCollection = new Map<string, Hook[]>();

        const collectAllHooks = (
            children: ts.Node[],
            hooksCollection: Map<string, Hook[]>
        ) => {
            if (!children.length) {
                return;
            }
            children.forEach((child) => {
                if (Object.keys(child).includes("_children")) {
                    collectAllHooks(child.getChildren(), hooksCollection);
                } else {
                    if (child.kind === ts.SyntaxKind.ExpressionStatement) {
                        const { hookType, hook } =
                            Parser.getInformationFromNode(child);
                        const hooksByType = hooksCollection.get(hookType);
                        if (hooksByType) {
                            hooksByType.push(hook);
                            hooksCollection.set(hookType, hooksByType);
                        } else {
                            hooksCollection.set(hookType, [hook]);
                        }
                    }
                }
            });
        };
        collectAllHooks(node.getChildren(), hooksCollection);
        return hooksCollection;
    };

    private static getInformationFromNode(node: ts.Node) {
        const nodeValues = Object.entries(node);
        let comments = "";
        let tags = "";
        let hookType = "";
        nodeValues.forEach(([key, value]) => {
            if (key === "jsDoc") {
                comments = value[0].comment;
            }
            if (key === "expression") {
                if (value["arguments"] && value["arguments"].length) {
                    const argNode = value["arguments"][0];
                    if (argNode["properties"] && argNode["properties"].length) {
                        const propNode = argNode["properties"][0];
                        if (propNode.name.escapedText === "tags") {
                            tags = propNode.initializer.text;
                        }
                    }
                    hookType = value["expression"].escapedText;
                }
            }
        });
        const hook: Hook = {
            tag: tags || "",
            description: comments || "",
        };
        return {
            hookType,
            hook,
        };
    }
}
