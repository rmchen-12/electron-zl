import React from 'react'
import { Tooltip } from 'antd'
import { ipcRenderer } from 'electron'
import { withStore } from '@/src/components/with-store'
import $c from 'classnames'

import AppSideMenus from './side-menus.json'
import './app-sidebar.less'

interface SideMenuItem {
  key: string
  href: string
  title: string
  icon: string
}

interface SidebarProps extends StoreProps {
  user: StoreStates['user']
}

interface State {
  activeMenuKey: string
  hover: boolean
}

class AppSidebar1 extends React.Component<SidebarProps, State> {
  readonly state: State = {
    activeMenuKey: AppSideMenus[0]?.key,
    hover: false,
  }

  componentDidMount() {
    window.addEventListener('router_update', (e: any) => {
      const routeProps: PageProps = e.detail
      this.setState({ activeMenuKey: routeProps.name })
    })
  }

  gitLabLogin = () => {
    ipcRenderer.send('gitLab-login', { url: $tools.APP_CALLBACK })
  }

  render() {
    const { user } = this.props
    const { hover } = this.state
    return (
      <div className="app-sidebar flex column between">
        <div className="mt-24 flex  center app-sidebar-header">
          {/* <img width="40" src={$tools.APP_ICON} /> */}
          {user.avatar ? (
            <img src={user.avatar} className={'side-avatar'} onClick={this.gitLabLogin} />
          ) : (
            <Tooltip overlayClassName="side-menu-item-tooltip" placement="right" title={'点击登录'}>
              <i className="ri-gitlab-fill fs-30 text-error" onClick={this.gitLabLogin}></i>
            </Tooltip>
          )}
        </div>

        <div className="flex flex-1 column side-menu">{AppSideMenus.map(this.renderMenuItem)}</div>

        <div className="mb-24 flex center">
          <Tooltip overlayClassName="side-menu-item-tooltip" placement="right" title={'退出登录'}>
            <i
              onMouseEnter={this.hoverLogout}
              onMouseLeave={this.leaveLogout}
              onClick={this.logout}
              className={$c({
                'side-logout': 1,
                'fs-26': 1,
                'ri-logout-circle-line': !hover,
                'ri-logout-circle-fill': hover,
                'text-error': hover,
              })}
            ></i>
          </Tooltip>
        </div>
      </div>
    )
  }

  hoverLogout = () => {
    this.setState({ hover: true })
  }

  leaveLogout = () => {
    this.setState({ hover: false })
  }

  logout = () => {
    $db.read().set('token', '').write()
    this.props.dispatch({ type: 'ACTION_CLEAR_USER', data: {} })
  }

  renderMenuItem = ({ key, icon, title, href }: SideMenuItem) => {
    const { activeMenuKey } = this.state
    const isActive = activeMenuKey === key

    return (
      <Tooltip key={key} overlayClassName="side-menu-item-tooltip" placement="right" title={title}>
        <a
          className={`side-menu-item fs-24 ri-${icon}-${isActive ? 'fill' : 'line'}`}
          style={{ color: isActive ? '#fff' : '' }}
          href={href}
        ></a>
      </Tooltip>
    )
  }
} // class AppSidebar end

export const AppSidebar = withStore(['user'])(AppSidebar1)
