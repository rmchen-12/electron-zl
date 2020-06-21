/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询npm-auth规则
 * @param params
 * @param options
 */
export function getUserInfo(
  params?: getUserInfoUsingGET.Params,
  options?: RequestOptions
): Promise<getUserInfoUsingGET.Response> {
  return $api.request('/', params, options)
}
