/**
 * 定义本地存储模型
 */

/** 授权token */
export const token = ''

/** 开发项目信息 */
export const projects = {
  admin: {
    path: '',
  },
  zapp: {
    path: '',
  },
  小程序: {
    path: '',
  },
}

/** - interface - split ------------------------------------------------------------------- */

declare global {
  type token = string

  type ProjectNames = keyof typeof projects
  type Projects = {
    [key in ProjectNames]: { path: string }
  }
}
