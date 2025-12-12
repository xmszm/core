/**
 * 库插件
 * 用于注册指令等全局功能
 */
import type { App } from 'vue'
import { registerDirectives } from '../directives/auto-register'

interface PluginOptions {
  [key: string]: any
}

/**
 * 安装插件
 * @param app - Vue 应用实例
 * @param options - 插件选项
 */
export function install(app: App, options: PluginOptions = {}): void {
  // 注册所有指令（使用 corePermission 名称）
  registerDirectives(app)
}

export default {
  install,
}
