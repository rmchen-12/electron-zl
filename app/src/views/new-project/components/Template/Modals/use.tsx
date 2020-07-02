import React, { Component } from 'react'
import { remote, ipcRenderer } from 'electron'
import { Modal, Form, Input, Button } from 'antd'
import { FormInstance } from 'antd/lib/form'

const { dialog } = remote
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

declare interface UseModalProps {
  visible: boolean
  hideModal: () => void
  repoUrl: string
}

declare interface UseModalState {
  currentWorkPath: string
  functionDirs: string[]
}

export class UseModal extends Component<UseModalProps, UseModalState> {
  formRef = React.createRef<FormInstance>()

  readonly state: UseModalState = {
    currentWorkPath: $db.get('workPaths').rootPath || '',
    functionDirs: [''],
  }

  render() {
    const { visible, hideModal } = this.props
    const { currentWorkPath } = this.state

    return (
      <Modal title="新建" centered visible={visible} onOk={this.handleOk} onCancel={hideModal}>
        <Form {...layout} name="basic" initialValues={{ remember: true }} ref={this.formRef}>
          <Form.Item label="工作目录" name="workPath">
            <Button type="text" onClick={this.selectPath}>
              {currentWorkPath}
            </Button>
          </Form.Item>
          <Form.Item
            label="项目名称"
            name="projectName"
            rules={[{ required: true, message: 'Please input your projectName!' }]}
          >
            <Input placeholder="取个名字吧，如'hello-world'" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  selectPath = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          this.setState({ currentWorkPath: filePaths[0] })
        }
      })
  }

  handleOk = () => {
    const { hideModal, repoUrl } = this.props
    const { currentWorkPath } = this.state
    this.formRef.current?.validateFields().then((values) => {
      const { projectName } = values
      ipcRenderer.send('create-template-project', { path: currentWorkPath, repoUrl, projectName })
      hideModal()
    })
  }
}
