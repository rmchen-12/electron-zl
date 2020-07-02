import * as React from 'react'
import { ipcRenderer, remote } from 'electron'
import { ConfigProvider, Modal, Form, Select, Input, Button, message } from 'antd'
import { withStore } from '@/src/components/with-store'
import { FormInstance } from 'antd/lib/form'
import zhCN from 'antd/es/locale/zh_CN'
import omit from 'lodash/omit'
import globby from 'globby'
import slash from 'slash'

import { AppRouter, AppLayout } from '@/src/components'
import routes from './auto-routes'

const { Option } = Select
const { dialog } = remote
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

interface AppProps extends StoreProps {
  createConfig: CreateConfig
  user: StoreStates['user']
  workPaths: StoreStates['workPaths']
}

interface AppState {
  modalVisible: boolean
  businessLines: queryBusinessLineUsingGET.BusinessLine[]
  rootPath: string | undefined
}

class App extends React.Component<AppProps, AppState> {
  private formRef = React.createRef<FormInstance>()
  readonly state: AppState = {
    modalVisible: false,
    businessLines: [],
    rootPath: $db.get('workPaths').rootPath || undefined,
  }

  componentDidMount() {
    this.getBusinessLine()
    this.getUserInfo()
    this.initWorkPaths()

    // gitLab登录成功后重新获取用户信息
    ipcRenderer.on('gitLab-login-replay', () => {
      this.getUserInfo()
    })
  }

  /**
   * 用户数据存全局
   */
  getUserInfo = () => {
    $api.getUserInfo({}, { method: 'GET' }).then((res) => {
      message.error(res)
      this.props.dispatch({ type: 'ACTION_ADD_USER', data: res.response })
      if (!res.response.businessLineId) this.setState({ modalVisible: true })
    })
  }

  /**
   * 业务线数据存全局，方便做权限处理
   */
  getBusinessLine = () => {
    this.props.dispatch({ type: 'ACTION_CLEAR_BUSINESS_LINES', data: [] })
    $api.queryBusinessLines({}, { method: 'GET' }).then((res) => {
      this.setState({ businessLines: res.response })
      this.props.dispatch({ type: 'ACTION_ADD_BUSINESS_LINES', data: res.response })
    })
  }

  render() {
    const { modalVisible, businessLines, rootPath } = this.state
    return (
      <ConfigProvider locale={zhCN}>
        <AppLayout createConfig={this.props.createConfig}>
          <AppRouter routes={routes} />
        </AppLayout>

        <Modal
          title="完善信息"
          centered
          visible={modalVisible}
          onCancel={() => this.setState({ modalVisible: false })}
          onOk={this.handleOk}
        >
          <Form {...layout} name="basic" ref={this.formRef}>
            <Form.Item label="工作目录" name="workPath">
              <Button type="text" onClick={this.selectPath}>
                {rootPath || '选择工作目录，即你的项目所在的目录'}
              </Button>
            </Form.Item>
            <Form.Item label="真实姓名" name="username" rules={[{ required: true, message: '不能为空!' }]}>
              <Input placeholder="请输入你的真实姓名"></Input>
            </Form.Item>
            <Form.Item
              label="所属业务线"
              name="businessLineId"
              rules={[{ required: true, message: '不能为空!' }]}
            >
              <Select placeholder="选择业务线">
                {businessLines.map((line) => (
                  <Option key={line.id} value={line.id}>
                    {line.lineName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    )
  }

  handleOk = async () => {
    const values = await this.formRef.current?.validateFields()
    const { user } = this.props
    await $api.updateUser(
      user.id,
      { username: values?.username, businessLineId: values?.businessLineId },
      { method: 'PUT' }
    )
    this.setState({ modalVisible: false })
    this.getUserInfo()
    this.getWorkPathProjects()
  }

  selectPath = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          this.setState({ rootPath: filePaths[0] })
          $db.set('workPaths.rootPath', filePaths[0])
        }
      })
  }

  /**
   * 第一次登录时获取所选工作目录下的所有项目作为初始项目
   * 全局存下所有的项目目录，方便后面的npm,git等操作
   */
  getWorkPathProjects = async () => {
    const rootPath = $db.get('workPaths').rootPath
    const rootPathDirs = await globby('*', {
      cwd: rootPath,
      onlyDirectories: true,
      unique: true,
    })

    let index = rootPathDirs.length - 1
    const newWorkPaths = {}
    while (index >= 0) {
      const projectName = rootPathDirs[index].split('/')[1]
      const path = `${rootPath}/${projectName}`
      newWorkPaths[projectName] = slash(path)
      index--
    }

    this.props.dispatch({ type: 'ACTION_ADD_WORK_PATHS', data: newWorkPaths })
  }

  /**
   * 每次进app先获取缓存的workPaths存到全局，后面npm，git等操作需要用
   */
  initWorkPaths = () => {
    if (!$db.get('workPaths').rootPath) {
      message.error('请先选择你的工作目录')
      return
    }
    const workPaths = omit($db.get('workPaths'), 'rootPath')
    this.props.dispatch({ type: 'ACTION_ADD_WORK_PATHS', data: workPaths })
  }
}

export default withStore(['user', 'workPaths', 'businessLines'])(App)
