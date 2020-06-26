// import to from 'await-to-js'

class Git {
  async clone(repo: string, path: string, projectName: string) {
    return await $tools.execCmd(`git clone --depth 1 --single-branch ${repo} ${path}/${projectName}`)
  }

  async init() {
    return await $tools.execCmd('git init')
  }

  async pull() {
    return await $tools.execCmd('git pull')
  }

  async push() {
    return await $tools.execCmd('git push')
  }
}

export const git = new Git()
