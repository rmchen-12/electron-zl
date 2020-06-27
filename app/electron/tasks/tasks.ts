/**
 * 任务操作可以放在这里，在ipc.ts文件中组合调用
 * 两种模式，只需要结果的用execCmd，需要实时输出日志的execCmdWithNotify
 *  - $tools.execCmdWithNotify
 *    监听buffer流，自动实时输出日志，不需要手动控制，需要监听emitter来关闭terminal
 *  - $tools.execCmd
 *    手动输出日志
 */

import to from 'await-to-js'
import { git } from './git'
import { BrowserWindow } from 'electron'

let win: BrowserWindow | undefined

// 窗口启动有延时，不能及时拿到当前 browserWindow 对象
type Timer = NodeJS.Timeout | null
let timer: Timer = setTimeout(() => {
  timer && clearTimeout(timer)
  timer = null
  win = $tools.windowList.get('Home')
}, 5000)

/** 打印文本 */
export const echo = async (log: string) => {
  const [error, string] = await to($tools.execCmd(`echo ${log}`))
  win?.webContents.send('terminal-log', error || string)
}

/** 删除文件 */
export const rm = async (path: string) => {
  const [error, string] = await to($tools.execCmd(`rm -rf ${path}`))
  win?.webContents.send('terminal-log', error || string)
}

/** 在vscode中打开 */
export const openWithVSCode = async (path: string) => {
  const [error, string] = await to($tools.execCmd(`code ${path}`))
  win?.webContents.send('terminal-log', error || string)
}

/** 安装依赖 */
export const install = async (path: string, packageName?: string, where: 'S' | 'D' = 'S') => {
  const cmd = packageName ? `cnpm i ${packageName} -${where}` : 'cnpm i'
  $tools.execCmdWithNotify(cmd, { cwd: path })
}

/** 创建admin项目 */
export const createAdminProject = async ({ name, withNS, microName, path }: CreateAdminProjectArgs) => {
  const baseArgs = [`${path}/scripts/cli.js`, 'genModule', '-n', name, '-t', withNS]
  const args = !!microName ? [...baseArgs, '-m', microName] : baseArgs
  $tools.execCmdWithNotify(`node ${args.join(' ')}`)
}

/** 以模板创建项目 */
export const createTemplateProject = async ({ projectName, repoUrl, path }: CreateTemplateProjectArgs) => {
  const [err, string] = await to(git.clone(repoUrl, path, projectName))
  win?.webContents.send('terminal-log', err || string)
}
