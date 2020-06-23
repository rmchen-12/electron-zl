declare namespace querySiteCategoriesUsingGET {
  interface Site {
    [key: string]: string | number
    site_category_id: number
    url: string
    id: number
  }

  interface SiteCategory {
    id: number
    category_name: string
    sites: Site[]
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
