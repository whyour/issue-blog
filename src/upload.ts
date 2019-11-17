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

  async getIssues() {
    return await this.github.getIssues();
  }

  async getRepos() {
    return await this.github.getRepos();
  }
}
