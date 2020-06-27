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
  interface Params {}

  type Response = queryTemplateTypeUsingGET.TemplateType
}

declare namespace updateTemplateTypeUsingPUT {
  interface Params {}

  type Response = queryTemplateTypeUsingGET.TemplateType
}
