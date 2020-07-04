/**
 * electron-builder configuration
 * https://www.electron.build/configuration/configuration
 */

import path from 'path'
import { Configuration, CliOptions, Platform } from 'electron-builder'
import devConfig from './dev.config'
import { platform } from 'os'

const ICON_ICO = path.resolve(__dirname, '../assets/app-icon/icon/icon.ico')
const ICON_ICNS = path.resolve(__dirname, '../assets/app-icon/icon/icon.icns')

const {
  npm_package_name: productName,
  npm_package_buildVersion: buildVersion,
  npm_package_appId: appId,
  npm_package_version: version,
  API_PROTOCOL,
  API_HOST,
} = process.env

const config: Configuration = {
  productName,
  buildVersion,
  appId,
  files: ['dist', 'assets', 'package.json'],
  asar: false,
  directories: {
    buildResources: 'assets',
    output: path.join(devConfig.release, `${productName}-release-${version}.${buildVersion}`),
  },
  publish: [
    {
      provider: 'generic',
      url: API_PROTOCOL + API_HOST + '/download', //更新服务器地址,可为空
    },
  ],
  win: {
    icon: ICON_ICO,
    target: ['nsis', 'msi'],
  },
  mac: {
    icon: ICON_ICNS,
  },
  dmg: {
    icon: ICON_ICNS,
    contents: [
      { x: 130, y: 220 },
      { x: 410, y: 220, type: 'link', path: '/Applications' },
    ],
  },
  linux: {
    icon: ICON_ICNS,
    target: ['deb', 'rpm', 'AppImage'],
    category: 'Development',
  },
}

const packageConfig: CliOptions = {
  //   targets: Platform.WINDOWS.createTarget(),
  config,
}

export default packageConfig
