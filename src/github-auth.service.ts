import express from 'express';
import got from 'got';
import { Server } from 'http';
import { URL, URLSearchParams } from 'url';

export class GitHubOAuthService {
  public app: express.Express;
  public server!: Server;

  constructor(public port: number) {
    this.app = express();
    this.port = port;
    this.app.use(express.json(), express.urlencoded({ extended: false }));
  }

  public async StartProcess(cmd?: string) {
    const host = new URL('https://github.com');

    this.server = this.app.listen(this.port);
    return new Promise((resolve, reject) => {
      this.app.get('/callback', async (req: { param: (arg0: string) => string; }, res: { send: (arg0: string) => void; }) => {
        try {
          const params = new URLSearchParams(await this.getToken(req.param('code'), host));

          res.send(`
          <!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta
                http-equiv="Content-Security-Policy"
                content="default-src vscode-resource:; form-action vscode-resource:; frame-ancestors vscode-resource:; img-src vscode-resource: https:; script-src 'self' 'unsafe-inline' vscode-resource:; style-src 'self' 'unsafe-inline' vscode-resource:;"
              />
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            </head>
            <body>
                <h1>Success! You may now close this tab.</h1>
                <style>
                  html, body {
                    background-color: #1a1a1a;
                    color: #c3c3c3;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    margin: 0;
                  }
                </style>
            </body>
          </html>
          `);
          this.server.close();

          const token = params.get('access_token') as string;
          const user = await this.getUser(token, host);
          resolve({ token, user });
        } catch (err) {
          const error = new Error(err);
          reject(error);
        }
      });
    })
  }

  public async getToken(code: string, host: URL) {
    const params = new URLSearchParams();
    params.append('client_id', 'e32c4cda0b829b161944');
    params.append('client_secret', '2a883c7fcaf9617f67f9157245d498495dd46032');
    params.append('code', code);

    const res = await got.post(`https://${host.hostname}/login/oauth/access_token`, {
      form: params
    });
    return res.body;
  }

  public async getUser(token: string, host: URL) {
    const body = await got.get(`https://api.${host.hostname}/user`, {
      headers: { Authorization: `token ${token}` }
    }).json();
    return (body as any).name;
  }
}
