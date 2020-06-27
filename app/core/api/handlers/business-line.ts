/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询所有业务线
 * @param params
 * @param options
 */
export function queryBusinessLines(
  params?: queryBusinessLineUsingGET.Params,
  options?: RequestOptions
): Promise<queryBusinessLineUsingGET.Response> {
  return $api.request('/businessLines', params, options)
}

/**
 * 增加一条业务线
 * @param params
 * @param options
 */
export function addBusinessLine(
  params?: addBusinessLineUsingPOST.Params,
  options?: RequestOptions
): Promise<addBusinessLineUsingPOST.Response> {
  return $api.request('/businessLines', params, options)
}

/**
 * 删除一条业务线
 * @param params
 * @param options
 */
export function deleteBusinessLine(
  id: number,
  params?: deleteBusinessLineUsingDELETE.Params,
  options?: RequestOptions
): Promise<deleteBusinessLineUsingDELETE.Response> {
  return $api.request(`/businessLines/${id}`, params, options)
}

/**
 * 更新一条业务线信息
 * @param params
 * @param options
 */
export function updateBusinessLine(
  id: number,
  params?: updateBusinessLineUsingPUT.Params,
  options?: RequestOptions
): Promise<updateBusinessLineUsingPUT.Response> {
  return $api.request(`/businessLines/${id}`, params, options)
}
