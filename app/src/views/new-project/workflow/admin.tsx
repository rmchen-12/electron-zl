import React from 'react'
import { remote } from 'electron'
import { Input, Timeline, Radio, Select, Form } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio'
import { ValidateStatus } from 'antd/lib/form/FormItem'

const { Option } = Select
const { dialog } = remote
const { Item } = Form

declare interface AdminFlowProps {
  functionDirs: string[]
  microDirs: string[]
  microFunctionsDirs: string[]
}

declare interface AdminFlowState {
  btnLoading: boolean
  templateType: 'micro' | 'normal'
  withNamespace: 'y' | 'n'
  microApp: string
  microIsExist: 'y' | 'n'
  nameValidateStatus: ValidateStatus
  nameHelp: string
  microNameValidateStatus: ValidateStatus
  microNameHelp: string
}

export class AdminFlow extends React.Component<Readonly<AdminFlowProps>, Readonly<AdminFlowState>> {
  readonly state: AdminFlowState = {
    btnLoading: false,
    templateType: 'normal',
    withNamespace: 'y',
    microApp: '',
    microIsExist: 'y',

    nameValidateStatus: '',
    nameHelp: '',
    microNameValidateStatus: '',
    microNameHelp: '',
  }

  componentDidMount() {}

  openDir = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        console.log(canceled, filePaths)
      })
  }

  handleRadioChange = (e: RadioChangeEvent, key: 'templateType' | 'microIsExist' | 'withNamespace') => {
    const { microDirs } = this.props
    if (key === 'templateType') {
      this.setState({ templateType: e.target.value, microApp: microDirs[0] })
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

    if (reg.test(name)) {
      this.setState({ microNameValidateStatus: 'success', microNameHelp: '满足命名格式' })
    } else {
      this.setState({ microNameValidateStatus: 'error', microNameHelp: '满足micro-xxx格式' })
    }

    if (microDirs.includes(name)) {
      this.setState({ microNameValidateStatus: 'error', microNameHelp: '已存在' })
    }
  }

  handleMicroAppChange = (value: string) => this.setState({ microApp: value })

  flowConfig = () => {
    const {
      templateType,
      withNamespace,
      microApp,
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
            <Select value={microApp} style={{ width: 120 }} onChange={this.handleMicroAppChange}>
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
            <Radio value="y">带域空间导航</Radio>
            <Radio value="n">不带域空间导航</Radio>
          </Radio.Group>
        ),
      },
    ]

    return templateType === 'normal' ? [firstStep, ...commonSteps] : [firstStep, ...microSteps, ...commonSteps]
  }

  render() {
    const { btnLoading } = this.state

    return (
      <Timeline mode="alternate">
        {this.flowConfig().map((v, index) => (
          <Timeline.Item color={'blue'} label={v.label} key={index}>
            {v.render}
          </Timeline.Item>
        ))}
      </Timeline>
    )
  }

  submit = () => {}
} // class About end
