import React from 'react'
import { Button, Timeline, Select, message, Form, Input } from 'antd'
import { ValidateStatus } from 'antd/lib/form/FormItem'
import execa from 'execa'
import { padEnd } from 'lodash'

const { Option } = Select
const { Item } = Form

declare interface ZAppFlowProps {
  path: string
  zappDirs: string[]
}

declare interface ZAppFlowState {
  /** 模块名 */
  name: string
  /** 模板类型 */
  templateType: 'normal' | 'hooks'

  btnText: '继续创建' | '开始创建'
  color: 'blue' | 'green'
  pending: string
  nameValidateStatus: ValidateStatus
  nameHelp: string
}

export class ZAppFlow extends React.Component<Readonly<ZAppFlowProps>, Readonly<ZAppFlowState>> {
  readonly state: ZAppFlowState = {
    name: '',
    btnText: '开始创建',
    color: 'blue',
    pending: '',
    templateType: 'hooks',
    nameValidateStatus: '',
    nameHelp: '',
  }

  flowConfig = () => {
    const { templateType, nameValidateStatus, nameHelp, name } = this.state

    const steps = [
      {
        done: true,
        label: '选择模板类型',
        render: (
          <Select value={templateType} style={{ width: 120 }} onChange={this.handleTplChange}>
            <Option value="normal">模板1</Option>
            <Option value="hooks">hooks</Option>
          </Select>
        ),
      },
      {
        label: '取个名字吧',
        render: (
          <Item validateStatus={nameValidateStatus} help={nameHelp} hasFeedback>
            <Input value={name} onChange={this.handleNameChange} placeholder="比如“hello-word”"></Input>
          </Item>
        ),
      },
    ]

    return steps
  }

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const { zappDirs } = this.props
    const reg = /.+/g

    this.setState({ name })
    if (reg.test(name)) {
      this.setState({ nameValidateStatus: 'success', nameHelp: '命名可用' })
    } else {
      this.setState({ nameValidateStatus: 'error', nameHelp: '命名不规范' })
    }

    if (zappDirs.includes(name)) {
      this.setState({ nameValidateStatus: 'error', nameHelp: '已存在' })
    }
  }

  startCreate = () => {
    const { btnText } = this.state
    if (btnText === '继续创建') {
      return this.continue()
    }
    if (btnText === '开始创建') {
      return this.create()
    }
  }

  handleTplChange = (value: 'normal' | 'hooks') => this.setState({ templateType: value })

  render() {
    const { btnText, color, pending } = this.state

    return (
      <>
        <Timeline mode="alternate" pending={pending}>
          {this.flowConfig().map((v, index) => (
            <Timeline.Item color={color} label={v.label} key={index}>
              {v.render}
            </Timeline.Item>
          ))}
        </Timeline>
        <div className="flex center-h">
          <Button type="primary" style={{ marginTop: 16 }} onClick={this.startCreate}>
            {btnText}
          </Button>
        </div>
      </>
    )
  }

  validate = () => {
    const { name } = this.state
    if (name === '') {
      return '完善信息'
    }
  }

  create = () => {
    const { name } = this.state
    const { path } = this.props
    const errorMsg = this.validate()
    if (errorMsg) return message.error(errorMsg)

    const args = [
      'clone',
      '--depth',
      '1',
      '--single-branch',
      'http://10.1.1.217/eh-front-end/ehome-template-hooks.git',
      `${path}/${name}`,
    ]

    const args1 = ['-rf', `${path}/${name}/.git`]

    this.setState({ pending: '正在创建' }, async () => {
      try {
        await execa('git', args)
        await execa('rm', args1)
        this.setState({ pending: '', color: 'green', btnText: '继续创建' })
        message.success('创建成功')
        $tools.log.info(`create zapp项目：${name} success!`)
      } catch (error) {
        $tools.log.error(error)
      }
    })
  }

  continue = () => {
    this.setState({
      name: '',
      btnText: '开始创建',
      color: 'blue',
      pending: '',
      templateType: 'hooks',
      nameValidateStatus: '',
      nameHelp: '',
    })
  }
} // class About end
