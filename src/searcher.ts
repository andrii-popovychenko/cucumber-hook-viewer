import * as vscode from 'vscode';
import { WorkspaceFolder, RelativePattern } from 'vscode';
import Constants from './constants';

export class Searcher {

    private workspaceFolder: WorkspaceFolder;

    constructor() {
        if (vscode.workspace.workspaceFolders?.length) {
            this.workspaceFolder = vscode.workspace.workspaceFolders[0];
        } else {
            throw new Error('You need to set up workspace!');
        }
    }

    readFolderPath = () => vscode.workspace.getConfiguration(Constants.ExtensionName).get(Constants.PathToHookFolder) as string;

    isSettingExist = () => vscode.workspace.getConfiguration(Constants.ExtensionName).get(Constants.PathToHookFolder);

    findFiles = () => {
        const folderPath = this.readFolderPath();
        const searchPattern = new RelativePattern(this.workspaceFolder, `${folderPath}/*.ts`);
        return vscode.workspace.findFiles(searchPattern.pattern);
    };

}