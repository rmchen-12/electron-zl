import React from 'react'
import { Input, Timeline, Radio, Select, Form, Button, message } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import { ValidateStatus } from 'antd/lib/form/FormItem'
import execa from 'execa'

const { Option } = Select
const { Item } = Form

declare interface AdminFlowProps {
  functionDirs: string[]
  microDirs: string[]
  microFunctionsDirs: string[]
  path: string
}

declare interface AdminFlowState {
  /** 模块名 */
  name: string
  /** micro名 */
  microName: string
  /** 带域空间导航，1 有|2 无 */
  withNamespace: '1' | '2'

  btnText: '继续创建' | '开始创建'
  color: 'blue' | 'green'
  pending: string
  templateType: 'micro' | 'normal'
  microIsExist: 'y' | 'n'
  nameValidateStatus: ValidateStatus
  nameHelp: string
  microNameValidateStatus: ValidateStatus
  microNameHelp: string
}

export class AdminFlow extends React.Component<Readonly<AdminFlowProps>, Readonly<AdminFlowState>> {
  readonly state: AdminFlowState = {
    /** 命令行用到这三个参数 */
    name: '',
    microName: '',
    withNamespace: '1',

    btnText: '开始创建',
    color: 'blue',
    pending: '',
    templateType: 'normal',
    microIsExist: 'y',

    nameValidateStatus: '',
    nameHelp: '',
    microNameValidateStatus: '',
    microNameHelp: '',
  }

  handleRadioChange = (e: RadioChangeEvent, key: 'templateType' | 'microIsExist' | 'withNamespace') => {
    const { microDirs } = this.props
    if (key === 'templateType') {
      this.setState({
        templateType: e.target.value,
        microName: e.target.value === 'micro' ? microDirs[0] : '',
      })
    }
    if (key === 'microIsExist') {
      this.setState({ microIsExist: e.target.value, microNameHelp: '', microNameValidateStatus: '' })
    }
    if (key === 'withNamespace') {
      this.setState({ withNamespace: e.target.value })
    }
  }

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const { functionDirs, microFunctionsDirs } = this.props
    const reg = /.+\-.+/gi

    this.setState({ name })
    if (reg.test(name)) {
      this.setState({ nameValidateStatus: 'success', nameHelp: '满足命名格式' })
    } else {
      this.setState({ nameValidateStatus: 'error', nameHelp: '满足xxx-xxx格式' })
    }

    if (functionDirs.includes(name) || microFunctionsDirs.map((v) => v.split('/')[1]).includes(name)) {
      this.setState({ nameValidateStatus: 'error', nameHelp: '已存在' })
    }
  }

  handleMicroNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const { microDirs } = this.props
    const reg = /^micro\-.+/gi

    this.setState({ microName: name })
    if (reg.test(name)) {
      this.setState({ microNameValidateStatus: 'success', microNameHelp: '满足命名格式' })
    } else {
      this.setState({ microNameValidateStatus: 'error', microNameHelp: '满足micro-xxx格式' })
    }

    if (microDirs.includes(name)) {
      this.setState({ microNameValidateStatus: 'error', microNameHelp: '已存在' })
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

  handleMicroAppChange = (value: string) => this.setState({ microName: value })

  flowConfig = () => {
    const {
      templateType,
      withNamespace,
      microName,
      microIsExist,
      nameValidateStatus,
      nameHelp,
      microNameValidateStatus,
      microNameHelp,
    } = this.state
    const { microDirs } = this.props

    const firstStep = {
      label: '选择模板类型',
      render: (
        <Radio.Group value={templateType} onChange={(e) => this.handleRadioChange(e, 'templateType')}>
          <Radio value="normal">普通</Radio>
          <Radio value="micro">micro</Radio>
        </Radio.Group>
      ),
    }

    const microSteps = [
      {
        label: '是否已存在',
        render: (
          <Radio.Group value={microIsExist} onChange={(e) => this.handleRadioChange(e, 'microIsExist')}>
            <Radio value="y">存在</Radio>
            <Radio value="n">不存在</Radio>
          </Radio.Group>
        ),
      },
      {
        label: microIsExist === 'y' ? '选择micro项目' : '新建micro项目',
        render:
          microIsExist === 'y' ? (
            <Select value={microName} style={{ width: 120 }} onChange={this.handleMicroAppChange}>
              {microDirs.map((v) => (
                <Option value={v} key={v}>
                  {v}
                </Option>
              ))}
            </Select>
          ) : (
            <Item validateStatus={microNameValidateStatus} help={microNameHelp} hasFeedback>
              <Input onChange={this.handleMicroNameChange} placeholder="比如“micro-app”"></Input>
            </Item>
          ),
      },
    ]

    const commonSteps = [
      {
        label: '取个名字吧',
        render: (
          <Item validateStatus={nameValidateStatus} help={nameHelp} hasFeedback>
            <Input onChange={this.handleNameChange} placeholder="比如“hello-word”"></Input>
          </Item>
        ),
      },
      {
        label: '是否带域空间导航',
        render: (
          <Radio.Group value={withNamespace} onChange={(e) => this.handleRadioChange(e, 'withNamespace')}>
            <Radio value="1">带域空间导航</Radio>
            <Radio value="2">不带域空间导航</Radio>
          </Radio.Group>
        ),
      },
    ]

    return templateType === 'normal' ? [firstStep, ...commonSteps] : [firstStep, ...microSteps, ...commonSteps]
  }

  render() {
    const { pending, color, btnText } = this.state

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
    const { name, microName, templateType } = this.state
    if (templateType === 'normal' && name === '') {
      return '完善信息'
    }
    if (templateType === 'micro' && (name === '' || microName === '')) {
      return '完善信息'
    }
  }

  create = () => {
    const { path } = this.props
    const { name, microName, withNamespace } = this.state
    const errorMsg = this.validate()
    if (errorMsg) return message.error(errorMsg)

    // 调用admin项目内的cli脚本，传参创建
    const baseArgs = [`${path}/scripts/cli.js`, 'genModule', '-n', name, '-t', withNamespace]
    const args = microName !== '' ? [...baseArgs, '-m', microName] : baseArgs
    this.setState({ pending: '正在创建' }, async () => {
      const { stdout, stderr } = await execa('node', args)
      $tools.log.error(stderr)
      $tools.log.info(stdout)
      this.setState({ pending: '', color: 'green', btnText: '继续创建' })
      message.success('创建成功')
    })
  }

  continue = () => {
    this.setState({
      name: '',
      microName: '',
      withNamespace: '1',

      btnText: '开始创建',
      color: 'blue',
      pending: '',
      templateType: 'normal',
      microIsExist: 'y',

      nameValidateStatus: '',
      nameHelp: '',
      microNameValidateStatus: '',
      microNameHelp: '',
    })
  }
} // class About end
