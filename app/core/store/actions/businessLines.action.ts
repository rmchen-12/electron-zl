export const initialState = {
  businessLines: [],
}

export function ACTION_ADD_BUSINESS_LINES(
  state: StoreStates,
  action: StoreAction<'ACTION_ADD_BUSINESS_LINES'>
): { businessLines: queryBusinessLineUsingGET.BusinessLine[] } {
  //   console.log({ state, action })
  return { businessLines: [...state.businessLines, ...action.data] }
}

export function ACTION_CLEAR_BUSINESS_LINES(
  state: StoreStates,
  action: StoreAction<'ACTION_CLEAR_BUSINESS_LINES'>
): { businessLines: queryBusinessLineUsingGET.BusinessLine[] } {
  //   console.log({ state, action })
  return { businessLines: [] }
}

declare global {
  interface StoreStates {
    businessLines: queryBusinessLineUsingGET.BusinessLine[]
  }

  interface StoreActions {
    ACTION_ADD_BUSINESS_LINES: queryBusinessLineUsingGET.BusinessLine[]
    ACTION_CLEAR_BUSINESS_LINES: queryBusinessLineUsingGET.BusinessLine[]
  }
}
