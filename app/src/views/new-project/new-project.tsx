import React from 'react'
import { remote } from 'electron'
import { Button, Timeline, Space, PageHeader, Select } from 'antd'

import './new-project.less'

const { Option } = Select

export default class NewProject extends React.Component<PageProps> {
  state = { btnLoading: false, end: 'pc', tpl: 'micro', step: 1 }

  componentDidMount() {}

  openDir = () => {
    remote.dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        console.log(canceled, filePaths)
      })
  }

  lineConfig = () => {
    const { end, tpl, step } = this.state
    const step1 = [
      {
        done: true,
        label: '选择用户端',
        render: (
          <Select value={end} style={{ width: 120 }} onChange={this.handleEndChange}>
            <Option value="pc">PC端</Option>
            <Option value="mobile">移动端</Option>
            <Option value="mini">小程序</Option>
          </Select>
        ),
      },
    ]
    const step2 = {
      pc: {
        done: true,
        label: '选择模板类型',
        render: (
          <Select value={tpl} style={{ width: 120 }} onChange={this.handleTplChange}>
            <Option value="micro">micro项目</Option>
            <Option value="single">独立项目</Option>
          </Select>
        ),
      },
      mobile: {
        done: true,
        label: '选择模板类型',
        render: (
          <Select value={tpl} style={{ width: 120 }} onChange={this.handleTplChange}>
            <Option value="class">class语法</Option>
            <Option value="hooks">hooks语法</Option>
          </Select>
        ),
      },
      mini: {
        done: true,
        label: '选择模板类型',
        render: (
          <Select value={tpl} style={{ width: 120 }} onChange={this.handleTplChange}>
            <Option value="class">class语法</Option>
            <Option value="hooks">hooks语法</Option>
          </Select>
        ),
      },
    }

    return [...step1, step2[end]]
  }

  render() {
    const { btnLoading, step } = this.state

    return (
      <div className="new-project" style={{ height: '100%' }}>
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
        <div className="p-20">
          <Button onClick={this.openDir}>选择创建目录</Button>
          <Timeline mode="alternate">
            {this.lineConfig()
              .slice(0, step)
              .map((v, index) => (
                <Timeline.Item color={v.done ? 'blue' : 'gray'} label={v.label} key={index}>
                  {v.render}
                </Timeline.Item>
              ))}
          </Timeline>
        </div>
      </div>
    )
  }

  reset = () => this.setState({ end: 'pc', tpl: 'micro', step: 1 })
  submit = () => {}

  handleEndChange = (value: string) => {
    this.setState({ end: value, step: 2 })
  }

  handleTplChange = (value: string) => {
    this.setState({ tpl: value })
  }
} // class About end
