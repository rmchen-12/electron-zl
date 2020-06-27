/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询所有项目模板
 * @param params
 * @param options
 */
export function queryTemplateType(
  params?: queryTemplateTypeUsingGET.Params,
  options?: RequestOptions
): Promise<queryTemplateTypeUsingGET.Response> {
  return $api.request('/templateTypes', params, options)
}

/**
 * 增加一条分类
 * @param params
 * @param options
 */
export function addTemplateType(
  params?: addTemplateTypeUsingPOST.Params,
  options?: RequestOptions
): Promise<addTemplateTypeUsingPOST.Response> {
  return $api.request('/templateTypes', params, options)
}

/**
 * 删除一条分类
 * @param params
 * @param options
 */
export function deleteTemplateType(
  id: number,
  params?: deleteTemplateTypeUsingDELETE.Params,
  options?: RequestOptions
): Promise<deleteTemplateTypeUsingDELETE.Response> {
  return $api.request(`/templateTypes/${id}`, params, options)
}

/**
 * 更新一条分类信息
 * @param params
 * @param options
 */
export function updateTemplateType(
  id: number,
  params?: updateTemplateTypeUsingPUT.Params,
  options?: RequestOptions
): Promise<updateTemplateTypeUsingPUT.Response> {
  return $api.request(`/templateTypes/${id}`, params, options)
}
