import React from 'react'
import { Button } from 'antd'
import { remote } from 'electron'
import AppSideMenus from '@/src/side-menus.json'

import './app-titlebar.less'

const { dialog } = remote

interface State {
  path: string
  rootPath: string
}

export class AppTitlebar extends React.Component<{}, State> {
  state: State = {
    path: '',
    rootPath: $db.get('workPaths').rootPath || '',
  }

  componentDidMount() {
    window.addEventListener('router_update', (e: any) => {
      const routeProps: PageProps = e.detail
      const pathname = routeProps.location.pathname
      //   this.setState({ path: AppSideMenus.filter((menu) => menu.href.slice(1) === pathname)[0].title })
    })
  }

  render() {
    const { path, rootPath } = this.state
    return (
      <header className="pl-16 pr-16 app-titlebar flex center">
        <p>{path}</p>
        <Button type="text" className="app-titlebar-rootPath text-gray" onClick={this.selectPath}>
          工作目录： {rootPath}
        </Button>
      </header>
    )
  }

  selectPath = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          this.setState({ rootPath: filePaths[0] }, this.setRootPath)
        }
      })
  }

  setRootPath = () => $db.set('workPaths.rootPath', this.state.rootPath)
} // class AppTitlebar end
