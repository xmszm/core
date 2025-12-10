/**
 * 上传数据类型
 * @import {AxiosRequestConfig} 'axios'
 * @typedef {object} UploadData
 * @property {string} url - 文件上传后的访问地址
 * // 可根据实际需求扩展更多字段
 * @typedef {Promise<import('axios').AxiosResponse<UploadData>>} UploadDataPromise
 */

import { BASE_URL } from '@/utils/request'

/**
 * 实际的上传实现函数
 * @type {null | ((AxiosRequestConfig) => UploadDataPromise)}
 */
let uploadMethod = null

/**
 * 注册上传方法
 * @param {function(AxiosRequestConfig): UploadDataPromise} fn - 实际的上传实现函数
 */
export function registryUpload(fn) {
  uploadMethod = fn
}

/**
 * 自定义上传方法，调用已注册的上传实现
 * @param {AxiosRequestConfig} args - 上传参数
 * @returns {UploadDataPromise} 上传结果Promise
 */
export function customUpload(...args) {
  if (typeof uploadMethod !== 'function') {
    throw new TypeError('请先通过 registryUpload(fn) 注册上传实现')
  }
  return uploadMethod(...args)
}

export function getFileUrl(url, ossSize = null) {
  if (url && !url?.startsWith('http')) {
    return !ossSize
      ? `${BASE_URL}${url}`
      : `${BASE_URL}${url}?x-oss-process=style/w${ossSize}`
  }
  return url
}

