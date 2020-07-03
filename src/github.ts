import {Octokit} from '@octokit/rest'
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
  owner: string = '';
  repo: string = '';
}

export class IssueInfo {
  title?: string = '';
  body?: string = '';
}

export class Github {
  octokit: Octokit;
  repo: RepoConfiguration;
  constructor(config: Pick<Configuration, 'authConfig' | 'repoConfig'>) {
    const auth = this.checkAuthConfiguration(config.authConfig);
    this.repo = this.checkRepoConfiguration(config.repoConfig);
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

  async getIssues(param?: Omit<Octokit.IssuesListForRepoParams,'repo' | 'owner'>): Promise<Octokit.Response<Octokit.IssuesListForRepoResponseItem[]>> {
    return this.octokit.issues.listForRepo({...this.repo, ...param});
  }

  async getPullRequests(param?: Omit<Octokit.PullsListParams,'repo' | 'owner'>): Promise<Octokit.Response<Octokit.PullsListResponse>> {
    return this.octokit.pulls.list({...this.repo, ...param});
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

  async getEvents(): Promise<Octokit.Response<any>>  {
    return this.octokit.activity.listNotifications({ all: true });
    // return this.octokit.activity.listWatchedReposForAuthenticatedUser()
    // return this.octokit.activity.listReceivedEventsForUser({
    //   username: 'whyour',
    //   per_page: 100,
    //   page: 1
    // })
  }
}
