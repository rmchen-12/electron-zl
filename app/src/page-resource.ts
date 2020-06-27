/**
 * 页面资源集合，请不要在主进程中引用
 */

// 设为 undefined 将不会创建路由，一般用于重定向页面
export const Home = undefined

export const WorkBench = import('./views/work-bench/work-bench')
export const LogViewer = import('./views/log-viewer/log-viewer')
export const About = import('./views/about/about')
export const NpmAuth = import('./views/npm-auth/npm-auth')
export const Site = import('./views/site/site')
export const NewProject = import('./views/new-project/new-project')
export const Administrator = import('./views/administrator/administrator')

export const NoMatch = import('./views/no-match/no-match')

// 同步引用，注意这不会出发 beforeRouter
export { default as AlertModal } from './views/modals/alert-modal'
