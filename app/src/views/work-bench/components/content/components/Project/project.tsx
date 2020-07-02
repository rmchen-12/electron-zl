import React, { Component } from 'react'
import { remote, shell } from 'electron'
import { Card, message } from 'antd'
import { PlusOutlined, CloseCircleOutlined, ChromeOutlined } from '@ant-design/icons'
import { withStore } from '@/src/components/with-store'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import keys from 'lodash/keys'
import values from 'lodash/values'
import isEqual from 'lodash/isEqual'
import execa from 'execa'
import to from 'await-to-js'
import slash from 'slash'
import fs from 'fs-extra'
import './project.less'

const { dialog } = remote

interface MainContentProps extends StoreProps {
  workPaths: StoreStates['workPaths']
}

interface MainContentState {
  projectPaths: object[]
}

class Project1 extends Component<MainContentProps, MainContentState> {
  private resolvePath = (path: string) => {
    const arr = slash(path).split('/')
    const projectName = arr[arr.length - 1]
    return { [projectName]: path }
  }

  private workPaths = () => {
    const projectPaths = []
    const workPathModel = this.props.workPaths

    for (const [key, value] of Object.entries(workPathModel)) {
      if (key === 'rootPath' || value === '') continue
      const pathObj = this.resolvePath(value)
      projectPaths.push(pathObj)
    }

    return projectPaths
  }

  readonly state: MainContentState = {
    projectPaths: this.workPaths() || [{}],
  }

  componentDidUpdate(prevProps: MainContentProps) {
    if (!isEqual(this.props, prevProps)) {
      this.setState({ projectPaths: this.workPaths() })
    }
  }

  render() {
    const { projectPaths } = this.state

    return (
      <Card className="mb-16" title={'项目管理'}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 500: 4, 700: 5, 900: 6 }}>
          <Masonry>
            {projectPaths.map((project, index) => (
              <Card
                style={{ minHeight: 100 }}
                hoverable
                key={index}
                actions={[
                  <CloseCircleOutlined
                    key="delete"
                    onClick={this.deleteProject.bind(this, values(project)[0])}
                  />,
                  <ChromeOutlined key="chrome" onClick={this.openWithWeb.bind(this, values(project)[0])} />,
                ]}
              >
                <div onClick={this.openWithVSCode.bind(this, values(project)[0])}>{keys(project)[0]}</div>
              </Card>
            ))}
            <Card className="flex center" style={{ minHeight: 100 }} hoverable>
              <div className="pointer" onClick={this.add}>
                <PlusOutlined></PlusOutlined> ╰(‵□′)╯
              </div>
            </Card>
          </Masonry>
        </ResponsiveMasonry>
      </Card>
    )
  }

  deleteProject = (path: string) => {
    const pathObj = this.resolvePath(path)
    this.props.dispatch({ type: 'ACTION_DELETE_WORK_PATH', data: Object.keys(pathObj)[0] })
  }

  openWithVSCode = async (path: string) => {
    const [err] = await to(execa('code', [path]))
    if (err) message.error(err)
  }

  openWithWeb = async (path: string) => {
    const text = fs.readFileSync(path + '/.git/config', { encoding: 'utf-8' })

    const reg1 = /(?<=git@)(.+)(?=\.git)/g // ssh 方式下载的仓库
    const reg2 = /(?<=:\/\/)(.+)(?=\.git)/g // http 方式下载的仓库
    const result1 = reg1.exec(text)
    const result2 = reg2.exec(text)

    if (result1) {
      const url = 'http://' + result1[0].replace(':', '/')
      shell.openExternal(url)
    }
    if (result2) {
      const url = 'http://' + result2[0]
      shell.openExternal(url)
    }
  }

  add = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          if (values($db.get('workPaths')).includes(filePaths[0])) {
            message.error('该项目已存在')
            return
          }
          const pathObj = this.resolvePath(filePaths[0])
          const projectPaths = [...this.state.projectPaths, pathObj]
          this.setState({ projectPaths })
          this.props.dispatch({ type: 'ACTION_ADD_WORK_PATHS', data: pathObj })
        }
      })
  }
}

export const Project = withStore(['npmPaths', 'workPaths'])(Project1)
