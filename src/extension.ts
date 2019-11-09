import * as vscode from 'vscode';
import { createIssue, getIssues } from './commands';
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "issue-blog" is now active!');
  let _createIssue = vscode.commands.registerCommand(
    'extension.createIssue',
    createIssue
  );

  let _getIssues = vscode.commands.registerCommand(
    'extension.getIssues',
    getIssues
  );
  const dispose = [_createIssue, _getIssues];
  context.subscriptions.push(...dispose);
}

export function deactivate() {}
