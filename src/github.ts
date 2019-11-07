import * as Octokit from "@octokit/rest";
import { Configuration } from './configuration';

export class AuthConfiguration {
  token?: string = '';
  username?: string = '';
  password?: string = '';
  on2fa?() {
    return Promise.resolve('');
  }
}

export class RepoConfiguration {
  owner?: string = '';
  repo?: string = '';
  title?: string = '';
}

export class Github {
  octokit: Octokit;
  configuration: Configuration =new Configuration();
  constructor() {
    const result = this.checkAuthConfiguration(this.configuration.authConfig);
    this.octokit = new Octokit({
      auth: result
    });
  }

  private checkAuthConfiguration(configuration: AuthConfiguration) {
    const { username = '', password = '', token = '' } = configuration;
    if (configuration.token) {
      return `token ${token}`;
    } else {
      return { username, password, on2fa: () => Promise.resolve('') };
    }
  }

  private checkRepoConfiguration(configuration: RepoConfiguration) {
    const { owner = '', repo = '', title = '' } = configuration;
    return { owner, repo, title };
  }

  async getIssues(): Promise<Octokit.Response<Octokit.IssuesListForRepoResponseItem[]>> {
    const result = this.checkRepoConfiguration(this.configuration.repoConfig);
    return this.octokit.issues.listForRepo(result);
  }

  async createIssue(): Promise<Octokit.Response<Octokit.IssuesCreateResponse>> {
    const result = this.checkRepoConfiguration(this.configuration.repoConfig);
    return this.octokit.issues.create(result);
  }
}