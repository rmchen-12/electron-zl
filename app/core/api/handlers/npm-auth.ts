/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询npm-auth规则
 * @param params
 * @param options
 */
export function queryNpmAuth(
  params?: queryNpmAuthUsingGET.Params,
  options?: RequestOptions
): Promise<queryNpmAuthUsingGET.Response> {
  return $api.request('/npmAuth', params, options)
}

/**
 * 更新npm-auth规则
 * @param params
 * @param options
 */
export function updateNpmAuth(
  params?: updateNpmAuthUsingPUT.Params,
  options?: RequestOptions
): Promise<updateNpmAuthUsingPUT.Response> {
  return $api.request('/npmAuth/update', params, options)
}
