/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询所有网址链接
 * @param params
 * @param options
 */
export function querySites(
  params?: querySiteUsingGET.Params,
  options?: RequestOptions
): Promise<querySiteUsingGET.Response> {
  return $api.request('/sites', params, options)
}

/**
 * 增加一条分类
 * @param params
 * @param options
 */
export function addSite(
  params?: addSiteUsingPOST.Params,
  options?: RequestOptions
): Promise<addSiteUsingPOST.Response> {
  return $api.request('/sites', params, options)
}

/**
 * 删除一条分类
 * @param params
 * @param options
 */
export function deleteSite(
  id: number,
  params?: deleteSiteUsingDELETE.Params,
  options?: RequestOptions
): Promise<deleteSiteUsingDELETE.Response> {
  return $api.request(`/sites/${id}`, params, options)
}

/**
 * 更新一条分类信息
 * @param params
 * @param options
 */
export function updateSite(
  id: number,
  params?: updateSiteUsingPUT.Params,
  options?: RequestOptions
): Promise<updateSiteUsingPUT.Response> {
  return $api.request(`/sites/${id}`, params, options)
}
