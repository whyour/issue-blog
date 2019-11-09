# Issue Blog

一个用 github issue 创建博客的 vscode 插件

A vscode plugin to create a blog with issue

## Features

- [x] 在 vscode 中以当前文档来在指定仓库中创建 issue
- [x] 支持直接读取 markdown 文档中的 yaml header 中的 title 作为 issue 标题

## Requirements

```bash
yarn add @octokit/rest
// or
npm i @octokit/rest
```

## Extension Settings
`// username/password 和 token 只需要提供一种`

* `issue.username`: 设置 github 用户名
* `issue.password`: 设置 github 密码
* `issue.token`: 设置 github person access token
* `issue.owner`: 设置 github 仓库 owner
* `issue.repo`: 设置 github issue-blog 仓库名

### 0.0.3

支持直接读取 markdown 文档中的 yaml header 中的 title 作为 issue 标题

Support for directly reading the title from the yaml header in the markdown document as the issue title

### 0.0.1

支持根据 markdown 文档创建 issue

Support for creating issues based on markdown documents

-----------------------------------------------------------------------------------------------------------

**Enjoy!**
