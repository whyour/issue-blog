# Issue Blog

一个用 github issue 创建博客的 vscode 插件

A vscode plugin to create a blog with issue

* 新建空文档 `Create a new empty document`

![create blog](resource/images/one.jpg)

* 新建 issue `Create issue`

![create issue](resource/images/two.jpg)

## Features

- [x] 在 vscode 中以当前文档来在指定仓库中创建 issue
- [x] 支持直接读取 markdown 文档中的 yaml header 中的 title 作为 issue 标题
- [x] 支持创建带 title 的 markdown 文档
- [x] 支持更新已存在的 issue
- [x] 支持获取仓库中的 issue 列表，可选择 issue 在默认浏览器中打开
- [x] 支持获取仓库中的 pr 列表，可选择 pr 在默认浏览器中打开

## Commands

```json
{
  "command": "extension.createIssue",
  "title": "Create Issue"
},
{
  "command": "extension.updateIssue",
  "title": "Update Issue"
},
{
  "command": "extension.createBlog", // Create a new empty document
  "title": "Create Blog"
}，
{
  "command": "extension.getIssues",
  "title": "Issue: Get Issues"
},
{
  "command": "extension.getPullRequests",
  "title": "Issue: Get PullRequests"
}
```

## Tips

文档中的图片可以使用[vs-picgo](https://github.com/PicGo/vs-picgo)可以用默认的[SM.MS](https://sm.ms/)先上传之后，然后创建 issue 之后，会自动上传到 github，如果引用本地图片，创建 issue 之后会无法引用照片。

Document images can be used to [v - picgo](https://github.com/PicGo/vs-picgo) can use the default [SM. MS](https://sm.ms/) after upload first, and then create issue, will automatically be uploaded to the lot, if the reference images, local created after the issue will be unable to reference pictures.

## Extension Settings
`// username/password 和 token 只需要提供一种`

* `issue.username`: 设置 github 用户名
* `issue.password`: 设置 github 密码
* `issue.token`: 设置 github person access token
* `issue.owner`: 设置 github 仓库 owner
* `issue.repo`: 设置 github issue-blog 仓库名

## Version Feature

### 0.0.7

* 支持获取仓库中的 issue 列表，可选择 issue 在默认浏览器中打开
* Supports to get the issue list in the repository, optionally open issue in the default browser
* 支持获取仓库中的 pr 列表，可选择 pr 在默认浏览器中打开
* Support to get a list of pr in the repository, optionally open pr in the default browser

### 0.0.5

* 支持根据 yaml header 中的 issue_number 更新 issue
* Support for updating the issue based on the issue_number in the yaml header

### 0.0.4

* 支持创建带 title 的 markdown 文档
* Support for creating markdown documents with title

### 0.0.3

* 支持直接读取 markdown 文档中的 yaml header 中的 title 作为 issue 标题
* Support for directly reading the title from the yaml header in the markdown document as the issue title

### 0.0.1

* 支持根据 markdown 文档创建 issue
* Support for creating issues based on markdown documents

-----------------------------------------------------------------------------------------------------------

**Enjoy!**
