/**
 * 详细接口类型定义在: @/typescript/api-interface/*
 */

/**
 * 查询所有网址链接
 * @param params
 * @param options
 */
export function queryProjectTemplate(
  params?: queryProjectTemplateUsingGET.Params,
  options?: RequestOptions
): Promise<queryProjectTemplateUsingGET.Response> {
  return $api.request('/projectTemplates', params, options)
}

/**
 * 增加一条分类
 * @param params
 * @param options
 */
export function addProjectTemplate(
  params?: addProjectTemplateUsingPOST.Params,
  options?: RequestOptions
): Promise<addProjectTemplateUsingPOST.Response> {
  return $api.request('/projectTemplates', params, options)
}

/**
 * 删除一条分类
 * @param params
 * @param options
 */
export function deleteProjectTemplate(
  id: number,
  params?: deleteProjectTemplateUsingDELETE.Params,
  options?: RequestOptions
): Promise<deleteProjectTemplateUsingDELETE.Response> {
  return $api.request(`/projectTemplates/${id}`, params, options)
}

/**
 * 更新一条分类信息
 * @param params
 * @param options
 */
export function updateProjectTemplate(
  id: number,
  params?: updateProjectTemplateUsingPUT.Params,
  options?: RequestOptions
): Promise<updateProjectTemplateUsingPUT.Response> {
  return $api.request(`/projectTemplates/${id}`, params, options)
}
