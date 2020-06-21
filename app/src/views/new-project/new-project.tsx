import React from 'react'
import { remote } from 'electron'
import { Space, PageHeader, Row, Col, Divider } from 'antd'
import globby from 'globby'

import './new-project.less'

import { ZAppFlow, AdminFlow } from './workflow'

const { dialog } = remote

declare interface NewProjectState {
  btnLoading: boolean
  end: ProjectNames
  projects: Projects
  functionDirs: string[]
  microDirs: string[]
  microFunctionsDirs: string[]
  zappDirs: string[]
}

export default class NewProject extends React.Component<PageProps, Readonly<NewProjectState>> {
  readonly state: NewProjectState = {
    btnLoading: false,
    end: 'admin',
    projects: { admin: { path: '' }, zapp: { path: '' }, 小程序: { path: '' } },
    functionDirs: [''],
    microDirs: [''],
    microFunctionsDirs: [''],
    zappDirs: [''],
  }

  componentDidMount() {
    this.setProjects()
  }

  openDir = (end: ProjectNames) => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          this.getDb().updateProjects(end, filePaths[0])
        }
      })
  }

  handleEndChange = (value: ProjectNames) => this.setState({ end: value })

  reset = () => this.setState({ end: 'admin' })

  render() {
    const { functionDirs, microDirs, microFunctionsDirs, projects, zappDirs } = this.state

    return (
      <div className="new-project">
        <PageHeader ghost={false} title="新建项目" />

        <div className="mt-20">
          <Row>
            <Col span="7">
              <>
                <Space direction="vertical" className="flex center-v mb-32">
                  zapp
                  <span>
                    {projects.zapp.path === '' ? '还未设置工作目录，选择本地zapp目录' : projects.zapp.path}
                  </span>
                  <a onClick={() => this.openDir('zapp')}>选择工作目录</a>
                </Space>
                <ZAppFlow path={projects.zapp.path} zappDirs={zappDirs}></ZAppFlow>
              </>
            </Col>
            <Col span="1">
              <Divider type="vertical" style={{ height: '100%' }}></Divider>
            </Col>
            <Col span="8">
              <>
                <Space direction="vertical" className="flex center-v mb-32">
                  admin
                  <span>
                    {projects.admin.path === ''
                      ? '还未设置工作目录，选择本地admin目录(注意：是admin,不是ehome-admin)'
                      : projects.admin.path}
                  </span>
                  <a onClick={() => this.openDir('admin')}>选择工作目录</a>
                </Space>
                <AdminFlow
                  path={projects.admin.path}
                  functionDirs={functionDirs}
                  microDirs={microDirs}
                  microFunctionsDirs={microFunctionsDirs}
                ></AdminFlow>
              </>
            </Col>
            <Col span="1">
              <Divider type="vertical" style={{ height: '100%' }}></Divider>
            </Col>
            <Col span="7">小程序</Col>
          </Row>
        </div>
      </div>
    )
  }

  submit = () => {}

  setProjects = () => {
    const projects = this.getDb().projects
    this.setState({ projects }, () => {
      this.readAdminDir()
      this.readZAppDir()
    })
  }

  getDb = () => {
    const modelName = 'projects'
    return {
      projects: $db.read().get(modelName).value(),
      updateProjects: (key: ProjectNames, path: string) => {
        const workPath = `${modelName}.${key}.path`
        $db.read().set(workPath, path).write()
        this.setProjects()
      },
    }
  }

  readZAppDir = async () => {
    const { path } = this.state.projects.zapp
    const zappDirs = await globby('*', {
      cwd: path,
      onlyDirectories: true,
      unique: true,
    })

    this.setState({ zappDirs })
  }

  readAdminDir = async () => {
    const { path } = this.state.projects.admin
    const functionsPath = `${path}/src/functions`
    const functionDirs = await globby('*', {
      cwd: functionsPath,
      onlyDirectories: true,
      unique: true,
    })
    const microDirs = await globby('micro-*', {
      cwd: functionsPath,
      onlyDirectories: true,
      unique: true,
    })
    const microFunctionsDirs = await globby('micro-*/*-*', {
      cwd: functionsPath,
      onlyDirectories: true,
      unique: true,
    })

    this.setState({ functionDirs, microDirs, microFunctionsDirs })
  }
} // class About end
