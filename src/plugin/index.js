/**
 * 库插件
 * 用于注册指令等全局功能
 */
import { registerDirectives } from '../directives/auto-register'

/**
 * 安装插件
 * @param {Object} app - Vue 应用实例
 * @param {Object} options - 插件选项
 */
export function install(app, options = {}) {
  // 注册所有指令（使用 corePermission 名称）
  registerDirectives(app)
}

export default {
  install,
}

