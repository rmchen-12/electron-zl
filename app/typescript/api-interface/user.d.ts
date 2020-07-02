declare namespace getUserInfoUsingGET {
  type accessLevel = '100' | '200' | '300' | '400' | '500'

  interface User {
    id: number
    businessLineId: number
    username: string
    displayName: string
    accessLevel: accessLevel
    avatar: string
    email: string
    registerAt: string
    businessLine: queryBusinessLineUsingGET.BusinessLine
  }

  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: User
  }
}

declare namespace queryUserUsingGET {
  interface Params {}

  interface Response {
    errorCode: number
    errorDescription: string
    response: getUserInfoUsingGET.User[]
  }
}
declare namespace updateUserUsingPUT {
  type Params = Partial<Pick<getUserInfoUsingGET.User, 'username' | 'accessLevel' | 'businessLineId'>>

  type Response = queryUserUsingGET.Response
}

// declare namespace addUserUsingPOST {
//   type Params = Pick<getUserInfoUsingGET.User, 'url' | 'description' | 'UserCategoryId'>

//   type Response = queryUserUsingGET.Response
// }

// declare namespace deleteUserUsingDELETE {
//   interface Params {}

//   type Response = queryUserUsingGET.Response
// }
