declare namespace queryNpmAuthUsingGET {
  interface Config {
    packages: {
      [key: string]: { access: string; publish: string } // 每个包都有一个access的字符串和publish字符串，是用户加空格拼成的
    }
  }

  interface Params {}

  interface Response {
    code: number
    msg: string
    data: {
      users: string[]
      config: Config
      packages: string[]
    }
  }
}

declare namespace updateNpmAuthUsingPUT {
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
