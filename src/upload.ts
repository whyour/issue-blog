import { Github, IssueInfo } from './github';
import { Configuration } from './configuration';
export class Upload {
  github: Github;
  config: Configuration;
  constructor() {
    this.github = new Github();
    this.config = new Configuration();
  }

  async createIssue(issueInfo: IssueInfo) {
    await this.github.createIssue(issueInfo);    
  }

  getIssues() {
    this.github.getIssues();    
  }
}