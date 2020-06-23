import * as React from 'react'
import { ipcRenderer } from 'electron'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { withStore } from '@/src/components/with-store'

import { AppRouter, AppLayout } from '@/src/components'
import routes from './auto-routes'

interface AppProps extends StoreProps {
  createConfig: CreateConfig
}

class App extends React.Component<AppProps> {
  componentDidMount() {
    this.getUserInfo()
    ipcRenderer.on('gitLab-login-replay', (e, arg) => {
      this.getUserInfo()
    })
    ipcRenderer.on('ping', (e, arg) => {
      $tools.log.error(123)
      // this.getUserInfo()
    })
  }

  getUserInfo = () => {
    $api.getUserInfo({}, { method: 'GET' }).then((res) => {
      this.props.dispatch({ type: 'ACTION_ADD_USER', data: res.response })
    })
  }

  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <AppLayout createConfig={this.props.createConfig}>
          <AppRouter routes={routes} />
        </AppLayout>
      </ConfigProvider>
    )
  }
}

export default withStore(['user'])(App)
