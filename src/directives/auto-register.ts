/**
 * 自动注册指令
 * 在导入库时自动注册所有指令，无需手动配置
 */
import type { App } from 'vue'
import { getCurrentInstance } from 'vue'
import { permissionDirective } from './permission'

// 全局应用实例缓存
let globalApp: App | null = null

/**
 * 注册所有指令到应用实例
 * @param app - Vue 应用实例
 */
export function registerDirectives(app: App | null): void {
  if (!app) return

  // 缓存应用实例
  globalApp = app

  // 只注册内部的 corePermission 指令
  // 外部如果需要 v-permission，可以自己注册，与内部无关
  if (!(app as any)._context?.directives?.corePermission) {
    app.directive('corePermission', permissionDirective)
  }
}

/**
 * 尝试自动注册指令
 * 通过 getCurrentInstance 获取应用实例并注册
 */
export function autoRegisterDirectives(): boolean {
  try {
    // 动态导入 vue，避免在构建时出错
    const vue = typeof require !== 'undefined' ? require('vue') : null
    if (!vue) return false

    const { getCurrentInstance: getInstance } = vue
    const instance = getInstance?.()

    if (instance?.appContext?.app) {
      registerDirectives(instance.appContext.app)
      return true
    }
  } catch (e) {
    // 忽略错误，可能不在组件上下文中
  }

  return false
}

/**
 * 获取全局应用实例
 */
export function getGlobalApp(): App | null {
  return globalApp
}
