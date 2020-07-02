import React, { Component } from 'react'
import { remote, ipcRenderer } from 'electron'
import { Modal, Form, Input, Button, Radio, message } from 'antd'
import { FormInstance } from 'antd/lib/form'
import globby from 'globby'

const { dialog } = remote
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

declare interface NormalModalProps {
  visible: boolean
  hideModal: () => void
}

declare interface NormalModalState {
  currentWorkPath: string
  functionDirs: string[]
}

export class NormalModal extends Component<NormalModalProps, NormalModalState> {
  formRef = React.createRef<FormInstance>()

  readonly state: NormalModalState = {
    currentWorkPath: $db.get('workPaths').adminPath || '',
    functionDirs: [''],
  }

  componentDidUpdate(prevProps: NormalModalProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.getAdminDirs()
    }
  }

  render() {
    const { visible, hideModal } = this.props
    const { currentWorkPath, functionDirs } = this.state

    return (
      <Modal title="新建" centered visible={visible} onOk={this.handleOk} onCancel={hideModal}>
        <Form {...layout} name="basic" initialValues={{ remember: true }} ref={this.formRef}>
          <Form.Item label="工作目录" name="workPath">
            <Button type="text" onClick={this.selectPath}>
              {currentWorkPath}
            </Button>
          </Form.Item>
          <Form.Item
            label="模块名称"
            name="projectName"
            rules={[
              { pattern: /.+\-.+/gi, required: true, message: 'Please input your projectName!' },
              () => ({
                validator(rule, value) {
                  if (!value || !functionDirs.includes(value)) {
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

    this.setState({ functionDirs })
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
      const { projectName, withNS } = values
      ipcRenderer.send('create-admin-project', { name: projectName, withNS, path: currentWorkPath })
      hideModal()
    })
  }
}
