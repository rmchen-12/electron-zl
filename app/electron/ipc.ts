/**
 * 涉及到命令行交互的统一放这里，可以调用终端反馈界面，反馈任务进度
 */

import { ipcMain } from 'electron'
import * as tasks from './tasks'

/** 新建admin项目，自动实时输出日志，不需要手动控制 */
ipcMain.on('create-admin-project', (event, { name, withNS, microName, path }) => {
  event.sender.send('terminal-open')
  tasks.createAdminProject({ name, withNS, microName, path })
  $tools.emitter.on('close', async () => {
    await tasks.openWithVSCode(path)
    event.sender.send('terminal-close')
  })
})

/** 新建模板项目，手动输出日志，需要自己控制窗口的开启关闭和输出 */
ipcMain.on('create-template-project', async (event, { projectName, repoUrl, path }) => {
  const workPath = `${path}/${projectName}/`
  event.sender.send('terminal-open')

  await tasks.echo('git clone start~~~')
  await tasks.createTemplateProject({ projectName, repoUrl, path })
  await tasks.echo('git clone success!')
  await tasks.rm(`${workPath}/.git`)
  //   await tasks.echo('开始安装依赖~~~')
  //   await tasks.install(workPath)

  //   $tools.emitter.on('close', async () => {
  //   await tasks.echo('依赖安装完成')
  await tasks.openWithVSCode(workPath)
  event.sender.send('terminal-close')
  //   })
})

/** - interface - split ------------------------------------------------------------------- */

declare global {
  interface CreateAdminProjectArgs {
    name: string
    withNS: '1' | '2'
    microName: string
    path: string
  }

  interface CreateTemplateProjectArgs {
    repoUrl: string
    projectName: string
    path: string
  }

  namespace Electron {
    interface IpcMain {
      on(
        channel: 'create-admin-project',
        listener: (event: IpcMainEvent, argsObj: CreateAdminProjectArgs) => void
      ): this
      on(
        channel: 'create-template-project',
        listener: (event: IpcMainEvent, argsObj: CreateTemplateProjectArgs) => void
      ): this
    }

    interface IpcRenderer {
      /** 输出控制台日志 */
      on(channel: 'terminal-log', listener: (event: IpcRendererEvent, ...args: any[]) => void): this
      on(channel: 'terminal-open', listener: (event: IpcRendererEvent, ...args: any[]) => void): this
      on(channel: 'terminal-close', listener: (event: IpcRendererEvent, ...args: any[]) => void): this
      send(channel: 'create-admin-project', argsObj: CreateAdminProjectArgs): void
      send(channel: 'create-template-project', argsObj: CreateTemplateProjectArgs): void
    }
  }
}
