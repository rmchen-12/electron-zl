import React from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
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
    $api.querySiteCategories({}, { method: 'GET' }).then(({ response }) => {
      this.setState({ siteCategories: response })
    })
  }

  render() {
    const { siteCategories } = this.state
    return (
      <div className="p-20" style={{ height: '100%' }}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4, 1150: 5 }}>
          <Masonry>
            {siteCategories.map((category) => (
              <Item key={category.id} category={category}></Item>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    )
  }
} // class Site end
