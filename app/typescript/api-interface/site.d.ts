declare namespace querySiteUsingGET {
  interface Site {
    [key: string]: string | number | undefined
    id: number
    siteCategoryId: number
    description: string
    url: string
  }

  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: Site
  }
}

declare namespace addSiteUsingPOST {
  type Params = Pick<querySiteUsingGET.Site, 'url' | 'description' | 'siteCategoryId'>

  type Response = querySiteUsingGET.Response
}

declare namespace deleteSiteUsingDELETE {
  interface Params {}

  type Response = querySiteUsingGET.Response
}

declare namespace updateSiteUsingPUT {
  type Params = Pick<querySiteUsingGET.Site, 'url' | 'description'>

  type Response = querySiteUsingGET.Response
}
