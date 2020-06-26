declare namespace getUserInfoUsingGET {
  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: {
      id: number
      username: string
      displayName: string
      accessLevel: string
      avatar: string
      email: string
      registerAt: string
    }
  }
}
