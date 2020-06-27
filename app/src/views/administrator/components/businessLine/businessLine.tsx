import React, { Component } from 'react'
import { List, Button, Input, Modal, Avatar, Space, Tooltip } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { AdministratorState } from '../../administrator'

const { confirm } = Modal

interface BusinessLineProps {
  businessLines: AdministratorState['businessLines']
  getBusinessLines: () => void
}

interface BusinessLineState {
  btnType: 'add' | 'view'
  itemType: 'edit' | 'view'
  itemId: number
}

export class BusinessLine extends Component<BusinessLineProps, BusinessLineState> {
  readonly state: BusinessLineState = {
    btnType: 'view',
    itemType: 'view',
    itemId: NaN,
  }

  render() {
    const { businessLines } = this.props
    const { btnType, itemType, itemId } = this.state

    return (
      <div>
        <List
          size="small"
          dataSource={businessLines}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 2,
            xxl: 2,
          }}
          renderItem={(item) => (
            <List.Item
              style={{ display: 'flex' }}
              actions={[
                <a key="list-loadmore-edit" onClick={this.editItem.bind(this, item.id)}>
                  edit
                </a>,
                <a key="list-loadmore-more" onClick={this.deleteLine.bind(this, item.id)}>
                  delete
                </a>,
              ]}
            >
              <React.Fragment>
                {itemType === 'edit' && item.id === itemId ? (
                  <Input
                    style={{ width: 200 }}
                    autoFocus
                    onPressEnter={this.itemPressEnter}
                    onBlur={this.itemBlur}
                    defaultValue={item.lineName}
                  ></Input>
                ) : (
                  <span className="pointer" style={{ width: 80 }} onClick={this.editItem.bind(this, item.id)}>
                    {item.lineName}
                  </span>
                )}
                <Space>
                  {item.users.map((user) => (
                    <Tooltip title={user.username} key={user.id}>
                      <Avatar src={user.avatar}></Avatar>
                    </Tooltip>
                  ))}
                </Space>
              </React.Fragment>
            </List.Item>
          )}
        />

        {btnType === 'view' ? (
          <Button onClick={this.showAddModal}>增加一条业务线</Button>
        ) : (
          <Input
            placeholder="请输入业务线名称"
            style={{ width: 200 }}
            autoFocus
            onPressEnter={this.pressEnter}
            onBlur={this.blur}
          ></Input>
        )}
      </div>
    )
  }

  deleteLine = (id: number) => {
    const { getBusinessLines } = this.props
    confirm({
      title: '确定删除该条业务线吗?',
      icon: <ExclamationCircleOutlined />,
      okText: 'yes',
      okType: 'danger',
      cancelText: 'no',
      centered: true,
      onOk() {
        $api.deleteBusinessLine(id, {}, { method: 'DELETE' }).then(() => {
          getBusinessLines()
        })
      },
    })
  }

  showAddModal = () => {
    this.setState({ btnType: 'add' })
  }

  itemPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { itemId } = this.state
    $api.updateBusinessLine(itemId, { lineName: e.currentTarget.value }, { method: 'PUT' }).then((res) => {
      this.updateLine()
    })
  }

  itemBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { itemId } = this.state
    $api.updateBusinessLine(itemId, { lineName: e.target.value }, { method: 'PUT' }).then((res) => {
      this.updateLine()
    })
  }

  pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    $api.addBusinessLine({ lineName: e.currentTarget.value }).then((res) => {
      this.addLine()
    })
  }

  blur = (e: React.FocusEvent<HTMLInputElement>) => {
    $api.addBusinessLine({ lineName: e.target.value }).then((res) => {
      this.addLine()
    })
  }

  addLine = () => {
    const { getBusinessLines } = this.props
    this.setState({ btnType: 'view' }, getBusinessLines)
  }

  updateLine = () => {
    const { getBusinessLines } = this.props
    this.setState({ itemType: 'view' }, getBusinessLines)
  }

  editItem = (id: number) => {
    this.setState({ itemType: 'edit', itemId: id })
  }
}
