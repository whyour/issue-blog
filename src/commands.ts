import * as vscode from 'vscode';
import { checkConfiguration } from "./configuration";
import { Upload } from "./upload";
import { IssueInfo } from "./github";
import { markdownParse } from "./markdown";

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