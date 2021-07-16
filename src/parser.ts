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
        node.forEachChild(child => {
            if (child.kind === ts.SyntaxKind.ExpressionStatement) {
                const nodeValues = Object.entries(child);
                let comments = '';
                let tags = '';
                let hookType = '';
                console.log(nodeValues);
                nodeValues.forEach(([key, value]) => {
                    if (key === 'jsDoc') {
                        comments = value[0].comment;
                    }
                    if (key === 'expression') {
                        if (value['arguments'] && value['arguments'].length) {
                            const argNode = value['arguments'][0];
                            if (argNode['properties'] && argNode['properties'].length) {
                                const propNode = argNode['properties'][0];
                                if (propNode.name.escapedText === 'tags') {
                                    tags = propNode.initializer.text;
                                }
                            }
                            hookType = value['expression'].escapedText;
                        }
                    }
                });
                if (tags && comments) {
                    const hook: Hook = {
                        tag: tags,
                        description: comments
                    };
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
        return hooksCollection;
    };
}