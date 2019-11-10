import { window } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Upload } from './upload';
import { IssueInfo } from './github';
import { parse, stringify } from './yaml';

export async function markdownParse(upload: Upload): Promise<IssueInfo> {
  if (window.activeTextEditor) {
    if (window.activeTextEditor.document.languageId === 'markdown') {
      const document = window.activeTextEditor.document;
      const data = fs.readFileSync(document.fileName, { encoding: 'utf-8' });
      const { attributes, body } = parse(data);
      let title = attributes && attributes.title;
      if (!title) {
        title = await window.showInputBox({
          prompt: '请输入标题',
          placeHolder: 'Please enter issue title'
        });  
      }
      console.log(title);
      return { title, body };
    } else {
      window.showInformationMessage('请打开markdown文档再执行该命令');
    }
  } else {
    window.showInformationMessage('请打开markdown文档再执行该命令');
  }
  return { title: '', body: '' };
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