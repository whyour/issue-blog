import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { checkConfiguration, getRepoList } from "./configuration";
import { Upload } from "./upload";
import { IssueInfo } from "./github";
import { markdownParse, getFileValue, getFileContent, markdownStringify } from "./markdown";
import * as Octokit from '@octokit/rest';
import * as open from 'open';

export async function createIssue() {
  await checkConfiguration();
  const upload = new Upload();	
  const result: IssueInfo = await markdownParse(upload);
  const issue = await upload.createIssue(result);
  const { number, html_url } = issue.data;
  const path = vscode.window.activeTextEditor!.document.fileName;
  const content = markdownStringify(issue.data);
  fs.writeFileSync(path, content);
  await vscode.window.showInformationMessage(`创建issue成功`, html_url);
  await open(html_url);
}

export async function updateIssue() {
  await checkConfiguration();
  const upload = new Upload();	
  const result = await markdownParse(upload) as Octokit.IssuesUpdateParamsDeprecatedAssignee;
  if (!result.issue_number) {
    vscode.window.showErrorMessage('当前文档尚未关联issue，请先创建issue或者手动在yaml header中添加issue_number指定要更新的issue');
    return;
  }
  await upload.updateIssue(result as Octokit.IssuesUpdateParamsDeprecatedAssignee);
  vscode.window.showInformationMessage('更新issue成功');
}

export async function getIssues() {
  await checkConfiguration();
  const upload = new Upload();	
  const issues = await upload.getIssues();
  console.log(issues);
  vscode.window.showInformationMessage('获取issue成功');
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
  await checkConfiguration();
  const upload = new Upload();	
  const repos = await upload.getRepos();
  console.log(repos);
  await getRepoList(repos);
}