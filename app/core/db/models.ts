/**
 * 定义本地存储模型
 */

/** 开发项目信息 */
export const projects: Projects = {
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
  type ProjectNames = 'admin' | 'zapp' | '小程序'
  type Projects = {
    [key in ProjectNames]: { path: string }
  }
}
