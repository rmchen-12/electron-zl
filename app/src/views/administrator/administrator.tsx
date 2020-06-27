import React from 'react'
import { PageHeader, Card, Space } from 'antd'
import { withStore } from '@/src/components'

import './administrator.less'

import { User, BusinessLine } from './components'

interface AdministratorProps extends PageProps {
  user: StoreStates['user']
}

export interface AdministratorState {
  users: getUserInfoUsingGET.User[]
  businessLines: queryBusinessLineUsingGET.BusinessLine[]
}

@withStore(['user'])
export default class Administrator extends React.Component<AdministratorProps, AdministratorState> {
  readonly state: AdministratorState = {
    users: [],
    businessLines: [],
  }

  componentDidMount() {
    this.getUsers()
    this.getBusinessLines()
  }

  getUsers = () => {
    const { user } = this.props
    $api.queryUser({}, { method: 'GET' }).then((res) => {
      this.setState({ users: res.response.filter((v) => v.id !== user.id) })
    })
  }

  getBusinessLines = () => {
    $api.queryBusinessLines({}, { method: 'GET' }).then((res) => {
      this.setState({ businessLines: res.response })
    })
  }

  render() {
    const { users, businessLines } = this.state
    return (
      <div className="administrator" style={{ height: '100%' }}>
        <PageHeader ghost={true} title="权限管理" />

        <div className="pr-16 pl-16">
          <Space direction="vertical">
            <Card title="用户">
              <User users={users} getUsers={this.getUsers}></User>
            </Card>
            <Card title="业务线">
              <BusinessLine
                businessLines={businessLines}
                getBusinessLines={this.getBusinessLines}
              ></BusinessLine>
            </Card>
          </Space>
        </div>
      </div>
    )
  }
} // class About end
