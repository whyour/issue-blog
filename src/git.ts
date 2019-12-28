import * as gitJs from 'simple-git/promise';
const git = gitJs();

export class GitCommand {
  async getOriginUrl(): Promise<string> {
    const url = await git.listRemote(['--get-url']);
    return url;
  }
}