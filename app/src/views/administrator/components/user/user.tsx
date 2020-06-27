import React, { Component } from 'react'
import { List, Radio } from 'antd'
import { AdministratorState } from '../../administrator'
import { RadioChangeEvent } from 'antd/lib/radio'

interface UserProps {
  users: AdministratorState['users']
  getUsers: () => void
}

const roleMap = {
  developer: '300',
  maintainer: '400',
  administrator: '500',
}

export class User extends Component<UserProps, {}> {
  getRole = (accessLevel: string) => {
    for (const [key, value] of Object.entries(roleMap)) {
      if (value === accessLevel) {
        return key
      }
    }
  }

  render() {
    const { users } = this.props
    return (
      <div>
        <List
          size="small"
          dataSource={users}
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
            <List.Item style={{ display: 'flex' }}>
              <img src={item.avatar} className="avatar mr-20" />
              <span className="flex-1">{item.displayName}</span>
              <Radio.Group
                options={Object.keys(roleMap)}
                onChange={(e) => this.onRadioChange(e, item)}
                value={this.getRole(item.accessLevel)}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }

  onRadioChange = async (e: RadioChangeEvent, item: getUserInfoUsingGET.User) => {
    const role = e.target.value

    await $api.updateUser(item.id, { accessLevel: roleMap[role] }, { method: 'PUT' })
    await this.props.getUsers()
  }
}
