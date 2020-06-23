declare namespace querySiteCategoriesUsingGET {
  interface site {
    [key: string]: string | number
    site_category_id: number
    url: string
  }

  interface SiteCategories {
    category_name: string
    sites: site[]
  }

  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: SiteCategories[]
  }
}

declare namespace addSiteCategoryUsingPOST {
  interface Params {
    config: object
  }

  interface Response {
    code: number
    msg: string
    data: {
      msg: string
    }
  }
}

declare namespace deleteSiteCategoryUsingDELETE {
  interface Params {
    config: object
  }

  interface Response {
    code: number
    msg: string
    data: {
      msg: string
    }
  }
}

declare namespace updateSiteCategoryUsingPUT {
  interface Params {
    config: object
  }

  interface Response {
    code: number
    msg: string
    data: {
      msg: string
    }
  }
}
