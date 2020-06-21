export const initialState = {
  user: {},
}

export function ACTION_ADD_USER(state: StoreStates, action: StoreAction<'ACTION_ADD_USER'>): { user: object } {
  console.log({ state, action })
  return { user: { ...state.user, ...action.data } }
}

export function ACTION_CLEAR_USER(
  state: StoreStates,
  action: StoreAction<'ACTION_CLEAR_USER'>
): { user: object } {
  console.log({ state, action })
  return { user: {} }
}

declare global {
  interface StoreStates {
    user: getUserInfoUsingGET.Response['response']
  }

  interface StoreActions {
    ACTION_ADD_USER: object
  }

  interface StoreActions {
    ACTION_CLEAR_USER: object
  }
}
