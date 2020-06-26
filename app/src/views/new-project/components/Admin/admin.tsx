import React, { Component } from 'react'
import { shell } from 'electron'
import { Card, Row, Col } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { ChromeOutlined } from '@ant-design/icons'

import { NormalModal, MicroModal } from './Modals'

const { Meta } = Card

declare interface AdminProjectProps {
  workPath: string
}

declare interface AdminProjectState {
  normalModalVisible: boolean
  microModalVisible: boolean
  currentWorkPath: string
}

export class AdminProject extends Component<AdminProjectProps, AdminProjectState> {
  formRef = React.createRef<FormInstance>()

  readonly state: AdminProjectState = {
    normalModalVisible: false,
    microModalVisible: false,
    currentWorkPath: '',
  }

  componentDidMount() {
    this.setState({ currentWorkPath: this.props.workPath })
  }

  render() {
    const { normalModalVisible, microModalVisible } = this.state

    return (
      <div>
        <Row gutter={24}>
          <Col md={12} lg={8} xl={6}>
            <Card
              title="普通项目"
              hoverable
              type="inner"
              extra={<a onClick={this.showNormalModal}>新建</a>}
              actions={[
                <ChromeOutlined key="chrome" onClick={() => shell.openExternal($tools.GITLAB_EHOME_ADMIN)} />,
              ]}
            >
              <Meta description="位于function目录下的项目" />
            </Card>
          </Col>
          <Col md={12} lg={8} xl={6}>
            <Card
              title="micro项目"
              hoverable
              type="inner"
              extra={<a onClick={this.showMicroModal}>新建</a>}
              actions={[
                <ChromeOutlined key="chrome" onClick={() => shell.openExternal($tools.GITLAB_EHOME_ADMIN)} />,
              ]}
            >
              <Meta description="位于function/micro-xx目录下的项目" />
            </Card>
          </Col>
        </Row>

        <NormalModal visible={normalModalVisible} hideModal={this.hideNormalModal} />
        <MicroModal visible={microModalVisible} hideModal={this.hideMicroModal} />
      </div>
    )
  }

  showNormalModal = () => {
    this.setState({ normalModalVisible: true })
  }

  hideNormalModal = () => {
    this.setState({ normalModalVisible: false })
  }

  showMicroModal = () => {
    this.setState({ microModalVisible: true })
  }

  hideMicroModal = () => {
    this.setState({ microModalVisible: false })
  }
}
