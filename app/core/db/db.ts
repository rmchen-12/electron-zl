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

  get(modelName: ModelNames) {
    return this._db.read().get(modelName).value()
  }

  set(modelName: ModelNames | any, pathValue: string) {
    return this._db.read().set(modelName, pathValue).write()
  }
}

export const db = new Database()

/** - interface - split ------------------------------------------------------------------- */
