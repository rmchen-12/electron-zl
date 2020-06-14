## 快速上手

安装 `yarn | cnpm i`

启动调试 `yarn start | npm start`

## 快速创建一个路由页面

- vscode 安装 `Create Item By Template`
- `F1 | ctrl p` 唤起输入框后键入路径，这个项目是 `app/src/views/{your-route-name}`
- 将在对应的路径里生成页面模板
- 想自定义的话可以修改 `.vscode` 文件夹中的 `create-item.template.js` 文件

## 概览

- 前端

  - webpack
  - electron
  - electron-builder
  - electron-log
  - react
  - react-router
  - redux
  - ant-design
  - remixicon
  - less
  - typescript
  - eslint
  - prettier
  - lowdb

- 后端

  - egg
  - gitlab api
  - mysql

- 部署
  - docker
  - jenkins

数据存储
- 前端 `lowdb` , lodash api，操作简单 [简单使用介绍](https://molunerfinn.com/electron-vue-3/)
- 后端 `mysql` ，因为公司用的 `mysql` ,觉得更贴近平时开发环境

## DevTools

开关 DevTools:

- OSX: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## 打包应用

编辑 [builder.config.ts](./build/builder.config.ts) 配置文件.

配置详情请查看: https://www.electron.build/configuration/configuration

执行打包操作.

```
npm run build
```

请在打包完成后检查 `release` 目录.

## FAQ

- 国内 electron 安装缓慢问题,请查看此 [issue](https://github.com/lanten/electron-antd/issues/22)
