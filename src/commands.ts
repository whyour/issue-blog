import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { checkConfiguration, getRepoList } from "./configuration";
import { Upload } from "./upload";
import { IssueInfo } from "./github";
import { markdownParse, getFileValue, getFileContent, markdownStringify } from "./markdown";
import { Octokit } from '@octokit/rest';
import * as open from 'open';
import { GitCommand } from './git';

export async function createIssue() {
  const config = await checkConfiguration();
  const upload = new Upload(config);
  const result: IssueInfo = await markdownParse(upload);
  if (!result) {
    return;
  }
  const issue = await upload.createIssue(result);
  const { number, html_url } = issue.data;
  const path = vscode.window.activeTextEditor!.document.fileName;
  const content = markdownStringify(issue.data);
  fs.writeFileSync(path, content);
  await vscode.window.showInformationMessage(`创建issue成功`, html_url);
  await open(html_url);
}

export async function updateIssue() {
  const config = await checkConfiguration();
  const upload = new Upload(config);
  const result = await markdownParse(upload) as Octokit.IssuesUpdateParamsDeprecatedAssignee;
  if (!result.issue_number) {
    vscode.window.showErrorMessage('当前文档尚未关联issue，请先创建issue或者手动在yaml header中添加issue_number指定要更新的issue');
    return;
  }
  const { data: {number, html_url} } = await upload.updateIssue(result as Octokit.IssuesUpdateParamsDeprecatedAssignee);
  vscode.window.showInformationMessage('更新issue成功', html_url);
}

export async function getIssues() {
  const config = await checkConfiguration();
  const upload = new Upload(config);	
  const issues = await upload.getIssues({state: 'open'});
  if (issues.data && issues.data.length > 0) {
    const _issues = issues.data.map(x => {
      return { label: x.title, description: x.html_url };
    });
    const _issue = await vscode.window.showQuickPick(
      _issues,
      { placeHolder: 'Select the issue you want to open' }
    );  
    if (_issue) {
      await open(_issue.description);
    }
  } else {
    vscode.window.showInformationMessage('暂无issue');
  }
}

export async function getPullRequests() {
  const config = await checkConfiguration();
  const upload = new Upload(config);
  const pullRequests = await upload.getPullRequests({state: 'open'});
  if (pullRequests.data && pullRequests.data.length > 0) {
    const _issues = pullRequests.data.map(x => {
      return { label: x.title, description: x.html_url };
    });
    const _issue = await vscode.window.showQuickPick(
      _issues,
      { placeHolder: 'Select the pull request you want to open' }
    );  
    if (_issue) {
      await open(_issue.description);
    }
  } else {
    vscode.window.showInformationMessage('暂无pull request');
  }
}

export async function createBlog() {
  let root = '';
  if (vscode.window.activeTextEditor) {
    root = path.dirname(vscode.window.activeTextEditor.document.fileName);
  } else {
    const pickRoot = await vscode.window.showOpenDialog({canSelectFolders: true});
    if (pickRoot) {
      root = pickRoot[0].fsPath;
    }
  }
  const filePath = await getFileValue(root);
  const content = await getFileContent();
  fs.appendFileSync(filePath, content);
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