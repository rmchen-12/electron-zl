/**
 * 定义本地存储模型
 */

/** 授权token */
export const token = ''

/** 开发项目目录 */
export const workPath = {
  rootPath: '',
  adminPath: '',
  zappPath: '',

  /** 其他单个项目路径 */
  // xxx1: '',
  // xxx2: ''
}

/** - interface - split ------------------------------------------------------------------- */

declare global {
  type token = string
  type workPath = typeof workPath
}
