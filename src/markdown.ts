import { window } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Upload } from './upload';
import { IssueInfo } from './github';
import { parse, stringify } from './yaml';
import * as Octokit from '@octokit/rest';

export async function markdownParse(upload: Upload): Promise<IssueInfo | Octokit.IssuesUpdateParamsDeprecatedAssignee> {
  if (window.activeTextEditor) {
    if (window.activeTextEditor.document.languageId === 'markdown') {
      const document = window.activeTextEditor.document;
      const data = fs.readFileSync(document.fileName, { encoding: 'utf-8' });
      const { attributes, body } = parse(data);
      let title = attributes && attributes.title;
      let issue_number = attributes && attributes.issue_number;
      if (!title) {
        title = await window.showInputBox({
          prompt: '请输入标题',
          placeHolder: 'Please enter issue title'
        });  
      }
      return { title, body, issue_number };
    } else {
      window.showInformationMessage('请打开markdown文档再执行该命令');
    }
  } else {
    window.showInformationMessage('请打开markdown文档再执行该命令');
  }
  return { title: '', body: '', issue_number: undefined };
}

export function markdownStringify(issue: Octokit.IssuesCreateResponse): string {
  const { number: issue_number, body, title } = issue;
  return stringify({ issue_number, title, body });
}

export async function getFileValue(root: string): Promise<string> {
  const title = await window.showInputBox({
    prompt: '请输入文件名',
    placeHolder: 'Please enter filename'
  });  
  const fullPath = path.join(root, `${title}.md`);
  return fullPath;
}

export async function getFileContent(): Promise<string> {
  const title = await window.showInputBox({
    prompt: '请输入Issue标题',
    placeHolder: 'Please enter issue title'
  });  
  return stringify({ title });
}