declare namespace querySiteCategoriesUsingGET {
  interface SiteCategory {
    id: number
    sites: querySiteUsingGET.Site[]
    categoryName: string | '请输入分类名称'
  }

  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: SiteCategory[]
  }
}

declare namespace addSiteCategoryUsingPOST {
  interface Params {
    categoryName: string
  }

  type Response = querySiteCategoriesUsingGET.Response
}

declare namespace deleteSiteCategoryUsingDELETE {
  interface Params {}

  type Response = querySiteCategoriesUsingGET.SiteCategory
}

declare namespace updateSiteCategoryUsingPUT {
  interface Params {}

  type Response = querySiteCategoriesUsingGET.SiteCategory
}
