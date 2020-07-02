import React, { Component } from 'react'
import { remote, ipcRenderer } from 'electron'
import { Modal, Form, Input, Button, Radio, Select, message } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { RadioChangeEvent } from 'antd/lib/radio'
import globby from 'globby'

const { dialog } = remote
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

declare interface MicroModalProps {
  visible: boolean
  hideModal: () => void
}

declare interface MicroModalState {
  functionDirs: string[]
  microDirs: string[]
  microFunctionsDirs: string[]
  currentWorkPath: string
  isExist: boolean
}

export class MicroModal extends Component<MicroModalProps, MicroModalState> {
  formRef = React.createRef<FormInstance>()

  readonly state: MicroModalState = {
    currentWorkPath: $db.get('workPaths').adminPath || '',
    isExist: true,
    functionDirs: [''],
    microDirs: [''],
    microFunctionsDirs: [''],
  }

  componentDidUpdate(prevProps: MicroModalProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.getAdminDirs()
    }
  }

  render() {
    const { visible, hideModal } = this.props
    const { currentWorkPath, isExist, microDirs, microFunctionsDirs, functionDirs } = this.state

    return (
      <Modal title="新建" centered visible={visible} onOk={this.handleOk} onCancel={hideModal}>
        <Form {...layout} name="basic" initialValues={{ remember: true }} ref={this.formRef}>
          <Form.Item label="工作目录" name="workPath">
            <Button type="text" onClick={this.selectPath}>
              {currentWorkPath}
            </Button>
          </Form.Item>
          <Form.Item label="是否已经存在" name="exist" initialValue={Number(isExist)}>
            <Radio.Group onChange={this.onExistChange}>
              <Radio value={1}>已经存在</Radio>
              <Radio value={0}>新建一个</Radio>
            </Radio.Group>
          </Form.Item>
          {isExist ? (
            <Form.Item
              label="选择micro项目"
              name="microName"
              rules={[{ required: true, message: 'Please select your project!' }]}
            >
              <Select placeholder="选择一个micro项目">
                {microDirs.map((dir) => (
                  <Select.Option value={dir} key={dir}>
                    {dir}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              label="新建micro项目"
              name="microName"
              rules={[
                {
                  pattern: /^micro\-.+/gi,
                  required: true,
                  message: '比如：micro-whooo，以micro开头的命名',
                },
                () => ({
                  validator(rule, value) {
                    if (!value || !microDirs.includes(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject('该模块已存在')
                  },
                }),
              ]}
            >
              <Input placeholder="取个名字吧，以micro-开头"></Input>
            </Form.Item>
          )}
          <Form.Item
            label="模块名称"
            name="projectName"
            rules={[
              { pattern: /.+\-.+/gi, required: true, message: '比如：hello-world, 以中横线隔开' },
              () => ({
                validator(rule, value) {
                  if (!value || !microFunctionsDirs.map((v) => v.split('/')[1]).includes(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject('该模块已存在')
                },
              }),
            ]}
          >
            <Input placeholder="取个名字吧，如'hello-world'" />
          </Form.Item>
          <Form.Item label="域空间导航" name="withNS" initialValue="1">
            <Radio.Group>
              <Radio value="1">有</Radio>
              <Radio value="2">没有</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  getAdminDirs = async () => {
    const { currentWorkPath } = this.state
    const functionsPath = `${currentWorkPath}/src/functions`

    if (!currentWorkPath.endsWith('ehome-admin/admin')) {
      return message.error('当前路径不准确，请选择admin目录')
    }

    $db.set('workPaths.adminPath', currentWorkPath)
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

  selectPath = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          this.setState({ currentWorkPath: filePaths[0] }, this.getAdminDirs)
        }
      })
  }

  handleOk = () => {
    const { hideModal } = this.props
    const { currentWorkPath } = this.state
    this.formRef.current?.validateFields().then((values) => {
      const { projectName, withNS, microName } = values
      ipcRenderer.send('create-admin-project', { name: projectName, withNS, microName, path: currentWorkPath })
      hideModal()
    })
  }

  onExistChange = (e: RadioChangeEvent) => {
    this.setState({ isExist: e.target.value })
  }
}
