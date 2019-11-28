import { Github, IssueInfo } from './github';
import { Configuration } from './configuration';
import * as Octokit from '@octokit/rest';

export class Upload {
  github: Github;
  config: Configuration;
  constructor() {
    this.github = new Github();
    this.config = new Configuration();
  }

  async createIssue(issueInfo: IssueInfo) {
    return await this.github.createIssue(issueInfo);
  }

  async updateIssue(issueInfo: Octokit.IssuesUpdateParamsDeprecatedAssignee) {
    return await this.github.updateIssue(issueInfo);
  }

  async getIssues(param?: Omit<Octokit.IssuesListForRepoParams,'repo' | 'owner'>) {
    return await this.github.getIssues(param);
  }

  async getPullRequests(param?: Omit<Octokit.PullsListParams,'repo' | 'owner'>) {
    return await this.github.getPullRequests(param);
  }

  async getRepos() {
    return await this.github.getRepos();
  }
}
