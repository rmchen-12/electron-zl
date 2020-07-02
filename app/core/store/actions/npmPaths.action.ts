import omit from 'lodash/omit'
import slash from 'slash'

export const initialState = {
  npmPaths: {},
}

export function ACTION_ADD_NPM_PATHS(
  state: StoreStates,
  action: StoreAction<'ACTION_ADD_NPM_PATHS'>
): { npmPaths: object } {
  // db里也存一份，app重启动时需要用来初始化
  for (const [key, value] of Object.entries(action.data)) {
    if (!value) continue
    $db.set(`npmPaths.${key}`, slash(value))
  }
  return { npmPaths: { ...state.npmPaths, ...action.data } }
}

export function ACTION_DELETE_NPM_PATH(
  state: StoreStates,
  action: StoreAction<'ACTION_DELETE_NPM_PATH'>
): { npmPaths: object } {
  const npmPaths = state.npmPaths
  $db.del(`npmPaths.${action.data}`)
  return { npmPaths: omit(npmPaths, [action.data]) }
}

export function ACTION_CLEAR_NPM_PATHS(
  state: StoreStates,
  action: StoreAction<'ACTION_CLEAR_NPM_PATHS'>
): { npmPaths: object } {
  //   console.log({ state, action })
  return { npmPaths: {} }
}

declare global {
  interface StoreStates {
    npmPaths: NpmPaths
  }

  interface StoreActions {
    ACTION_ADD_NPM_PATHS: object
    ACTION_CLEAR_NPM_PATHS: object
    ACTION_DELETE_NPM_PATH: string
  }
}
