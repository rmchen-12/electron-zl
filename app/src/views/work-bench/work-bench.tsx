import * as React from 'react'
import { Layout, Statistic, Space, Divider } from 'antd'
import { withStore } from '@/src/components'
import './work-bench.less'
import Emoji from './emoji.json'

import { MainContent } from './components'

const { Header, Sider, Content } = Layout

interface WorkBenchProps extends PageProps, StoreProps {
  user: StoreStates['user']
}

declare interface WorkBenchState {
  currentEmoji: string
}

@withStore(['user'])
export default class WorkBench extends React.Component<WorkBenchProps, WorkBenchState> {
  private stats = ['拥有项目']
  private interval: NodeJS.Timeout | undefined
  private emoji = () => {
    const index = Math.floor(Math.random() * Emoji.length)
    return Emoji[index]
  }
  private workTime = () => {
    const { user } = this.props
    const time = $tools.formatDate()
    const registerTime = $tools.formatDate(new Date(user.registerAt))
    const year = Number(time.slice(0, 4)) - Number(registerTime.slice(0, 4))
    const month = Number(time.slice(4, 7)) - Number(registerTime.slice(4, 7))
    return year > 0 ? `${year}.${month}` : `${month}`
  }

  readonly state: WorkBenchState = {
    currentEmoji: this.emoji(),
  }

  constructor(props: WorkBenchProps) {
    super(props)
  }

  componentDidMount() {
    this.getEmoji()
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval)
    this.interval = undefined
  }

  render() {
    const { user } = this.props
    const { currentEmoji } = this.state
    return (
      <Layout className="work-bench">
        <Header className="work-bench-header flex center-v between">
          <img className="work-bench-header-avatar" src={user.avatar} />
          <div className="work-bench-header-greetings flex flex-1 column between">
            <div className={'fs-16'}>
              HI，{user.username}，{currentEmoji}
            </div>
            <div className={'fs-12 text-gray'}>前端开发部 - {user.businessLine?.lineName} - FED</div>
          </div>
          <div className={'work-bench-header-stat'}>
            <Space>
              {this.stats.map((stat, index) => (
                <React.Fragment key={stat}>
                  <Statistic
                    title={<div className={'work-bench-header-stat-title'}>{stat}</div>}
                    valueStyle={{ fontSize: 20 }}
                    value={93}
                  />
                  {index !== this.stats.length - 1 && <Divider type="vertical"></Divider>}
                </React.Fragment>
              ))}
            </Space>
          </div>
        </Header>

        <Layout>
          <Content>
            <MainContent></MainContent>
          </Content>
          <Sider theme="light">Sider</Sider>
        </Layout>
      </Layout>
    )
  }

  getEmoji = () => {
    this.interval = setInterval(() => {
      this.setState({ currentEmoji: this.emoji() })
    }, 1000 * 60 * 4)
  }
} // class WorkBench end
