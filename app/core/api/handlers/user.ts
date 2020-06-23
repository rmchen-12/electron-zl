/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询用户信息
 * @param params
 * @param options
 */
export function getUserInfo(
  params?: getUserInfoUsingGET.Params,
  options?: RequestOptions
): Promise<getUserInfoUsingGET.Response> {
  return $api.request('/', params, options)
}
