import * as vscode from 'vscode';
import { Upload } from './upload';
import { AuthConfiguration, RepoConfiguration } from './github';
import { Configuration } from './configuration';
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "issue-blog" is now active!');

  let disposable = vscode.commands.registerCommand(
    'extension.helloWorld',
    async () => {
      // const upload = new Upload();
      // const value1 = await vscode.window.showInputBox({
      //   prompt: 'Provide glob pattern of files to have empty last line.'
			// });
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
			const upload = new Upload();			

      vscode.window.showInformationMessage('Hello World!');
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
