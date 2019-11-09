import * as fm from 'front-matter';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { Upload } from './upload';
import { IssueInfo } from './github';

export async function markdownParse(upload: Upload): Promise<IssueInfo> {
  if (vscode.window.activeTextEditor) {
    if (vscode.window.activeTextEditor.document.languageId === 'markdown') {
      const document = vscode.window.activeTextEditor.document;
      const data = fs.readFileSync(document.fileName, { encoding: 'utf-8' });
      const { attributes, body } = fm(data);
      let title = attributes && attributes.title;
      if (!title) {
        title = await vscode.window.showInputBox({
          prompt: '请输入标题',
          placeHolder: 'Please enter issue title'
        });  
      }
      console.log(title);
      return { title, body };
    } else {
      vscode.window.showInformationMessage('请打开markdown文档再执行该命令');
    }
  } else {
    vscode.window.showInformationMessage('请打开markdown文档再执行该命令');
  }
  return { title: '', body: '' };
}