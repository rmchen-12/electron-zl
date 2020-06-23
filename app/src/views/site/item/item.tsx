import React from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import './item.less'

declare interface ItemState {}

declare interface ItemProps {
  category: querySiteCategoriesUsingGET.SiteCategory
}

export class Item extends React.Component<ItemProps, ItemState> {
  readonly state: ItemState = {}

  render() {
    const { category } = this.props
    return (
      <div className="site-item">
        <div className="fs-16">{category.category_name}</div>
        {category.sites.map((site) => (
          <div className="flex between pr-20" key={site.id}>
            <div>{site.url}</div>
            <i className="ri-close-line"></i>
          </div>
        ))}
        <Button type="dashed" size="small" onClick={this.add} style={{ width: '40%' }}>
          <PlusOutlined />
        </Button>
      </div>
    )
  }

  add = () => {}
} // class Site end
