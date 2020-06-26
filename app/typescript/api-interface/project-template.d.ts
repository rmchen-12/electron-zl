declare namespace queryProjectTemplateUsingGET {
  interface ProjectTemplate {
    [key: string]: string | number | undefined
    id: number
    ownerId: number
    templateTypeId: number
    description: string
    repoUrl: string
    templateName: string
    updatedAt: string
  }

  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: ProjectTemplate
  }
}

declare namespace addProjectTemplateUsingPOST {
  type Params = Pick<
    queryProjectTemplateUsingGET.ProjectTemplate,
    'repoUrl' | 'description' | 'templateTypeId' | 'templateName' | 'ownerId'
  >

  type Response = queryProjectTemplateUsingGET.Response
}

declare namespace deleteProjectTemplateUsingDELETE {
  interface Params {}

  type Response = queryProjectTemplateUsingGET.Response
}

declare namespace updateProjectTemplateUsingPUT {
  type Params = Pick<queryProjectTemplateUsingGET.ProjectTemplate, 'repoUrl' | 'description' | 'templateName'>

  type Response = queryProjectTemplateUsingGET.Response
}
