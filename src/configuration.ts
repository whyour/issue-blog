import { URL } from 'url';
import * as vscode from 'vscode';
import { GitCommand } from './git';
import { AuthConfiguration, RepoConfiguration } from './github';
import { GitHubOAuthService } from './github-auth.service';
import { Upload } from './upload';

export class Configuration {
  configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration();
  repoConfig: RepoConfiguration = new RepoConfiguration();
  authConfig: AuthConfiguration = new AuthConfiguration();
  constructor() {}

  async getConfiguration() {
    const token: string | undefined = this.configuration.get('issue.token');
    const username: string | undefined = this.configuration.get('issue.username');
    const password: string | undefined = this.configuration.get('issue.password');
    const owner: string | undefined = this.configuration.get('issue.owner');
    const repo: string | undefined = this.configuration.get('issue.repo');
    // const isCustomRepo: boolean | undefined = this.configuration.get('issue.isCustomRepo');
    this.authConfig = { token, username, password };
    // if (!isCustomRepo) {
    //   this.repoConfig = await this.getRepoFromWorkSpace();
    //   if (this.repoConfig.owner && this.repoConfig.repo) {
    //     return;
    //   }
    // }
    this.repoConfig = { owner: owner || '', repo: repo || '' };
  }

  async getRepoFromWorkSpace() {
    const git = new GitCommand();
    let remoteUrl = await git.getOriginUrl();
    if (remoteUrl) {
      const [, owner = '', repo = ''] = remoteUrl.match(
        /(?<=\.com[\:|\/])([\w-]+)\/([\w-]+)(?=\.git)/
      ) as Array<string>;
      return { owner, repo };
    } else {
      return { owner: '', repo: '' };
    }
  }

  async promptAuthConfiguration(): Promise<AuthConfiguration> {
    let result: AuthConfiguration = new AuthConfiguration();
    const authWay = await vscode.window.showQuickPick(
      [
        {
          label: 'Token',
          description: 'Logic With Github',
          target: vscode.ConfigurationTarget.Global,
        },
      ],
      { placeHolder: 'logic with github' }
    );
    if (authWay) {
      const app = new GitHubOAuthService(54321);
      const host = new URL('https://github.com');
      vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.parse(
          `https://${host.hostname}/login/oauth/authorize?scope=public_repo&client_id=e32c4cda0b829b161944&redirect_uri=http://localhost:54321/callback`
        )
      );
      const { token, user } = (await app.StartProcess()) as any;
      await this.configuration.update('issue.token', token, authWay.target);
      await this.configuration.update('issue.owner', user, authWay.target);
      this.authConfig = { ...this.authConfig, token };
      this.repoConfig = { ...this.repoConfig, owner: user };
      return { ...result, token };
    } else {
      return result;
    }
  }

  async promptRepoConfiguration(): Promise<RepoConfiguration> {
    let result: RepoConfiguration = new RepoConfiguration();
    let owner, repo;
    if (!this.repoConfig.repo) {
      repo = await vscode.window.showInputBox({
        prompt: '请输入博客所在仓库名',
        placeHolder: 'Please enter the repository name',
      });
    }
    if (owner) {
      await this.configuration.update('issue.owner', owner, true);
      this.repoConfig = { ...this.repoConfig, owner };
    }
    if (repo) {
      await this.configuration.update('issue.repo', repo, true);
      this.repoConfig = { ...this.repoConfig, repo };
    }
    return { ...result, ...this.repoConfig };
  }
}

export async function checkConfiguration(): Promise<Pick<Configuration, 'authConfig' | 'repoConfig'>> {
  const configuration = new Configuration();
  await configuration.getConfiguration();
  let { authConfig, repoConfig } = configuration;
  if (!authConfig.token && (!authConfig.username || !authConfig.password)) {
    authConfig = await configuration.promptAuthConfiguration();
  }
  if (!repoConfig.owner || !repoConfig.repo) {
    repoConfig = await configuration.promptRepoConfiguration();
  }
  const config = { authConfig, repoConfig };
  const upload = new Upload(config);
  try {
    await upload.getUser();
    return config;
  } catch (error: any) {
    if (error.status === 401) {
      await configuration.configuration.update('issue.token', '', true);
      await checkConfiguration();
    } else {
      await vscode.window.showErrorMessage(`配置检查失败`, error);
    }
  }
  return {} as Pick<Configuration, 'authConfig' | 'repoConfig'>;
}

export async function getRepoList() {
  const authWay = await vscode.window.showQuickPick(
    [
      {
        label: '用户名密码',
        description: 'Username / Password',
        target: vscode.ConfigurationTarget.Global,
      },
      {
        label: 'Token',
        description: 'Personal Access Tokens',
        target: vscode.ConfigurationTarget.Global,
      },
    ],
    { placeHolder: 'Please select github authentication' }
  );
}
