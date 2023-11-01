import { RestEndpointMethodTypes } from '@octokit/rest';
import { Configuration } from './configuration';
import { Github } from './github';

export class Upload {
  github: Github;
  // config: Configuration;
  constructor(config: Pick<Configuration, 'authConfig' | 'repoConfig'>) {
    this.github = new Github(config);
  }

  async createIssue(issueInfo: RestEndpointMethodTypes['issues']['create']['parameters']) {
    return await this.github.createIssue(issueInfo);
  }

  async updateIssue(issueInfo: RestEndpointMethodTypes['issues']['update']['parameters']) {
    return await this.github.updateIssue(issueInfo);
  }

  async getIssues(param?: Omit<RestEndpointMethodTypes['issues']['listForRepo']['parameters'], 'repo' | 'owner'>) {
    return await this.github.getIssues(param);
  }

  async getPullRequests(param?: Omit<RestEndpointMethodTypes['pulls']['list']['parameters'], 'repo' | 'owner'>) {
    return await this.github.getPullRequests(param);
  }

  async getRepos() {
    return await this.github.getRepos();
  }

  async getUser() {
    return await this.github.getUser();
  }
}
