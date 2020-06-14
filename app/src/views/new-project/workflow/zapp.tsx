import React from 'react'
import { remote } from 'electron'
import { Button, Timeline, Space, PageHeader, Select } from 'antd'

const { Option } = Select
const { dialog } = remote

export class ZappFlow extends React.Component<PageProps> {
  state = { btnLoading: false, tpl: 'micro', step: 1 }

  componentDidMount() {}

  openDir = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        console.log(canceled, filePaths)
      })
  }

  lineConfig = () => {
    const { tpl, step } = this.state

    const step1 = {
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
    }

    return [step1.pc]
  }

  render() {
    const { btnLoading, step } = this.state

    return (
      <Timeline mode="alternate">
        {this.lineConfig().map((v, index) => (
          <Timeline.Item color={'blue'} label={v.label} key={index}>
            <Select value={'micro'} style={{ width: 120 }} onChange={this.handleTplChange}>
              <Option value="micro">micro项目</Option>
              <Option value="single">独立项目</Option>
            </Select>
          </Timeline.Item>
        ))}
      </Timeline>
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
