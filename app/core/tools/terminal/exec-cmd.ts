import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import { ipcMain } from 'electron'

/**
 * promise化执行cdm命令，返回最后结果
 * @param {string} cmd
 * @param {SpawnOptionsWithoutStdio} options
 * @returns {Promise<string>}
 */
export function execCmd(cmd: string, options: SpawnOptionsWithoutStdio = {}): Promise<string> {
  const [shell, ...args] = cmd.split(' ')

  return new Promise((resolve, reject) => {
    const child = spawn(shell, args, {
      stdio: 'pipe',
      ...options,
      env: process.env,
    })
    let stdout = Buffer.from([])
    let stderr = Buffer.from([])

    child.stdout &&
      child.stdout.on('data', (buf) => {
        stdout = Buffer.concat([stdout, buf])
      })

    child.stderr &&
      child.stderr.on('data', (buf) => {
        stderr = Buffer.concat([stderr, buf])
      })

    child.on('exit', (code) => {
      if (code !== 0) {
        const reason = `${stderr}` || 'unknown error'
        reject(`child process exited with code ${code} due to ${reason}`)
      } else {
        const reason = `${stdout}`
        resolve(`${reason}`)
      }
    })

    child.on('error', (err) => {
      reject(`child process exited due to ${err}`)
    })
  })
}
