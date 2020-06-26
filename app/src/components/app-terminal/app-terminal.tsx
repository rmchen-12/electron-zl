import React from 'react'
import { ipcRenderer } from 'electron'
import { XTerm } from 'xterm-for-react'
import { FitAddon } from 'xterm-addon-fit'

import './app-terminal.less'

interface AppTerminalState {
  visible: boolean
}

const FitAddonPlugin = new FitAddon()

export class AppTerminal extends React.Component<{}, AppTerminalState> {
  private xtermRef = React.createRef<XTerm>()
  private timer: NodeJS.Timeout | null = null
  private duration = 6000

  readonly state: AppTerminalState = {
    visible: false,
  }

  componentDidMount() {
    const terminal = this.xtermRef.current?.terminal
    ipcRenderer.on('terminal-log', (e, string) => {
      // xterm中处理\n有问题，所以分段打印
      const strArr = string.replace(/\n/g, '!!@@##').split('!!@@##')
      strArr.forEach((str: string) => {
        terminal?.writeln(str)
      })
    })
    ipcRenderer.on('terminal-open', () => {
      this.setState({ visible: true })
    })
    ipcRenderer.on('terminal-close', (e, timer?: number) => {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer as NodeJS.Timeout)
        this.timer = null
        this.setState({ visible: false })
        terminal?.clear()
      }, timer || this.duration)
    })
  }

  componentWillUnmount() {
    clearTimeout(this.timer as NodeJS.Timeout)
    this.timer = null
  }

  render() {
    const { visible } = this.state

    return (
      <div className={`app-terminal ${visible ? 'terminal_visible' : 'terminal_hide'}`}>
        <XTerm
          className="app-terminal-tty"
          ref={this.xtermRef}
          options={{ fontSize: 12 }}
          addons={[FitAddonPlugin]}
        />
        <div>
          <i className="ri-close-line fs-40" onClick={this.close}></i>
        </div>
      </div>
    )
  }

  close = () => {
    this.setState({ visible: false })
    this.timer && clearTimeout(this.timer)
    this.xtermRef.current?.terminal.dispose()
  }
} // class AppTerminal end
