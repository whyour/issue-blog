import * as gitJs from 'simple-git/promise';
import * as vscode from 'vscode';

export class GitCommand {
  async getOriginUrl(): Promise<string> {
    const root = this.getRootPath();
    if (root) {
      const git = gitJs(root);
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        return '';
      }
      const url = await git.listRemote(['--get-url']);
      return url ? url : '';
    } else {
      return '';
    }
  }

  getRootPath() {
    if (vscode.workspace.workspaceFolders) { 
      const folders = vscode.workspace.workspaceFolders;
      if (vscode.window.activeTextEditor) {
        const filePath = vscode.window.activeTextEditor.document.uri.fsPath;
        for (const folder of folders) {
          if (filePath.indexOf(folder.uri.fsPath)) {
            return folder.uri.fsPath;
          }
        }
      } 
      else {
        return vscode.workspace.workspaceFolders[0].uri.fsPath;
      }
    }
  }

}