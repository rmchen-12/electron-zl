import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import { EventEmitter } from 'events'

/**
 * 实时输出控制台打印
 * @param {string} cmd
 * @param {SpawnOptionsWithoutStdio} options
 */
export const emitter = new EventEmitter()
export function execCmdWithNotify(cmd: string, options: SpawnOptionsWithoutStdio = {}) {
  const [shell, ...args] = cmd.split(' ')

  const child = spawn(shell, args, {
    stdio: 'pipe',
    ...options,
    env: process.env,
  })

  child.stdout &&
    child.stdout.on('data', (buf) => {
      emitter.emit('data', `${buf}`)
    })

  child.stderr &&
    child.stderr.on('data', (buf) => {
      emitter.emit('data', `${buf}`)
    })

  child.on('exit', (code) => {
    if (code !== 0) {
      emitter.emit('close', new Error(`child process exited with code ${code}`), code)
    } else {
      emitter.emit('close', null)
    }
  })

  child.on('error', (err) => {
    emitter.emit('close', err)
  })
}
