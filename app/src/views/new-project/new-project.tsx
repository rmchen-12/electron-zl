import React from 'react'
import { remote } from 'electron'
import { PageHeader, Button, Divider, Modal, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import { withStore } from '@/src/components'
import './new-project.less'

const { dialog } = remote
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

import { AdminProject, Template } from './components'

interface NewProjectProps extends PageProps, StoreProps {
  user: StoreStates['user']
}

declare interface NewProjectState {
  workPath: string
  modalVisible: boolean
  templateTypes: queryTemplateTypeUsingGET.TemplateType[] | undefined
}

@withStore(['user'])
export default class Test extends React.Component<NewProjectProps, NewProjectState> {
  private formRef = React.createRef<FormInstance>()

  readonly state: NewProjectState = {
    workPath: $db.get('workPath').rootPath || '',
    modalVisible: false,
    templateTypes: undefined,
  }

  async componentDidMount() {
    this.queryTemplateType()
  }

  queryTemplateType = async () => {
    const { response } = await $api.queryTemplateType({}, { method: 'GET' })
    this.setState({ templateTypes: response })
  }

  render() {
    const { workPath, modalVisible, templateTypes } = this.state
    const { user } = this.props

    return (
      <div style={{ height: '100%' }}>
        <PageHeader
          ghost={false}
          title="新建项目"
          extra={
            <Button onClick={this.showModal}>
              <PlusOutlined />
              增加模板分类
            </Button>
          }
        />

        <div className="p-20">
          <Divider>后台admin</Divider>
          <AdminProject workPath={workPath}></AdminProject>

          {templateTypes?.map((templateType) => (
            <>
              <Divider>{templateType.typeName}</Divider>
              <Template
                templateTypeId={templateType.id}
                workPath={workPath}
                templates={templateType.projectTemplates}
                queryTemplateType={this.queryTemplateType}
                user={user}
              ></Template>
            </>
          ))}
        </div>

        <Modal
          title="新建模板分类"
          centered
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={this.hideModal}
        >
          <Form {...layout} name="basic" initialValues={{ remember: true }} ref={this.formRef}>
            <Form.Item label="分类名称" name="typeName" rules={[{ required: true, message: '不能为空!' }]}>
              <Input placeholder="请输入分类名称"></Input>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }

  showModal = () => {
    this.setState({ modalVisible: true })
  }

  hideModal = () => {
    this.setState({ modalVisible: false })
  }

  handleOk = async () => {
    const { user } = this.props
    const values = await this.formRef.current?.validateFields()
    await $api.addTemplateType({ ownerId: user.id, typeName: values?.typeName })
    this.setState({ modalVisible: false })
    this.queryTemplateType()
  }
} // class About end
