declare namespace getUserInfoUsingGET {
  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: {
      username: string
      avatar: string
      email: string
      registerAt: string
    }
  }
}
