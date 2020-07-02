import omit from 'lodash/omit'
import slash from 'slash'

export const initialState = {
  workPaths: {},
}

export function ACTION_ADD_WORK_PATHS(
  state: StoreStates,
  action: StoreAction<'ACTION_ADD_WORK_PATHS'>
): { workPaths: object } {
  // db里也存一份，app重启动时需要用来初始化
  for (const [key, value] of Object.entries(action.data)) {
    if (!value) continue
    $db.set(`workPaths.${key}`, slash(value))
  }
  return { workPaths: { ...state.workPaths, ...action.data } }
}

export function ACTION_DELETE_WORK_PATH(
  state: StoreStates,
  action: StoreAction<'ACTION_DELETE_WORK_PATH'>
): { workPaths: object } {
  const workPaths = state.workPaths
  $db.del(`workPaths.${action.data}`)
  return { workPaths: omit(workPaths, [action.data]) }
}

export function ACTION_CLEAR_WORK_PATHS(
  state: StoreStates,
  action: StoreAction<'ACTION_CLEAR_WORK_PATHS'>
): { workPaths: object } {
  //   console.log({ state, action })
  return { workPaths: {} }
}

declare global {
  interface StoreStates {
    workPaths: WorkPaths
  }

  interface StoreActions {
    ACTION_ADD_WORK_PATHS: object
    ACTION_CLEAR_WORK_PATHS: object
    ACTION_DELETE_WORK_PATH: string
  }
}
