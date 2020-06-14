import * as tools from './tools'
import { store } from './store'
import * as api from './api'
import { db } from './db'

export async function initMain() {
  return new Promise(async (resolve) => {
    global.__$tools = tools
    global.__$api = api
    global.__$store = store
    global.__$db = db

    resolve()
  })
}
