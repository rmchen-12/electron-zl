import React from 'react'
import { remote } from 'electron'
import { Button, Space, PageHeader, Card, List, Row, Col, Divider } from 'antd'
import globby from 'globby'

import './new-project.less'

import { AdminFlow } from './workflow'
import { ZappFlow } from './workflow/zapp'

const { dialog } = remote

declare interface NewProjectState {
  btnLoading: boolean
  end: ProjectNames
  projects: Projects
  functionDirs: string[]
  microDirs: string[]
  microFunctionsDirs: string[]
}

export default class NewProject extends React.Component<PageProps, Readonly<NewProjectState>> {
  readonly state: NewProjectState = {
    btnLoading: false,
    end: 'admin',
    projects: { admin: { path: '' }, zapp: { path: '' }, 小程序: { path: '' } },
    functionDirs: [''],
    microDirs: [''],
    microFunctionsDirs: [''],
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
    const { btnLoading, functionDirs, microDirs, microFunctionsDirs, projects } = this.state
    console.log(this.state)

    return (
      <div className="new-project">
        <PageHeader
          ghost={false}
          title="新建项目"
          extra={
            <Space>
              <Button onClick={this.reset}>重置</Button>
              <Button type="primary" onClick={this.submit} loading={btnLoading} disabled={false}>
                确定
              </Button>
            </Space>
          }
        />

        <Card bordered={false}>
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={Object.entries(projects)}
            renderItem={([name, { path }]) => (
              <List.Item
                actions={[
                  <a onClick={() => this.openDir(name as ProjectNames)} key="1">
                    选择工作目录
                  </a>,
                ]}
              >
                <div>{name}</div>
                <div>{path === '' ? '还未设置工作目录' : path}</div>
              </List.Item>
            )}
          />
        </Card>

        <div className="mt-20">
          <Row>
            <Col span="7">
              <ZappFlow></ZappFlow>
            </Col>
            <Col span="1">
              <Divider type="vertical" style={{ height: '100%' }}></Divider>
            </Col>
            <Col span="8">
              <AdminFlow
                functionDirs={functionDirs}
                microDirs={microDirs}
                microFunctionsDirs={microFunctionsDirs}
              ></AdminFlow>
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
    this.setState({ projects }, this.readAdminDir)
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

  readAdminDir = async () => {
    const { path } = this.state.projects.admin
    console.log(path)

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
