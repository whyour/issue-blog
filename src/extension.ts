import * as vscode from 'vscode';
import { createIssue, getIssues, createBlog, getRepos } from './commands';
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "issue-blog" is now active!');
  const _createIssue = vscode.commands.registerCommand(
    'extension.createIssue',
    createIssue
  );

  const _getIssues = vscode.commands.registerCommand(
    'extension.getIssues',
    getIssues
  );

  const _createBlog = vscode.commands.registerCommand(
    'extension.createBlog',
    createBlog
  );

  const _getRepos = vscode.commands.registerCommand( // TODO: 获取最近repos，支持搜索
    'extension.getRepos',
    getRepos
  );
  
  const dispose = [_createIssue, _getIssues, _createBlog];
  context.subscriptions.push(...dispose);
}

export function deactivate() {}
