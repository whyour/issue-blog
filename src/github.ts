import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
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
  issue_number?: number;
}

export class Github {
  octokit: Octokit;
  repo: RepoConfiguration;
  constructor(config: Pick<Configuration, 'authConfig' | 'repoConfig'>) {
    const auth = this.checkAuthConfiguration(config.authConfig);
    this.repo = this.checkRepoConfiguration(config.repoConfig);
    this.octokit = new Octokit({
      auth: auth,
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
  async getIssues(
    param?: Omit<RestEndpointMethodTypes['issues']['listForRepo']['parameters'], 'repo' | 'owner'>
  ): Promise<RestEndpointMethodTypes['issues']['listForRepo']['response']> {
    return this.octokit.issues.listForRepo({ ...this.repo, ...param });
  }

  async getPullRequests(
    param?: Omit<RestEndpointMethodTypes['pulls']['list']['parameters'], 'repo' | 'owner'>
  ): Promise<RestEndpointMethodTypes['pulls']['list']['response']> {
    return this.octokit.pulls.list({ ...this.repo, ...param });
  }

  async createIssue({
    title = '',
    body = '',
  }: RestEndpointMethodTypes['issues']['create']['parameters']): Promise<
    RestEndpointMethodTypes['issues']['create']['response']
  > {
    return this.octokit.issues.create({ ...this.repo, title, body });
  }

  async updateIssue({
    title = '',
    body = '',
    issue_number,
  }: RestEndpointMethodTypes['issues']['update']['parameters']): Promise<
    RestEndpointMethodTypes['issues']['update']['response']
  > {
    return this.octokit.issues.update({ ...this.repo, title, body, issue_number });
  }

  async getRepos(): Promise<RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']> {
    return this.octokit.repos.listForAuthenticatedUser();
  }

  async getEvents(): Promise<RestEndpointMethodTypes['activity']['listNotificationsForAuthenticatedUser']['response']> {
    return this.octokit.activity.listNotificationsForAuthenticatedUser({ all: true });
    // return this.octokit.activity.listWatchedReposForAuthenticatedUser()
    // return this.octokit.activity.listReceivedEventsForUser({
    //   username: 'whyour',
    //   per_page: 100,
    //   page: 1
    // })
  }

  async getUser(): Promise<RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]> {
    return this.octokit.users.getAuthenticated();
  }
}
