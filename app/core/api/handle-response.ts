import { Notification, BrowserWindow } from 'electron'
import { createLoginWindow } from '@/electron/login'

/**
 * 发生接口发生错误时的处理
 * 注意这是运行在主进程中的方法,请不要使用 document api
 * @param err
 * @param sendData
 * @param options
 */
export async function errorAction(err: any, sendData: any, options: RequestOptions) {
  const { errorCode, errorDescription } = err
  const { errorType } = options

  $tools.log.error(`[request:${errorCode}] [${errorType}]`, err)

  switch (errorCode) {
    // 无权限打开登录框
    case 401:
      createLoginWindow()
      break

    default:
      const title = `Request Error: [${errorCode}]`
      if (errorType === 'notification') {
        const n = new Notification({
          icon: $tools.APP_ICON,
          title,
          body: errorDescription,
        })
        n.show()
      } else {
        await $tools.createWindow('AlertModal', {
          windowOptions: { modal: true, parent: BrowserWindow.getFocusedWindow() || undefined, title },
          query: {
            type: 'error',
            title,
            errorDescription,
          },
        })
      }
      break
  }
}
