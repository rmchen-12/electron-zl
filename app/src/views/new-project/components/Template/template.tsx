import React, { Component } from 'react'
import { shell } from 'electron'
import { Card, Row, Col, Space, Modal } from 'antd'
import {
  EditOutlined,
  PlusCircleFilled,
  ChromeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { FormInstance } from 'antd/lib/form'
import compact from 'lodash/compact'

import { UseModal, AddTemplateModal } from './Modals'

const { Meta } = Card
const { confirm } = Modal

declare interface TemplateProjectProps {
  templates: queryProjectTemplateUsingGET.ProjectTemplate[]
  workPath: string
  templateTypeId: number
  queryTemplateType: () => void
  user: StoreStates['user']
}

export interface TemplateState {
  repoUrl: string
  modalVisible: boolean
  addModalVisible: boolean
  currentWorkPath: string
  operateType: 'add' | 'edit'
  currentTemplate: queryProjectTemplateUsingGET.ProjectTemplate | undefined
}

export class Template extends Component<TemplateProjectProps, TemplateState> {
  formRef = React.createRef<FormInstance>()

  readonly state: TemplateState = {
    modalVisible: false,
    addModalVisible: false,
    currentWorkPath: '',
    currentTemplate: undefined,
    operateType: 'add',
    repoUrl: '',
  }

  componentDidMount() {
    this.setState({ currentWorkPath: this.props.workPath })
  }

  render() {
    const { modalVisible, addModalVisible, currentTemplate, operateType, repoUrl } = this.state
    const { templates, templateTypeId, queryTemplateType, user } = this.props

    return (
      <div>
        <Row gutter={[24, 24]}>
          {templates.map((template) => (
            <Col md={12} lg={8} xl={6} key={template.id}>
              <Card
                hoverable
                type="inner"
                title={template.templateName}
                extra={<a onClick={this.showUseModal.bind(this, template.repoUrl)}>使用</a>}
                actions={compact([
                  template.ownerId === user.id && (
                    <EditOutlined key="edit" onClick={this.edit.bind(this, template)} />
                  ),
                  <ChromeOutlined key="chrome" onClick={() => shell.openExternal(template.repoUrl)} />,
                  template.ownerId === user.id && (
                    <DeleteOutlined key="delete" onClick={this.delete.bind(this, template.id)} />
                  ),
                ])}
              >
                <Meta description={template.description} />
                <div className="fs-12 text-gray mt-20">
                  最近更新： {$tools.formatDate(new Date(template.updatedAt), 'YYYY-MM-DD hh:mm')}
                </div>
              </Card>
            </Col>
          ))}
          <Col md={12} lg={8} xl={6}>
            <Card hoverable type="inner" onClick={this.showAddModal}>
              <Space>
                <PlusCircleFilled />
                加个模板
              </Space>
            </Card>
          </Col>
        </Row>

        <AddTemplateModal
          templateTypeId={templateTypeId}
          visible={addModalVisible}
          hideModal={this.hideAddModal}
          queryTemplateType={queryTemplateType}
          currentTemplate={currentTemplate}
          type={operateType}
          user={user}
        />
        <UseModal visible={modalVisible} hideModal={this.hideDefaultModal} repoUrl={repoUrl} />
      </div>
    )
  }

  edit = (template: queryProjectTemplateUsingGET.ProjectTemplate) => {
    this.setState({ addModalVisible: true, currentTemplate: template, operateType: 'edit' })
  }

  delete = (id: number) => {
    const { queryTemplateType } = this.props
    confirm({
      title: '确定删除该模板吗?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      onOk() {
        $api.deleteProjectTemplate(id, {}, { method: 'DELETE' }).then(() => {
          queryTemplateType()
        })
      },
    })
  }

  showUseModal = (repoUrl: string) => {
    this.setState({ modalVisible: true, repoUrl })
  }

  hideDefaultModal = () => {
    this.setState({ modalVisible: false })
  }

  showAddModal = () => {
    this.setState({ addModalVisible: true })
  }

  hideAddModal = () => {
    this.setState({ addModalVisible: false, currentTemplate: undefined, operateType: 'add' })
  }
}
