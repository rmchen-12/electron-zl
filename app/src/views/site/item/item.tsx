import React from 'react'
import { Button, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import _ from 'lodash'
import './item.less'

import { ItemRow } from './itemRow'

declare interface ItemState {
  sites: querySiteCategoriesUsingGET.SiteCategory['sites']
  categoryName: string
}

declare interface ItemProps {
  category: querySiteCategoriesUsingGET.SiteCategory
  querySiteCategories: () => void
}

export class Item extends React.Component<ItemProps, ItemState> {
  readonly state: ItemState = {
    sites: this.props.category.sites,
    categoryName: '',
  }

  componentDidUpdate(prevProps: ItemProps) {
    if (!_.isEqual(prevProps.category, this.props.category)) {
      this.setState({ sites: this.props.category.sites })
    }
  }

  render() {
    const { querySiteCategories, category } = this.props
    const { sites } = this.state
    return (
      <div className="site-item">
        {category.categoryName === '请输入分类名称' ? (
          <Input
            placeholder={category.categoryName}
            onChange={this.onCategoryChange}
            onBlur={this.addCategory}
          ></Input>
        ) : (
          <div className="fs-16">{category.categoryName}</div>
        )}
        {sites.map((site) => (
          <ItemRow
            key={site.id}
            site={site}
            categoryId={category.id}
            querySiteCategories={querySiteCategories}
          ></ItemRow>
        ))}
        <Button
          className={'site-item_add'}
          type="dashed"
          size="small"
          onClick={this.add}
          style={{ width: '40%' }}
        >
          <PlusOutlined />
        </Button>
      </div>
    )
  }

  add = () => {
    const { sites } = this.state
    this.setState({
      sites: [...sites, { id: NaN, siteCategoryId: NaN, url: '', description: '' }],
    })
  }

  addCategory = () => {
    const { categoryName } = this.state
    const { querySiteCategories } = this.props
    $api.addSiteCategory({ categoryName }).then((res) => {
      querySiteCategories()
    })
  }

  onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ categoryName: e.target.value })
} // class Site end
