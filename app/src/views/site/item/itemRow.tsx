import React from 'react'
import { Form, Input, Button } from 'antd'
import { shell } from 'electron'
import './item.less'

declare interface ItemRowState {
  type: 'view' | 'edit' | 'add'
  url: string
  description: string
}

declare interface ItemRowProps {
  site: querySiteUsingGET.Site
  categoryId: number
  querySiteCategories: () => void
}

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 },
}

export class ItemRow extends React.Component<ItemRowProps, ItemRowState> {
  readonly state: ItemRowState = {
    type: !this.props.site.url ? 'add' : 'view',
    url: this.props.site.url,
    description: this.props.site.description,
  }

  render() {
    const { site } = this.props
    const { type, url, description } = this.state
    return (
      <div className="site-item-row flex between pr-20" key={site.id}>
        {type === 'view' ? (
          <>
            <div
              className="pointer site-item-row-url flex center-v"
              style={{ width: '80%' }}
              onClick={() => shell.openExternal(url)}
            >
              <span className="text-ellipsis text-primary" style={{ minWidth: 80 }}>
                {description}
              </span>
              (<span className="text-ellipsis">{url}</span>)
            </div>
            <div>
              <i className="ri-pencil-line" onClick={this.editRow}></i>
              <i className="ri-close-line" onClick={this.delRow}></i>
            </div>
          </>
        ) : (
          <Form {...layout} name="basic" onFinish={this.onFormFinish} size="small">
            <Form.Item
              label="描述"
              name="description"
              noStyle
              shouldUpdate
              initialValue={description}
              rules={[{ required: true, message: 'description' }]}
            >
              <Input placeholder="描述" />
            </Form.Item>

            <Form.Item
              label="URL"
              name="url"
              noStyle
              shouldUpdate
              initialValue={url}
              rules={[{ required: true, message: 'url' }]}
            >
              <Input placeholder="url" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    )
  }

  editRow = () => this.setState({ type: 'edit' })

  onFormFinish = ({ url, description }: any) => {
    const { type } = this.state
    const { site, querySiteCategories, categoryId } = this.props
    if (type === 'add') {
      $api.addSite({ url, description, siteCategoryId: categoryId }).then(({ response }) => {
        this.setState({ type: 'view', url: response.url, description: response.description })
        querySiteCategories()
      })
      return
    }
    $api.updateSite(site.id, { url, description }, { method: 'PUT' }).then(({ response }) => {
      this.setState({ type: 'view', url: response.url, description: response.description })
      querySiteCategories()
    })
  }

  delRow = () => {
    const { site, querySiteCategories } = this.props
    $api.deleteSite(site.id, {}, { method: 'DELETE' }).then(() => querySiteCategories())
  }
} // class Site end
