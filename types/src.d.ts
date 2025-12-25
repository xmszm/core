/**
 * @/ 路径别名类型声明
 * 
 * 此文件为 @xmszm/core 包中使用的 @/ 路径别名提供 TypeScript 类型支持
 * 使用方项目需要提供对应的实现文件
 * 
 * @see LOCAL_DEPENDENCIES.md 了解详细的使用说明
 */

/**
 * @/utils/permission 模块类型声明
 * 
 * 权限检查函数模块
 * 使用方需要在项目的 src/utils/permission.js 或 src/utils/permission.ts 中实现
 * 
 * @example
 * // src/utils/permission.ts
 * export function hasPermission(permission: string): boolean {
 *   const permissions = getPermissions() // 你的权限获取逻辑
 *   return permissions.includes(permission)
 * }
 */
declare module '@/utils/permission' {
  /**
   * 权限检查函数
   * @param permission - 权限标识字符串
   * @returns 是否拥有该权限
   */
  export function hasPermission(permission: string): boolean
}

/**
 * @/utils/request 模块类型声明
 * 
 * 请求配置模块
 * 使用方需要在项目的 src/utils/request.js 或 src/utils/request.ts 中实现
 * 
 * @example
 * // src/utils/request.ts
 * export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
 */
declare module '@/utils/request' {
  /**
   * API 基础地址
   * 用于构建完整的请求 URL
   */
  export const BASE_URL: string
}

// 声明全局 $dialog（如果存在）
// 外部可以通过 window.$dialog 或直接 $dialog 注入 dialog 实例
declare global {
  // eslint-disable-next-line no-var
  var $dialog: import('naive-ui').DialogApi | undefined
}
