/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询所有网址链接
 * @param params
 * @param options
 */
export function querySiteCategories(
  params?: querySiteCategoriesUsingGET.Params,
  options?: RequestOptions
): Promise<querySiteCategoriesUsingGET.Response> {
  return $api.request('/siteCategories', params, options)
}

/**
 * 增加一条分类
 * @param params
 * @param options
 */
export function addSiteCategory(
  params?: addSiteCategoryUsingPOST.Params,
  options?: RequestOptions
): Promise<addSiteCategoryUsingPOST.Response> {
  return $api.request('/siteCategories', params, options)
}

/**
 * 删除一条分类
 * @param params
 * @param options
 */
export function deleteSiteCategory(
  params?: deleteSiteCategoryUsingDELETE.Params,
  options?: RequestOptions
): Promise<deleteSiteCategoryUsingDELETE.Response> {
  return $api.request('/siteCategories', params, options)
}

/**
 * 更新一条分类信息
 * @param params
 * @param options
 */
export function updateSiteCategory(
  params?: updateSiteCategoryUsingPUT.Params,
  options?: RequestOptions
): Promise<updateSiteCategoryUsingPUT.Response> {
  return $api.request('/siteCategories', params, options)
}
