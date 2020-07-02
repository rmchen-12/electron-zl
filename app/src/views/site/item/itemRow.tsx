import React from 'react'
import { shell } from 'electron'
import { Form, Input, Button } from 'antd'
import './item.less'

declare interface ItemRowState {
  type: 'view' | 'edit' | 'add'
  url: string
  description: string
  star: boolean
}

declare interface ItemRowProps {
  site: querySiteUsingGET.Site
  categoryId: number
  querySiteCategories: () => void
  cancel: () => void
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
    star: Reflect.has($db.get('sites'), this.props.site.description),
  }

  render() {
    const { site } = this.props
    const { type, url, description, star } = this.state

    return (
      <div className="site-item-row" key={site.id}>
        {type === 'view' ? (
          <div className="flex center-v between">
            <div className="site-item-row-url" onClick={() => shell.openExternal(url)}>
              <span className="text-ellipsis text-info" style={{ minWidth: 80 }}>
                {description}
              </span>
            </div>
            <div>
              {star ? (
                <i className="ri-magic-fill" onClick={this.save}></i>
              ) : (
                <i className="ri-magic-line" onClick={this.save}></i>
              )}
              <i className="ri-pencil-line" onClick={this.editRow}></i>
              <i className="ri-close-line" onClick={this.delRow}></i>
            </div>
          </div>
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
              <Input placeholder="描述" autoFocus />
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
              <Button type="text" size="small" htmlType="submit">
                ok
              </Button>
              <Button type="text" size="small" onClick={this.onCancel}>
                cancel
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    )
  }

  save = () => {
    const { site } = this.props
    const sites = $db.get('sites')
    if (Reflect.has(sites, site.description)) {
      $db.del(`sites.${site.description}`)
      this.setState({ star: false })
      return
    }
    $db.set(`sites.${site.description}`, site.url)
    this.setState({ star: true })
  }

  onCancel = () => {
    const { cancel } = this.props
    const { type } = this.state
    if (type === 'add') {
      cancel()
      return
    }
    this.setState({ type: 'view' })
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
