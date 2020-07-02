import * as React from 'react'
import { Layout, Statistic, Space, Divider, Row, Col, Avatar } from 'antd'
import { withStore } from '@/src/components'
import { compact, values } from 'lodash'
import './work-bench.less'

import Emoji from './emoji.json'

import { MainContent, SiderContent } from './components'
import { npmPaths } from '@/core/db/models'

const { Header, Content } = Layout

interface WorkBenchProps extends PageProps, StoreProps {
  user: StoreStates['user']
  npmPaths: StoreStates['npmPaths']
  workPaths: StoreStates['workPaths']
  businessLines: StoreStates['businessLines']
}

declare interface WorkBenchState {
  currentEmoji: string
}

@withStore(['user', 'businessLines', 'workPaths', 'npmPaths'])
export default class WorkBench extends React.Component<WorkBenchProps, WorkBenchState> {
  private stats = ['拥有项目', 'NPM包']
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
    const { user, workPaths } = this.props
    const { currentEmoji } = this.state

    return (
      <Layout className="work-bench">
        <Header className="work-bench-header flex center-v between">
          <div className="work-bench-header-greetings flex column between">
            <div className={'fs-16'}>HI，{user.username}</div>
            <div className={'fs-12 text-gray'}>前端开发部 - {user.businessLine?.lineName} - FED</div>
          </div>
          <div className="fs-16">{currentEmoji}</div>

          <div className={'work-bench-header-stat'}>
            <Space>
              {this.stats.map((stat, index) => (
                <React.Fragment key={stat}>
                  <Statistic
                    title={<div className={'work-bench-header-stat-title'}>{stat}</div>}
                    valueStyle={{ fontSize: 20 }}
                    value={compact(values(stat === '拥有项目' ? workPaths : npmPaths)).length}
                  />
                  {index !== this.stats.length - 1 && <Divider type="vertical"></Divider>}
                </React.Fragment>
              ))}
            </Space>
          </div>
        </Header>

        <Layout>
          <Content>
            <Row>
              <Col xs={24} sm={24} md={24} lg={20}>
                <MainContent></MainContent>
              </Col>
              <Col xs={0} sm={0} md={0} lg={4}>
                <SiderContent></SiderContent>
              </Col>
            </Row>
          </Content>
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
