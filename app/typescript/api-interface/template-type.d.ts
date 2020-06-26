declare namespace queryTemplateTypeUsingGET {
  interface TemplateType {
    id: number
    projectTemplates: queryProjectTemplateUsingGET.ProjectTemplate[]
    typeName: string
  }

  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: TemplateType[]
  }
}

declare namespace addTemplateTypeUsingPOST {
  interface Params {
    ownerId: number
    typeName: string
  }

  type Response = queryTemplateTypeUsingGET.Response
}

declare namespace deleteTemplateTypeUsingDELETE {
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

declare namespace updateTemplateTypeUsingPUT {
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
