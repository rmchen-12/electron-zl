declare namespace queryBusinessLineUsingGET {
  interface BusinessLine {
    id: number
    lineName: string
    users: getUserInfoUsingGET.User[]
  }

  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: BusinessLine[]
  }
}

declare namespace addBusinessLineUsingPOST {
  type Params = Pick<queryBusinessLineUsingGET.BusinessLine, 'lineName'>

  type Response = queryBusinessLineUsingGET.Response
}

declare namespace deleteBusinessLineUsingDELETE {
  interface Params {}

  type Response = queryBusinessLineUsingGET.Response
}

declare namespace updateBusinessLineUsingPUT {
  type Params = Pick<queryBusinessLineUsingGET.BusinessLine, 'lineName'>

  type Response = queryBusinessLineUsingGET.Response
}
