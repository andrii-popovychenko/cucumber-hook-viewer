import * as vscode from 'vscode';
import { RelativePattern } from 'vscode';
import Constants from './constants';

export class Searcher {

    constructor() {}

    private getWorkspaceFolder = () => {
        if (vscode.workspace.workspaceFolders?.length) {
            return vscode.workspace.workspaceFolders[0];
        } else {
            throw new Error('You need to set up workspace!');
        }
    };

    readFolderPath = () => vscode.workspace.getConfiguration(Constants.extensionName).get(Constants.pathToHookFolder) as string;

    isSettingExist = () => vscode.workspace.getConfiguration(Constants.extensionName).has(Constants.pathToHookFolder);

    findFiles = () => {
        const workspaceFolder = this.getWorkspaceFolder();
        const folderPath = this.readFolderPath();
        const searchPattern = new RelativePattern(workspaceFolder, `${folderPath}/*.ts`);
        return vscode.workspace.findFiles(searchPattern.pattern);
    };

}