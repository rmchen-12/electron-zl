/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询当前登录用户信息
 * @param params
 * @param options
 */
export function getUserInfo(
  params?: getUserInfoUsingGET.Params,
  options?: RequestOptions
): Promise<getUserInfoUsingGET.Response> {
  return $api.request('/', params, options)
}

/**
 * 查询所有用户
 * @param params
 * @param options
 */
export function queryUser(
  params?: queryUserUsingGET.Params,
  options?: RequestOptions
): Promise<queryUserUsingGET.Response> {
  return $api.request('/users', params, options)
}

/**
 * 更新一条用户信息
 * @param params
 * @param options
 */
export function updateUser(
  id: number,
  params?: updateUserUsingPUT.Params,
  options?: RequestOptions
): Promise<updateUserUsingPUT.Response> {
  return $api.request(`/users/${id}`, params, options)
}

/**
 * 增加一条分类
 * @param params
 * @param options
 */
// export function addUser(
//   params?: addUserUsingPOST.Params,
//   options?: RequestOptions
// ): Promise<addUserUsingPOST.Response> {
//   return $api.request('/users', params, options)
// }

/**
 * 删除一条分类
 * @param params
 * @param options
 */
// export function deleteUser(
//   params?: deleteUserUsingDELETE.Params,
//   options?: RequestOptions
// ): Promise<deleteUserUsingDELETE.Response> {
//   return $api.request('/users', params, options)
// }
