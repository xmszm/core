import type { DirectiveBinding } from 'vue'
import { checkPermission } from '../utils/config'

/**
 * 权限指令
 * 根据权限标识控制元素的显示/隐藏
 * 
 * @example
 * <div v-corePermission="'user:edit'">编辑按钮</div>
 * <div v-corePermission="['user:edit', 'user:view']">需要编辑或查看权限</div>
 */
export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const permission = binding.value

    if (!permission) {
      // 如果没有权限标识，默认显示
      return
    }

    // 支持字符串或数组
    const permissions = Array.isArray(permission) ? permission : [permission]

    // 检查是否有任一权限
    const hasPermission = permissions.some(p => checkPermission(p))

    if (!hasPermission) {
      // 没有权限时隐藏元素
      el.style.display = 'none'
      // 保存原始 display 值，以便后续恢复
      ;(el as any)._originalDisplay = el.style.display || ''
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const permission = binding.value

    if (!permission) {
      // 恢复显示
      if ((el as any)._originalDisplay !== undefined) {
        el.style.display = (el as any)._originalDisplay || ''
      } else {
        el.style.display = ''
      }
      return
    }

    const permissions = Array.isArray(permission) ? permission : [permission]
    const hasPermission = permissions.some(p => checkPermission(p))

    if (!hasPermission) {
      el.style.display = 'none'
    } else {
      // 恢复显示
      if ((el as any)._originalDisplay !== undefined) {
        el.style.display = (el as any)._originalDisplay || ''
      } else {
        el.style.display = ''
      }
    }
  },

  unmounted(el: HTMLElement) {
    // 清理
    delete (el as any)._originalDisplay
  },
}
