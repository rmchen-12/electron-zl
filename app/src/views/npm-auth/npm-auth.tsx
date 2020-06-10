import React from 'react'
import { shell } from 'electron'
import { Tag, PageHeader, Steps, Space, Button, Row, Col, Divider, message } from 'antd'
import _ from 'lodash'

import './npm-auth.less'

const { Step } = Steps
const { CheckableTag } = Tag

declare interface NpmAuthState {
  users: string[]
  config: queryNpmAuthUsingGET.Config
  packages: string[]
  currentStep: 0 | 1
  btnLoading: boolean
  selectedPackage: string
  selectedUsers: string[]
  packagesWithOwner: string[]
}

/**
 * PageProps 是组件的 props 类型声明
 * NpmAuthState 是组件的 state 类型声明
 * props 和 state 的默认值需要单独声明
 */
export default class NpmAuth extends React.Component<PageProps, NpmAuthState> {
  state: NpmAuthState = {
    users: [],
    config: { packages: {} },
    packages: [],

    currentStep: 0,
    btnLoading: false,

    selectedPackage: '',
    selectedUsers: [],
    packagesWithOwner: [],
  }

  componentDidMount() {
    this.queryUser()
  }

  queryUser = () => {
    $api.queryNpmAuth({}, { method: 'GET' }).then(({ data }) => {
      const { users, config, packages } = data
      const packagesWithScope = this.completePackage(packages)
      const packagesWithOwner = Object.keys(config.packages)

      this.setState({ users, config, packages: packagesWithScope, packagesWithOwner })
    })
  }

  submit = () => {
    const { selectedPackage, selectedUsers, config, packagesWithOwner } = this.state
    const newAuth = { [selectedPackage]: { access: '$all', publish: selectedUsers.join(' ') } }

    const newPackages = {
      ..._.omit(config.packages, ['**']),
      ...newAuth,
      ..._.pick(config.packages, ['**']),
    }

    const newConfig = { ...config, packages: newPackages }
    this.setState({
      config: newConfig,
      btnLoading: true,
      packagesWithOwner: [...packagesWithOwner, selectedPackage],
    })
    $api
      .updateNpmAuth({ config: newConfig }, { method: 'POST' })
      .then(({ data }) => {
        const { msg } = data
        message.success(msg)
      })
      .finally(() => this.setState({ btnLoading: false }))
  }

  render() {
    const {
      users,
      selectedPackage,
      packages,
      currentStep,
      selectedUsers,
      btnLoading,
      packagesWithOwner,
    } = this.state

    return (
      <div className="npm-auth " style={{ height: '100%' }}>
        <PageHeader
          ghost={false}
          title="npm包权限控制"
          subTitle={
            <a
              onClick={() => {
                shell.openExternal('http://10.1.10.34:4873')
              }}
            >
              跳转私服web页面
            </a>
          }
          extra={
            <Space>
              <Button onClick={this.reset}>重置</Button>
              <Button
                type="primary"
                onClick={this.submit}
                loading={btnLoading}
                disabled={selectedUsers.length === 0 || !selectedPackage}
              >
                确定
              </Button>
            </Space>
          }
        />

        <div className="p-20">
          <div style={{ margin: '0 100px 20px 100px' }}>
            <Steps current={currentStep}>
              <Step title="选择一个包吧" description="淡黄色已有主人" />
              <Step title="选择用户" description="拥有上传权限~~~" />
            </Steps>
          </div>

          <Row>
            <Col span="12">
              {packages.map(packageName => (
                <CheckableTag
                  style={
                    packagesWithOwner.includes(packageName) && selectedPackage !== packageName
                      ? { backgroundColor: '#FCFFE6' }
                      : {}
                  }
                  key={packageName}
                  checked={selectedPackage === packageName}
                  onChange={checked => this.handlePackageChange(packageName, checked)}
                >
                  <span className="fs-16">{packageName}</span>
                </CheckableTag>
              ))}
            </Col>
            <Col span="1">
              <Divider type="vertical" style={{ height: '100%' }}></Divider>
            </Col>
            <Col span="11">
              {users.map(user => (
                <CheckableTag
                  key={user}
                  checked={selectedUsers.indexOf(user) > -1}
                  onChange={checked => this.handleUserChange(user, checked)}
                >
                  <span className="fs-16">{user}</span>
                </CheckableTag>
              ))}
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  handlePackageChange(packageName: string, checked: boolean) {
    const { config } = this.state
    const nextSelectedTags = checked ? packageName : ''
    const { publish } = config.packages[packageName] ?? {}
    const users = publish?.split(' ')

    this.setState({ selectedPackage: nextSelectedTags, currentStep: 1, selectedUsers: users || [] })
  }

  handleUserChange(user: string, checked: boolean) {
    const { selectedUsers } = this.state
    const nextSelectedTags = checked ? [...selectedUsers, user] : selectedUsers.filter(t => t !== user)
    this.setState({ selectedUsers: nextSelectedTags })
  }

  reset = () => this.setState({ selectedPackage: '', selectedUsers: [], currentStep: 0 })

  // 类似@aclink/test这些带scope的也需要作为可选项
  completePackage(packages: string[]) {
    const reg = /(^@.*\/)(?=.*)/gm
    const res = packages.map(v => {
      const scope = v.match(reg)
      return scope ? `${scope[0]}*` : undefined
    })
    return [
      ..._(res)
        .uniq()
        .compact()
        .valueOf(),
      ...packages,
    ]
  }
} // class About end
