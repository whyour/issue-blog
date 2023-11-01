import { RestEndpointMethodTypes } from '@octokit/rest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { window } from 'vscode';
import { IssueInfo } from './github';
import { parse, stringify } from './yaml';

export async function markdownParse(): Promise<IssueInfo> {
  if (window.activeTextEditor) {
    if (window.activeTextEditor.document.languageId === 'markdown') {
      const document = window.activeTextEditor.document;
      const data = await fs.readFile(document.fileName, { encoding: 'utf-8' });
      const { attributes, body } = parse(data) as { attributes: { title?: string; issue_number?: number }; body: any };
      let title = attributes && attributes.title;
      let issue_number = attributes && attributes.issue_number;
      if (!title) {
        title = await window.showInputBox({
          prompt: '请输入标题',
          placeHolder: 'Please enter issue title',
        });
      }
      return { title, body, issue_number };
    } else {
      window.showInformationMessage('请打开 markdown 文档再执行该命令');
      return null as any;
    }
  } else {
    window.showInformationMessage('请打开 markdown 文档再执行该命令');
    return null as any;
  }
}

export function markdownStringify(issue: RestEndpointMethodTypes['issues']['create']['response']['data']): string {
  const { number: issue_number, body, title } = issue;
  return stringify({ issue_number, title, body });
}

export async function getFileValue(root: string): Promise<string> {
  const title = await window.showInputBox({
    prompt: '请输入文件名',
    placeHolder: 'Please enter filename',
  });
  const fullPath = path.join(root, `${title}.md`);
  return fullPath;
}

export async function getFileContent(): Promise<string> {
  const title = await window.showInputBox({
    prompt: '请输入Issue标题',
    placeHolder: 'Please enter issue title',
  });
  return stringify({ title });
}
