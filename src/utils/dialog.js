/**
 * Dialog 工具函数
 * 使用 useDialog 替代全局 $dialog
 */
import { getCurrentInstance } from 'vue'
import { useDialog } from 'naive-ui'
import { getDialogConfig, getDialogInstance as getRegisteredDialogInstance } from './config'

/**
 * 获取 dialog 实例
 * 优先从配置中获取（如果已注册），否则从当前组件实例获取
 * @returns {Object|null} dialog 实例
 */
export function getDialogInstance() {
  // 1. 优先从配置中获取（如果外部已注册）
  const registered = getRegisteredDialogInstance()
  if (registered) {
    return registered
  }

  // 2. 尝试从当前组件实例获取
  try {
    const instance = getCurrentInstance()
    if (instance?.appContext?.app) {
      // 在组件上下文中，尝试通过 app 实例获取 dialog
      // 注意：useDialog 必须在 setup 中调用，这里我们无法直接调用
      // 所以需要通过其他方式获取
      // 实际上，如果不在组件上下文中，这里会返回 null
      // 建议在组件中使用 useCommonDialog hook，或通过 setupConfig 注册
      return null
    }
  } catch (e) {
    // 忽略错误
  }

  return null
}

/**
 * 创建 dialog 配置，应用主题色继承设置
 * @param {Object} options - dialog 选项
 * @param {Object} dialogInstance - dialog 实例（从 useDialog 获取）
 * @returns {Object} 处理后的 dialog 选项
 */
export function createDialogOptions(options = {}, dialogInstance = null) {
  const dialogConfig = getDialogConfig()

  // 如果配置了不继承主题色，则添加 themeOverrides
  if (!dialogConfig.inheritTheme && dialogConfig.themeOverrides) {
    return {
      ...options,
      themeOverrides: {
        ...dialogConfig.themeOverrides,
        ...(options.themeOverrides || {}),
      },
    }
  }

  return options
}

/**
 * 使用 dialog 的工具函数
 * 在组件中使用：const dialog = useDialog(); createDialog(dialog, options)
 * @param {Object} dialogInstance - dialog 实例（从 useDialog 获取）
 * @param {Object} options - dialog 选项
 * @returns {Object} dialog 返回的对象
 */
export function createDialog(dialogInstance, options = {}) {
  if (!dialogInstance) {
    throw new Error('dialogInstance 是必需的。请在组件中使用 useDialog() 获取实例，然后传递给此函数。')
  }

  const finalOptions = createDialogOptions(options, dialogInstance)
  return dialogInstance.create(finalOptions)
}

/**
 * Dialog 快捷方法
 * @param {Object} dialogInstance - dialog 实例
 */
export function createDialogMethods(dialogInstance) {
  if (!dialogInstance) {
    throw new Error('dialogInstance 是必需的。请在组件中使用 useDialog() 获取实例。')
  }

  return {
    info: (options) => {
      const finalOptions = createDialogOptions({ type: 'info', ...options }, dialogInstance)
      return dialogInstance.info(finalOptions)
    },
    success: (options) => {
      const finalOptions = createDialogOptions({ type: 'success', ...options }, dialogInstance)
      return dialogInstance.success(finalOptions)
    },
    warning: (options) => {
      const finalOptions = createDialogOptions({ type: 'warning', ...options }, dialogInstance)
      return dialogInstance.warning(finalOptions)
    },
    error: (options) => {
      const finalOptions = createDialogOptions({ type: 'error', ...options }, dialogInstance)
      return dialogInstance.error(finalOptions)
    },
    create: (options) => {
      const finalOptions = createDialogOptions(options, dialogInstance)
      return dialogInstance.create(finalOptions)
    },
  }
}

