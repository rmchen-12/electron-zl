import React from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './site.less'

import { Item } from './item/index'

declare interface SiteState {
  siteCategories: querySiteCategoriesUsingGET.Response['response']
}

export default class Site extends React.Component<PageProps, SiteState> {
  readonly state: SiteState = {
    siteCategories: [],
  }

  async componentDidMount() {
    this.querySiteCategories()
  }

  querySiteCategories = () => {
    $api.querySiteCategories({}, { method: 'GET' }).then(({ response }) => {
      this.setState({ siteCategories: response })
    })
  }

  render() {
    const { siteCategories } = this.state
    return (
      <div style={{ height: '100%' }}>
        <PageHeader
          ghost={false}
          title="快捷导航"
          extra={
            <Button onClick={this.addCategory}>
              <PlusOutlined />
              添加分类
            </Button>
          }
        />

        <div className="p-20">
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 3, 750: 4, 900: 4, 1150: 5 }}>
            <Masonry>
              {siteCategories.map((category) => (
                <Item
                  key={category.id}
                  category={category}
                  querySiteCategories={this.querySiteCategories}
                ></Item>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </div>
    )
  }

  addCategory = () => {
    const { siteCategories } = this.state
    this.setState({
      siteCategories: [...siteCategories, { id: NaN, sites: [], categoryName: '请输入分类名称' }],
    })
  }
} // class Site end
