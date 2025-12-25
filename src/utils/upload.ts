/**
 * 上传数据类型
 * @import {AxiosRequestConfig} 'axios'
 * @typedef {object} UploadData
 * @property {string} url - 文件上传后的访问地址
 * // 可根据实际需求扩展更多字段
 * @typedef {Promise<import('axios').AxiosResponse<UploadData>>} UploadDataPromise
 */

import { getBaseURL, getUploadMethod, setupConfig } from './config'

/**
 * 注册上传方法（兼容旧版 API）
 * @param {function(AxiosRequestConfig): UploadDataPromise} fn - 实际的上传实现函数
 * @deprecated 请使用 setupConfig({ uploadMethod: fn }) 代替
 */
export function registryUpload(fn) {
  setupConfig({ uploadMethod: fn })
}

/**
 * 自定义上传方法，调用已注册的上传实现
 * @param {AxiosRequestConfig} args - 上传参数
 * @returns {UploadDataPromise} 上传结果Promise
 */
export function customUpload(...args: any[]) {
  const uploadMethod = getUploadMethod()
  if (typeof uploadMethod !== 'function') {
    throw new TypeError('请先通过 setupConfig({ uploadMethod: fn }) 或 registryUpload(fn) 注册上传实现')
  }
  return (uploadMethod as any)(...args)
}

/**
 * 获取文件 URL
 * @param {string} url - 文件路径
 * @param {number|null} ossSize - OSS 样式尺寸
 * @returns {string} 完整的文件 URL
 */
export function getFileUrl(url: string, ossSize: number | null = null) {
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

