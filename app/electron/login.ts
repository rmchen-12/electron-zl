import { ipcMain, BrowserWindow, shell, session } from 'electron'

/** 处理登录逻辑 */
ipcMain.on('gitLab-login', (event, data) => {
  const url = data.url || $tools.APP_CALLBACK
  const callbackURL = `${url}callback*`

  const loginWindow = createLoginWindow(url)

  // 读取到token后存储数据，并关闭窗口
  session.defaultSession.webRequest.onCompleted({ urls: [callbackURL] }, (details) => {
    if (details.responseHeaders) {
      const token: string[] = details.responseHeaders.token
      $db.set('token', token[0])
      event.sender.send('gitLab-login-replay', token)
      loginWindow.close()
    } else {
      $tools.log.error('请求出错')
    }
  })

  // 应用卸载前清空事件防止泄露
  window.addEventListener('beforeunload', function () {
    session.defaultSession.webRequest.onCompleted({ urls: [callbackURL] }, null)
  })
})

export const createLoginWindow = (url: string = $tools.APP_CALLBACK) => {
  const callbackURL = `${url}callback*`
  const loginWindow = new BrowserWindow({
    width: 750,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      devTools: true,
    },
  })

  loginWindow.setMenu(null)
  loginWindow.loadURL(url)

  loginWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // 读取到token后存储数据，并关闭窗口
  session.defaultSession.webRequest.onCompleted({ urls: [callbackURL] }, (details) => {
    if (details.responseHeaders) {
      const token: string[] = details.responseHeaders.token
      $db.set('token', token[0])
      loginWindow.webContents.send('gitLab-login-replay', token)
      loginWindow.close()
    } else {
      $tools.log.error('请求出错')
    }
  })
  return loginWindow
}
