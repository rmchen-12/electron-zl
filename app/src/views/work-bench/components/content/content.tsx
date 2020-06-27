import React, { Component } from 'react'
import { remote } from 'electron'
import { Card, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import keys from 'lodash/keys'
import values from 'lodash/values'
import globby from 'globby'
import './content.less'

const { dialog } = remote

interface MainContentState {
  projectPaths: object[]
}

export class MainContent extends Component<{}, MainContentState> {
  private resolvePath = (path: string) => {
    const arr = path.split('/')
    const projectName = arr[arr.length - 1]
    return { [projectName]: path }
  }
  private workPaths = () => {
    const projectPaths = []
    const workPathModel = $db.get('workPath')
    for (const [key, value] of Object.entries(workPathModel)) {
      if (key === 'rootPath') continue
      const pathObj = this.resolvePath(value)
      projectPaths.push(pathObj)
    }
    return projectPaths
  }

  readonly state: MainContentState = {
    projectPaths: this.workPaths() || [{}],
  }

  componentDidMount() {
    this.getWorkPathProjects()
  }

  render() {
    const { projectPaths } = this.state
    console.log(projectPaths)

    return (
      <div className="work-bench-content p-16">
        <Card title="项目管理">
          {projectPaths.map((project, index) => (
            <Card.Grid hoverable style={{ width: '25%', textAlign: 'center' }} key={index}>
              <div onClick={this.openWithVSCode.bind(this, values(project)[0])}>{keys(project)[0]}</div>
            </Card.Grid>
          ))}
          <Card.Grid hoverable style={{ width: '25%', textAlign: 'center' }}>
            <span onClick={this.selectPath}>
              <PlusOutlined></PlusOutlined> ╰(‵□′)╯
            </span>
          </Card.Grid>
        </Card>
      </div>
    )
  }

  openWithVSCode = async (path: string) => {
    await $tools.execCmd(`code ${path}`)
  }

  selectPath = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          if (values($db.get('workPath')).includes(filePaths[0])) {
            message.error('该项目已存在')
            return
          }
          const pathObj = this.resolvePath(filePaths[0])
          const projectPaths = [...this.state.projectPaths, pathObj]
          this.setState({ projectPaths })
          $db.set(`workPath.${keys(pathObj)[0]}`, filePaths[0])
        }
      })
  }

  getWorkPathProjects = async () => {
    const rootPath = $db.get('workPath').rootPath
    const rootPathDirs = await globby('*', {
      cwd: rootPath,
      onlyDirectories: true,
      unique: true,
    })
    let index = rootPathDirs.length - 1
    const rootPathProjects = []
    while (index >= 0) {
      const projectName = rootPathDirs[index]
      const path = `${rootPath}/${projectName}`
      $db.set(projectName, path)
      rootPathProjects.push({ [projectName]: path })
      index--
    }
    this.setState({ projectPaths: [...this.state.projectPaths, ...rootPathProjects] })
  }
}
