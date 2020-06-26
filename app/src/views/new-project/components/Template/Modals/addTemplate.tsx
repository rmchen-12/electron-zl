import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'
import { FormInstance } from 'antd/lib/form'

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

declare interface AddTemplateModalProps {
  templateTypeId: number
  user: StoreStates['user']
  visible: boolean
  hideModal: () => void
  queryTemplateType: () => void
  currentTemplate: queryProjectTemplateUsingGET.ProjectTemplate | undefined
  type: 'edit' | 'add'
}

declare interface AddTemplateModalState {}

export class AddTemplateModal extends Component<AddTemplateModalProps, AddTemplateModalState> {
  formRef = React.createRef<FormInstance>()

  readonly state: AddTemplateModalState = {}

  render() {
    const { visible, hideModal, currentTemplate, type } = this.props

    return (
      <Modal
        title={type === 'add' ? '新建模板' : '修改模板'}
        centered
        visible={visible}
        onOk={this.handleOk}
        onCancel={hideModal}
        destroyOnClose
      >
        <Form {...layout} name="basic" ref={this.formRef}>
          <Form.Item
            label="模块名称"
            name="templateName"
            rules={[{ required: true, message: 'Please input your templateName!' }]}
            initialValue={type === 'edit' ? currentTemplate?.templateName : undefined}
          >
            <Input placeholder="取个名字吧，如：’无敌小程序开发模板‘" />
          </Form.Item>
          <Form.Item
            label="gitlab地址"
            name="repoUrl"
            rules={[{ required: true, message: 'Please input your gitlab url!' }]}
            initialValue={type === 'edit' ? currentTemplate?.repoUrl : undefined}
          >
            <Input placeholder="gitLab项目地址" />
          </Form.Item>
          <Form.Item
            label="模块简介"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
            initialValue={type === 'edit' ? currentTemplate?.description : undefined}
          >
            <Input.TextArea placeholder="请输入该模板简单介绍，如：‘超级无敌好用的小程序模板，一键下载，天天喝茶’" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  handleOk = async () => {
    const { hideModal, user, templateTypeId, queryTemplateType, type, currentTemplate } = this.props
    const values = await this.formRef.current?.validateFields()
    const { templateName, repoUrl, description } = values || {}

    if (type === 'edit' && currentTemplate?.id) {
      await $api.updateProjectTemplate(
        currentTemplate.id,
        { repoUrl, templateName, description },
        { method: 'PUT' }
      )
    } else {
      await $api.addProjectTemplate({ templateName, repoUrl, description, ownerId: user.id, templateTypeId })
    }
    hideModal()
    queryTemplateType()
  }
}
