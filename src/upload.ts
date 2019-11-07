import { Github } from './github';
import { Configuration } from './configuration';
export class Upload {
  github: Github;
  config: Configuration;
  constructor() {
    this.github = new Github();
    this.config = new Configuration();
    // this.github.getIssues();
    this.github.createIssue();
  }
}