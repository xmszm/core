/**
 * 上传数据类型
 */
import { getBaseURL, getUploadMethod, setupConfig } from './config'

/**
 * 注册上传方法（兼容旧版 API）
 * @param fn - 实际的上传实现函数
 * @deprecated 请使用 setupConfig({ uploadMethod: fn }) 代替
 */
export function registryUpload(fn: (config: any) => Promise<any>): void {
  setupConfig({ uploadMethod: fn })
}

/**
 * 自定义上传方法，调用已注册的上传实现
 * @param args - 上传参数
 * @returns 上传结果Promise
 */
export function customUpload(...args: any[]): Promise<any> {
  const uploadMethod = getUploadMethod()
  if (typeof uploadMethod !== 'function') {
    throw new TypeError('请先通过 setupConfig({ uploadMethod: fn }) 或 registryUpload(fn) 注册上传实现')
  }
  return uploadMethod(...args)
}

/**
 * 获取文件 URL
 * @param url - 文件路径
 * @param ossSize - OSS 样式尺寸
 * @returns 完整的文件 URL
 */
export function getFileUrl(url?: string, ossSize: number | null = null): string | undefined {
  if (url && !url?.startsWith('http')) {
    const baseURL = getBaseURL()
    if (!baseURL) {
      console.warn('BASE_URL 未配置，返回原始 URL。请使用 setupConfig({ baseURL: "..." }) 配置。')
      return url
    }
    return !ossSize
      ? `${baseURL}${url}`
      : `${baseURL}${url}?x-oss-process=style/w${ossSize}`
  }
  return url
}
