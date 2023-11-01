import { RestEndpointMethodTypes } from '@octokit/rest';
import * as fs from 'fs/promises';
import open from 'open';
import * as path from 'path';
import * as vscode from 'vscode';
import { checkConfiguration } from './configuration';
import { GitCommand } from './git';
import { getFileContent, getFileValue, markdownParse, markdownStringify } from './markdown';
import { Upload } from './upload';

export async function createIssue() {
  const config = await checkConfiguration();
  const upload = new Upload(config);
  const result = await markdownParse();
  if (!result) {
    return;
  }
  if (result.issue_number) {
    vscode.window.showErrorMessage('当前文档已关联 issue, 请使用 update Issue 或者手动删除 yaml header 中 issue_number');
    return;
  }
  const issue = await upload.createIssue(result as RestEndpointMethodTypes['issues']['create']['parameters']);
  const { number, html_url } = issue.data;
  const path = vscode.window.activeTextEditor!.document.fileName;
  const content = markdownStringify(issue.data);
  await fs.writeFile(path, content);
  await vscode.window.showInformationMessage(`创建 issue 成功`, html_url);
  await open(html_url);
}

export async function updateIssue() {
  const config = await checkConfiguration();
  const upload = new Upload(config);
  const result = (await markdownParse()) as RestEndpointMethodTypes['issues']['update']['parameters'];
  if (!result.issue_number) {
    vscode.window.showErrorMessage(
      '当前文档尚未关联 issue, 请先创建 issue 或者手动在 yaml header 中添加 issue_number 指定要更新的 issue'
    );
    return;
  }
  const {
    data: { number, html_url },
  } = await upload.updateIssue(result);
  await vscode.window.showInformationMessage('更新 issue 成功', html_url);
  await open(html_url);
}

export async function getIssues() {
  const config = await checkConfiguration();
  const upload = new Upload(config);
  const issues = await upload.getIssues({ state: 'open' });
  if (issues.data && issues.data.length > 0) {
    const _issues = issues.data.map((x) => {
      return { label: x.title, description: x.html_url, issue: x };
    });
    const _issue = await vscode.window.showQuickPick(_issues, { placeHolder: 'Select the issue you want to open' });
    if (_issue) {
      const content = markdownStringify(_issue.issue);
      await vscode.workspace.openTextDocument({ language: 'markdown', content });
      vscode.window.showInformationMessage('点击链接查看 issue 详情', _issue.issue.html_url);
    }
  } else {
    vscode.window.showInformationMessage('暂无 issue');
  }
}

export async function getPullRequests() {
  const config = await checkConfiguration();
  const upload = new Upload(config);
  const pullRequests = await upload.getPullRequests({ state: 'open' });
  if (pullRequests.data && pullRequests.data.length > 0) {
    const _issues = pullRequests.data.map((x) => {
      return { label: x.title, description: x.html_url };
    });
    const _issue = await vscode.window.showQuickPick(_issues, {
      placeHolder: 'Select the pull request you want to open',
    });
    if (_issue) {
      await open(_issue.description);
    }
  } else {
    vscode.window.showInformationMessage('暂无 pull request');
  }
}

export async function createBlog() {
  let root = '';
  if (vscode.window.activeTextEditor) {
    root = path.dirname(vscode.window.activeTextEditor.document.fileName);
  } else {
    const pickRoot = await vscode.window.showOpenDialog({ canSelectFolders: true });
    if (pickRoot) {
      root = pickRoot[0].fsPath;
    }
  }
  const filePath = await getFileValue(root);
  const content = await getFileContent();
  await fs.appendFile(filePath, content);
  const openPath = vscode.Uri.file(filePath);
  await vscode.window.showTextDocument(openPath);
}

export async function getRepos() {
  const config = await checkConfiguration();
  const upload = new Upload(config);
  // const repos = await upload.getRepos();
  // console.log(repos);
  const git = new GitCommand();
  await git.getOriginUrl();
  // await getRepoList(repos);
}
