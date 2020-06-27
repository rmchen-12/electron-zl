import * as React from 'react'
import { ipcRenderer, remote } from 'electron'
import { ConfigProvider, Modal, Form, Select, Input, Button } from 'antd'
import { withStore } from '@/src/components/with-store'
import { FormInstance } from 'antd/lib/form'
import zhCN from 'antd/es/locale/zh_CN'

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
}

interface AppState {
  modalVisible: boolean
  businessLines: queryBusinessLineUsingGET.BusinessLine[]
}

class App extends React.Component<AppProps, AppState> {
  private formRef = React.createRef<FormInstance>()
  readonly state: AppState = {
    modalVisible: false,
    businessLines: [],
  }

  componentDidMount() {
    this.getUserInfo()
    this.getBusinessLine()
    ipcRenderer.on('gitLab-login-replay', (e, arg) => {
      this.getUserInfo()
    })
  }

  getUserInfo = () => {
    $api.getUserInfo({}, { method: 'GET' }).then((res) => {
      if (!res.response.businessLineId) {
        this.setState({ modalVisible: true })
        return
      }

      this.props.dispatch({ type: 'ACTION_ADD_USER', data: res.response })
    })
  }

  getBusinessLine = () => {
    $api.queryBusinessLines({}, { method: 'GET' }).then((res) => {
      this.setState({ businessLines: res.response })
    })
  }

  render() {
    const { modalVisible, businessLines } = this.state
    return (
      <ConfigProvider locale={zhCN}>
        <AppLayout createConfig={this.props.createConfig}>
          <AppRouter routes={routes} />
        </AppLayout>

        <Modal title="完善信息" centered visible={modalVisible} onOk={this.handleOk}>
          <Form {...layout} name="basic" initialValues={{ remember: true }} ref={this.formRef}>
            <Form.Item label="工作目录" name="workPath">
              <Button type="text" onClick={this.selectPath}>
                选择工作目录，即你的项目所在的目录
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
  }

  selectPath = () => {
    dialog
      .showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          $db.set('workPath.rootPath', filePaths[0])
        }
      })
  }
}

export default withStore(['user'])(App)
