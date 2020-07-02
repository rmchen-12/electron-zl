/**
 * 定义本地存储模型
 */

/** 授权token */
export const token = ''

/** 开发项目目录 */
export const workPaths = {
  rootPath: '',
  adminPath: '',
  zappPath: '',

  /** 其他单个项目路径 */
  // xxx1: '',
  // xxx2: ''
}

/** 开发NPM目录 */
export const npmPaths = {
  // utils: d:/utils,
  // xxx2: ''
}

/** 收藏的快捷导航 */
export const sites = {
  github: 'https://github.com/',
  // xxx2: ''
}

/** - interface - split ------------------------------------------------------------------- */

declare global {
  interface WorkPaths {
    rootPath: string
    adminPath: string
    zappPath: string
    [key: string]: string
  }
  interface NpmPaths {
    [key: string]: string
  }
  interface Sites {
    [key: string]: string
  }

  type token = string
  type workPaths = WorkPaths
}
