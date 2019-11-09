import { AuthConfiguration, RepoConfiguration } from './github';
import * as vscode from 'vscode';

export class Configuration {
  configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();
  repoConfig: RepoConfiguration = new RepoConfiguration();
  authConfig: AuthConfiguration = new AuthConfiguration();
  constructor() {
    this.checkConfiguration();
  }
  checkConfiguration() {
    const token: string | undefined = this.configuration.get(
      'issue.token'
    );
    const username: string | undefined = this.configuration.get(
      'issue.username'
    );
    const password: string | undefined = this.configuration.get(
      'issue.password'
    );
    const owner: string | undefined = this.configuration.get(
      'issue.owner'
    );
    const repo: string | undefined = this.configuration.get(
      'issue.repo'
    );
    this.repoConfig = { owner, repo };
    this.authConfig = { token, username, password };
  }

  async promptAuthConfiguration(): Promise<AuthConfiguration> {
    let result: AuthConfiguration = new AuthConfiguration();
    const authWay = await vscode.window.showQuickPick(
      [
        {
          label: '用户名密码',
          description: 'Username / Password',
          target: vscode.ConfigurationTarget.Global
        },
        {
          label: 'Token',
          description: 'Personal Access Tokens',
          target: vscode.ConfigurationTarget.Global
        }
      ],
      { placeHolder: 'Please select github authentication' }
    );
    if (authWay) {
      if (authWay.label === 'Token') {
        const token = await vscode.window.showInputBox({
          prompt: '请输入创建的 Personal Access Tokens',
          placeHolder: 'Enter Personal Access Tokens you created'
        });
        await this.configuration.update(
          'issue.token',
          token,
          authWay.target
        );
        this.authConfig = { ...this.authConfig, token };
        return { ...result, token };
      } else {
        const username = await vscode.window.showInputBox({
          prompt: '请输入用户名',
          placeHolder: 'Please enter username'
        });
        const password = await vscode.window.showInputBox({
          prompt: '请输入密码',
          placeHolder: 'Please enter password'
        });
        await this.configuration.update(
          'issue.username',
          username,
          authWay.target
        );
        await this.configuration.update(
          'issue.password',
          password,
          authWay.target
        );
        this.authConfig = { ...this.authConfig, username, password };
        return { ...result, username, password };
      }
    } else {
      return result;
    }
  }

  async promptRepoConfiguration(): Promise<RepoConfiguration> {
    let result: RepoConfiguration = new RepoConfiguration();
    const owner = await vscode.window.showInputBox({
      prompt: '请输入用户名',
      placeHolder: 'Please enter username'
    });
    const repo = await vscode.window.showInputBox({
      prompt: '请输入仓库名',
      placeHolder: 'Please enter the repository name'
    });
    await this.configuration.update(
      'issue.owner',
      owner,
      true
    );
    await this.configuration.update(
      'issue.repo',
      repo,
      true
    );
    this.repoConfig = {...this.repoConfig, owner, repo };
    return { ...result, owner, repo };
  }
}

export async function checkConfiguration() {
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
