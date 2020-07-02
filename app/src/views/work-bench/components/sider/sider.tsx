import React, { Component } from 'react'
import { shell } from 'electron'
import { Card, Tooltip, Space } from 'antd'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { withStore, UserAvatar } from '@/src/components'
import './sider.less'

interface SiderContentProps extends StoreProps {
  user: StoreStates['user']
  businessLines: StoreStates['businessLines']
}

interface SiderContentState {
  teamMembers: getUserInfoUsingGET.User[]
  sites: object[]
}

class SiderContent1 extends Component<SiderContentProps, SiderContentState> {
  readonly state: SiderContentState = {
    teamMembers: [],
    sites: $tools.obj2arr($db.get('sites')),
  }

  componentDidMount() {
    $api.queryUser({}, { method: 'GET' }).then((res) => {
      this.setState({ teamMembers: res.response })
    })
  }

  render() {
    const { user, businessLines } = this.props
    const { teamMembers, sites } = this.state
    const groupMembers = businessLines.filter((line) => line.id === user.businessLineId)[0]?.users || []

    return (
      <div className="work-bench-sider">
        <Space direction="vertical">
          <Card title="快捷导航" style={{ textAlign: 'left' }}>
            {sites.map((site, index) => {
              const [[description, url]] = Object.entries(site)
              return (
                <div className="text-info pointer" onClick={this.openSite.bind(this, url)} key={index}>
                  {description}
                </div>
              )
            })}
          </Card>

          <Card title="组员">
            <ResponsiveMasonry columnsCountBreakPoints={{ 100: 3, 150: 4, 200: 5 }}>
              <Masonry>
                {groupMembers.map((member) => (
                  <Tooltip title={member.username} key={member.id}>
                    <UserAvatar src={member.avatar} accessLevel={member.accessLevel}></UserAvatar>
                  </Tooltip>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </Card>

          <Card title="团队" bodyStyle={{ textAlign: 'left' }}>
            {businessLines.map((line) => (
              <Tooltip
                title={
                  <div style={{ textAlign: 'center' }}>
                    {line.users.map((user) => (
                      <UserAvatar
                        className="m-4"
                        src={user.avatar}
                        accessLevel={user.accessLevel}
                        key={user.id}
                      ></UserAvatar>
                    ))}
                  </div>
                }
                key={line.id}
              >
                <div key={line.id}>{line.lineName}</div>
              </Tooltip>
            ))}
          </Card>

          <Card title="成员">
            <ResponsiveMasonry columnsCountBreakPoints={{ 100: 3, 150: 4, 200: 5 }}>
              <Masonry>
                {teamMembers.map((member) => (
                  <Tooltip title={member.username} key={member.id}>
                    <UserAvatar src={member.avatar} accessLevel={member.accessLevel}></UserAvatar>
                  </Tooltip>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </Card>
        </Space>
      </div>
    )
  }

  openSite = (url: string) => {
    shell.openExternal(url)
  }
}

export const SiderContent = withStore(['user', 'businessLines'])(SiderContent1)
