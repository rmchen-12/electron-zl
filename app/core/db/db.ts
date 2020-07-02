import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'
import * as Models from './models'

/**
 * 创建一个 lowdb 本地数据库
 * 参考：https://molunerfinn.com/electron-vue-3/
 * 文档：https://github.com/typicode/lowdb
 */
const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const adapter = new FileSync(path.join(STORE_PATH, '/data.json'))

const _db = Datastore(adapter)
_db._.mixin(LodashId)

/** 初始化模型数据 */
for (const [key, value] of Object.entries(Models)) {
  if (!_db.has(key).value()) {
    _db.set(key, value).write()
  }
}

class Database {
  _db: Datastore.LowdbSync<any>

  constructor() {
    const db = Datastore(adapter)
    db._.mixin(LodashId)

    /** 初始化模型数据 */
    for (const [key, value] of Object.entries(Models)) {
      if (!db.has(key).value()) {
        db.set(key, value).write()
      }
    }
    this._db = db
  }

  get: Get = (modelName = 'token') => {
    return this._db.read().get(modelName).value()
  }

  set: Set = (path = 'token', pathValue = '') => {
    return this._db.read().set(path, pathValue).write()
  }

  del: Del = (path = 'token') => {
    return this._db.read().unset(path).write()
  }
}

export const db = new Database()

/** - interface - split ------------------------------------------------------------------- */

/** 定义get函数重载 */
interface Get {
  (modelName: 'token'): typeof Models['token']
  (modelName: 'sites'): typeof Models['sites']
  (modelName: 'workPaths'): typeof Models['workPaths']
  (modelName: 'npmPaths'): typeof Models['npmPaths']
}

/** 定义set函数重载 */
interface Set {
  (path: 'token', pathValue: string): void & Promise<void>
  (path: 'sites', pathValue: string): void & Promise<void>
  (path: 'npmPaths', pathValue: string): void & Promise<void>
  (path: 'workPaths.rootPath', pathValue: string): void & Promise<void>
  (path: 'workPaths.adminPath', pathValue: string): void & Promise<void>
  (path: 'workPaths.zappPath', pathValue: string): void & Promise<void>
  (path: string, pathValue: string): void & Promise<void>
}

interface Del {
  (path: string): (false & Promise<boolean>) | (true & Promise<boolean>)
}
