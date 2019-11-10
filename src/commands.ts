import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { checkConfiguration } from "./configuration";
import { Upload } from "./upload";
import { IssueInfo } from "./github";
import { markdownParse, getFileValue, getFileContent } from "./markdown";

export async function createIssue() {
  await checkConfiguration();
  const upload = new Upload();	
  const result: IssueInfo = await markdownParse(upload);
  const issue = await upload.createIssue(result);
  vscode.window.showInformationMessage('创建issue成功');
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