/**
 * useQRCode Hook
 * 在组件中使用 createQRCode 的便捷方式
 */
import { useDialog } from 'naive-ui'
import { createQRCode } from './useDataColumn'
import { registerDialogInstance } from '../../utils/config'

/**
 * 使用 QRCode 的 Hook
 * @returns {Function} showQRCode 函数
 * 
 * @example
 * import { useQRCode } from '@xmszm/core'
 * 
 * export default defineComponent({
 *   setup() {
 *     const showQRCode = useQRCode()
 *     
 *     const handleShowQR = (row) => {
 *       showQRCode(row, async () => {
 *         return await getQRCode(row.id)
 *       })
 *     }
 *     
 *     return { handleShowQR }
 *   }
 * })
 */
export function useQRCode() {
  const dialog = useDialog()
  
  // 注册 dialog 实例到全局配置
  registerDialogInstance(dialog)
  
  return (row, fn) => {
    return createQRCode(row, fn)
  }
}

