import * as Octokit from '@octokit/rest';
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
}

export class IssueInfo {
  title?: string = '';
  body?: string = '';
}

export class Github {
  octokit: Octokit;
  configuration: Configuration = new Configuration();
  repo: any;
  constructor() {
    const auth = this.checkAuthConfiguration(this.configuration.authConfig);
    this.repo = this.checkRepoConfiguration(this.configuration.repoConfig);
    this.octokit = new Octokit({
      auth: auth
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
    const { owner = '', repo = '' } = configuration;
    return { owner, repo };
  }

  async getIssues(): Promise<Octokit.Response<Octokit.IssuesListForRepoResponseItem[]>> {
    return this.octokit.issues.listForRepo(this.repo);
  }

  async createIssue({ title = '', body = '' }: IssueInfo): Promise<Octokit.Response<Octokit.IssuesCreateResponse>> {
    return this.octokit.issues.create({ ...this.repo, title, body });
  }

  async updateIssue({ title = '', body = '', issue_number }: Octokit.IssuesUpdateParamsDeprecatedAssignee): Promise<Octokit.Response<Octokit.IssuesUpdateResponse>> {
    return this.octokit.issues.update({ ...this.repo, title, body, issue_number });
  }

  async getRepos(): Promise<Octokit.Response<any>>  {
    return this.octokit.repos.list();
  }
}
