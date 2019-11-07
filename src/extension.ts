import * as vscode from 'vscode';
import { Upload } from './upload';
import { Configuration } from './configuration';
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "issue-blog" is now active!');
  let disposable = vscode.commands.registerCommand(
    'extension.createIssue',
    async () => {
      await checkConfiguration();
      const upload = new Upload();	
      if (vscode.window.activeTextEditor) {
        if (vscode.window.activeTextEditor.document.languageId === 'markdown') {
          const title = await vscode.window.showInputBox({
            prompt: '请输入标题',
            placeHolder: 'Please enter issue title'
          });
          const body = vscode.window.activeTextEditor.document.getText();
          await upload.createIssue({ title, body });
          vscode.window.showInformationMessage('创建issue成功');
        } else {
          vscode.window.showInformationMessage('请打开markdown文档再执行该命令');
        }
      } else {
        vscode.window.showInformationMessage('请打开markdown文档再执行该命令');
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() { }

async function checkConfiguration() {
  const configuration = new Configuration();
  const { authConfig, repoConfig} = configuration;
  if (
    !authConfig.token &&
    !authConfig.username && !authConfig.password
  ) {
    await configuration.promptAuthConfiguration();
  }
  if (
    !repoConfig.owner &&
    !repoConfig.repo
  ) {
    await configuration.promptRepoConfiguration();
  }
}
