/**
 * 全局配置系统
 * 用于统一管理库的外部依赖配置
 */

interface ConfigOptions {
  baseURL?: string
  hasPermission?: (permission: string) => boolean
  uploadMethod?: (config: any) => Promise<any>
  dialog?: {
    instance?: any
    inheritTheme?: boolean
    themeOverrides?: any
  }
}

interface Config {
  baseURL: string
  hasPermission: ((permission: string) => boolean) | null
  uploadMethod: ((config: any) => Promise<any>) | null
  dialog: {
    instance: any
    inheritTheme: boolean
    themeOverrides: any
  }
}

/**
 * 配置对象
 */
const config: Config = {
  // API 基础地址
  baseURL: '',

  // 权限检查函数
  hasPermission: null,

  // 上传方法
  uploadMethod: null,

  // Dialog 配置
  dialog: {
    // Dialog 实例（可通过 setupConfig 注册，或内部自动获取）
    instance: null,
    // 是否继承外部定义的主题色（默认 true）
    inheritTheme: true,
    // 主题色覆盖（当 inheritTheme 为 false 时使用）
    themeOverrides: null,
  },
}

/**
 * 初始化配置
 * @param options - 配置选项
 * @example
 * import { setupConfig } from '@xmszm/core'
 * 
 * setupConfig({
 *   baseURL: 'https://api.example.com',
 *   hasPermission: (permission) => {
 *     const permissions = getPermissions() // 你的权限获取逻辑
 *     return permissions.includes(permission)
 *   },
 *   uploadMethod: (config) => axios.request(config),
 *   dialog: {
 *     inheritTheme: false, // 不继承外部主题色
 *     themeOverrides: {
 *       // 自定义主题色
 *     }
 *   }
 * })
 */
export function setupConfig(options: ConfigOptions = {}): Config {
  if (options.baseURL !== undefined) {
    config.baseURL = options.baseURL
  }

  if (options.hasPermission !== undefined) {
    if (typeof options.hasPermission !== 'function') {
      throw new TypeError('hasPermission 必须是一个函数')
    }
    config.hasPermission = options.hasPermission
  }

  if (options.uploadMethod !== undefined) {
    if (typeof options.uploadMethod !== 'function') {
      throw new TypeError('uploadMethod 必须是一个函数')
    }
    config.uploadMethod = options.uploadMethod
  }

  if (options.dialog !== undefined) {
    if (typeof options.dialog !== 'object') {
      throw new TypeError('dialog 必须是一个对象')
    }
    if (options.dialog.instance !== undefined) {
      config.dialog.instance = options.dialog.instance
    }
    if (options.dialog.inheritTheme !== undefined) {
      config.dialog.inheritTheme = options.dialog.inheritTheme
    }
    if (options.dialog.themeOverrides !== undefined) {
      config.dialog.themeOverrides = options.dialog.themeOverrides
    }
  }

  return config
}

/**
 * 获取配置
 * @returns 配置对象
 */
export function getConfig(): Config {
  return { ...config }
}

/**
 * 获取 BASE_URL
 * @returns API 基础地址
 */
export function getBaseURL(): string {
  return config.baseURL
}

/**
 * 获取权限检查函数
 * @returns 权限检查函数或 null
 */
export function getHasPermission(): ((permission: string) => boolean) | null {
  return config.hasPermission
}

/**
 * 获取上传方法
 * @returns 上传方法或 null
 */
export function getUploadMethod(): ((config: any) => Promise<any>) | null {
  return config.uploadMethod
}

/**
 * 获取 Dialog 配置
 * @returns Dialog 配置对象
 */
export function getDialogConfig(): Config['dialog'] {
  return { ...config.dialog }
}

/**
 * 注册 Dialog 实例（可选，如果不注册则内部自动获取）
 * @param dialogInstance - dialog 实例（从 useDialog 获取）
 */
export function registerDialogInstance(dialogInstance: any): void {
  config.dialog.instance = dialogInstance
}

/**
 * 获取 Dialog 实例
 * @returns Dialog 实例或 null
 */
export function getDialogInstance(): any {
  return config.dialog.instance
}

/**
 * 检查权限（带默认值）
 * @param permission - 权限标识
 * @returns 是否拥有该权限
 */
export function checkPermission(permission: string): boolean {
  if (config.hasPermission) {
    return config.hasPermission(permission)
  }
  // 默认返回 true，避免未配置时阻塞功能
  console.warn('hasPermission 未配置，默认返回 true。请使用 setupConfig 配置权限检查函数。')
  return true
}

// 兼容旧版 API（向后兼容）
// 注意：registryUpload 在 upload.js 中导出，这里不重复导出

export default {
  setupConfig,
  getConfig,
  getBaseURL,
  getHasPermission,
  getUploadMethod,
  checkPermission,
  getDialogConfig,
  registerDialogInstance,
  getDialogInstance,
}
