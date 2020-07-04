import { app, BrowserWindowConstructorOptions } from 'electron'
import { asAssetsPath } from './paths'

/** 应用后端服务地址 */
export const APP_URL = `${process.env.API_PROTOCOL}${process.env.API_HOST}`

/** 应用名称 */
export const APP_NAME = app.name

/** 应用版本 */
export const APP_VERSION = app.getVersion()

/** 应用标题 */
export const APP_TITLE = 'Swim'

/** 应用主图标 (桌面) */
export const APP_ICON = asAssetsPath('app-icon/app-icon@256.png')

/** gitLab登录地址 */
export const APP_CALLBACK = `${APP_URL}/passport/gitlab/`

/** gitLab ehome-admin地址 */
export const GITLAB_EHOME_ADMIN = 'http://10.1.1.217/eh-front-end/ehome-admin/'

/** 应用自动更新地址 */
export const UPDATE_URL = `${APP_URL}/download/`

/** 亮色风格托盘图标 标准尺寸 16*16, 系统会自动载入 @2x 和 @3x */
export const TRAY_ICON_LIGHT = asAssetsPath('tray-icon/tray-icon-light.png')

/** 暗色风格托盘图标 (仅 macOS) */
export const TRAY_ICON_DARK = asAssetsPath('tray-icon/tray-icon-dark.png')

/** 创建新窗口时默认加载的选项 */
export const DEFAULT_WINDOW_OPTIONS: BrowserWindowConstructorOptions = {
  icon: APP_ICON,
  minWidth: 200,
  minHeight: 200,
  width: 800,
  height: 600,
  show: false,
  hasShadow: true,
  webPreferences: {
    nodeIntegration: true,
    scrollBounce: true,
  },
  titleBarStyle: 'hidden', // 隐藏标题栏, 但显示窗口控制按钮
  frame: process.platform === 'darwin' ? true : false, // 无边框窗口
  // frame: false, // 无边框窗口
  // skipTaskbar: false, // 是否在任务栏中隐藏窗口
  // backgroundColor: '#fff',
  // transparent: true, // 窗口是否透明
  // titleBarStyle: 'default',
  // vibrancy: 'selection', // 毛玻璃效果
}

export const DEFAULT_INITIAL_CONFIG: CreateConfig = {
  showSidebar: false,
  showTitlebar: true,
  autoShow: true,
  delayToShow: 10,
  single: true,
}
