/**
 * useCommonDialog Hook
 * 在组件中使用 commonDialogMethod 的便捷方式
 */
import { useDialog } from 'naive-ui'
import { commonDialogMethod } from './commonDialog'
import { registerDialogInstance } from '../utils/config'

/**
 * 使用 commonDialog 的 Hook
 * @returns {Function} openDialog 函数
 * 
 * @example
 * import { useCommonDialog } from '@xmszm/core'
 * 
 * export default defineComponent({
 *   setup() {
 *     const openDialog = useCommonDialog()
 *     
 *     const handleEdit = () => {
 *       openDialog({
 *         title: '编辑',
 *         options: [...],
 *       })
 *     }
 *     
 *     return { handleEdit }
 *   }
 * })
 */
export function useCommonDialog() {
  const dialog = useDialog()

  // 注册 dialog 实例到全局配置，这样 commonDialogMethod 可以直接使用
  registerDialogInstance(dialog)

  return (options, dialogProps) => {
    return commonDialogMethod(options, dialogProps)
  }
}

