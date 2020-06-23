import React from 'react'
import { List, Card, Button } from 'antd'

import './site.less'

declare interface SiteState {
  siteCategories: querySiteCategoriesUsingGET.Response['response']
}

export default class Site extends React.Component<PageProps, SiteState> {
  readonly state: SiteState = {
    siteCategories: [],
  }

  async componentDidMount() {
    $api.querySiteCategories({}, { method: 'GET' }).then(({ response }) => {
      this.setState({ siteCategories: response })
    })
  }

  render() {
    const { siteCategories } = this.state
    return (
      <List
        className="p-20"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={siteCategories}
        renderItem={(item: querySiteCategoriesUsingGET.SiteCategories) => (
          <List.Item>
            <Card title={item.category_name}>
              <List
                size="small"
                dataSource={item.sites}
                renderItem={(item) => <List.Item>{item.url}</List.Item>}
              ></List>
            </Card>
          </List.Item>
        )}
      />
    )
  }
} // class Site end
