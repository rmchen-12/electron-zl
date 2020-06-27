import React from 'react'
import { Button, Input, Card, Space, Modal } from 'antd'
import { PlusOutlined, MinusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import _ from 'lodash'
import { withStore } from '@/src/components'
import './item.less'

import { ItemRow } from './itemRow'

const { confirm } = Modal

declare interface ItemState {
  sites: querySiteCategoriesUsingGET.SiteCategory['sites']
  categoryName: string
}

declare interface ItemProps {
  category: querySiteCategoriesUsingGET.SiteCategory
  querySiteCategories: () => void
}

@withStore(['user'])
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
        <Card
          hoverable
          size="small"
          title={
            category.categoryName === '请输入分类名称' ? (
              <Input
                placeholder={category.categoryName}
                onChange={this.onCategoryChange}
                onBlur={this.addCategory}
                autoFocus
              ></Input>
            ) : (
              <div className="fs-16">{category.categoryName}</div>
            )
          }
        >
          {sites.map((site) => (
            <ItemRow
              key={site.id}
              site={site}
              cancel={this.cancel}
              categoryId={category.id}
              querySiteCategories={querySiteCategories}
            ></ItemRow>
          ))}

          <Space className="mt-16">
            <Button className={'site-item_add'} type="dashed" size="small" onClick={this.add}>
              <PlusOutlined />
            </Button>

            <Button className={'site-item_delete'} type="dashed" size="small" onClick={this.deleteCategory}>
              <MinusOutlined />
            </Button>
          </Space>
        </Card>
      </div>
    )
  }

  add = () => {
    const { sites } = this.state
    this.setState({
      sites: [...sites, { id: NaN, siteCategoryId: NaN, url: '', description: '' }],
    })
  }

  cancel = () => {
    const { sites } = this.state
    this.setState({
      sites: sites.slice(0, sites.length - 1),
    })
  }

  addCategory = () => {
    const { categoryName } = this.state
    const { querySiteCategories } = this.props
    $api.addSiteCategory({ categoryName }).then(() => {
      querySiteCategories()
    })
  }

  deleteCategory = () => {
    const { category, querySiteCategories } = this.props
    confirm({
      title: '确定删除整个分类吗?⊙▂⊙',
      icon: <ExclamationCircleOutlined />,
      okText: '死吧',
      okType: 'danger',
      cancelText: '留下',
      centered: true,
      onOk() {
        $api.deleteSiteCategory(category.id, {}, { method: 'DELETE' }).then(() => {
          querySiteCategories()
        })
      },
    })
  }

  onCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ categoryName: e.target.value })
} // class Site end
