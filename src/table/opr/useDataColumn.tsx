import { checkPermission } from '../../utils/config'
import { NButton, NImage, NSpace, NSpin } from 'naive-ui'
import { ref, type VNode } from 'vue'
import type { ActionOption, TableColumn } from '../../../types/components'
import DataColumnCollet from './DataColumnCollet'
import OprButton from './useDataColumnButton'
import Pop from './useDataColumnPop'
import { createDialogOptions } from '../../utils/dialog'
import { getDialogInstance } from '../../utils/dialog'

export const rowIndexKey = (row: any, index: number): string =>
  row ? JSON.stringify(row) : String(index)

interface CollectParams {
  max: number
  width: number
}

export function createActionColumnJsx(
  defaultOption: ActionOption[],
  oprParams: Record<string, any> | null = null,
  collectParams?: boolean | CollectParams,
): TableColumn | undefined {
  // 粗滤计算操作栏占用宽度
  const defaultCollectParams: CollectParams = {
    max: 4,
    width: 80,
  }
  let collect: CollectParams | false = false
  if (typeof collectParams === 'boolean')
    collect = defaultCollectParams
  else if (typeof collectParams === 'object')
    collect = { ...defaultCollectParams, ...collectParams }

  console.log('collect', collect)
  console.log(Array.isArray(defaultOption))
  if (!Array.isArray(defaultOption)) {
    throw new TypeError('需要配置数组')
  }
  console.log('ddd')
  let actions: ActionOption[] = []
  let width = 0
  const filterAction: ActionOption[] = []
  const isLoading = false

  if (Array.isArray(defaultOption)) {
    actions = defaultOption
    actions.forEach((itm, idx) => {
      if (itm.permission) {
        if (checkPermission(itm.permission)) {
          if (!collectParams || (typeof collect === 'object' && idx < collect.max))
            width += (typeof itm?.label === 'string' ? itm?.label?.length : 10) * 12 + 36

          filterAction.push(itm)
        }
      }
      else {
        if (!collectParams || (typeof collect === 'object' && idx < collect.max))
          width += (typeof itm?.label === 'string' ? itm?.label?.length : 10) * 12 + 36
        filterAction.push(itm)
      }
    })
  }

  width = Math.max(80, width)
  width += isLoading ? 20 : 0

  if (collect)
    width += 2

  return filterAction.length
    ? {
      title: '操作',
      key: 'opr',
      fixed: 'right',
      align: 'left',
      width,
      ...oprParams,
      render(row: any, index: number): VNode {
        const vNodes = collect
          ? (
            <DataColumnCollet
              data={row}
              index={index}
              max={collect.max}
              options={filterAction}
            />
          )
          : (
            filterAction
              .map(
                (
                  {
                    isRender = () => true,
                    onClick = null,
                    mode = null,
                    disabled = false,
                    type = 'primary',
                    ...action
                  },
                  i,
                ) => {
                  return isRender?.(row)
                    ? (
                      mode === 'pop'
                        ? (
                          <Pop
                            onClick={onClick}
                            row={row}
                            index={index}
                            action={action}
                            key={rowIndexKey(row, index) + i}
                          >
                            <NButton
                              text
                              disabled={disabled && disabled(row)}
                              type={disabled && disabled(row) ? 'default' : type}
                              {...action}
                            >
                              {typeof action?.label === 'function'
                                ? action?.label(row)
                                : action?.label}
                            </NButton>
                          </Pop>
                        )
                        : (
                          <OprButton
                            row={row}
                            action={{
                              ...action,
                              disabled,
                              onClick,
                              type,
                            }}
                            index={index}
                            key={rowIndexKey(row, index) + i}
                          />
                        )
                    )
                    : undefined
                },
              )
              .filter((v): v is VNode => v !== undefined)
          )
        return (oprParams as any)?.isRender
          ? (
            (oprParams as any)?.render(row)
          )
          : (
            <NSpace
              align="center"
              wrap-item={false}
              size={18}
              key={rowIndexKey(row, index)}
            >
              {vNodes}
            </NSpace>
          )
      },
    }
    : undefined
}

/**
 * 创建二维码弹窗
 * @param row - 行数据
 * @param fn - 获取二维码的函数
 * @returns Promise<boolean>
 * 
 * @example
 * import { useQRCode } from '@xmszm/core'
 * 
 * export default defineComponent({
 *   setup() {
 *     const showQR = useQRCode()
 *     
 *     const handleShowQR = (row) => {
 *       showQR(row, async () => {
 *         return await getQRCode(row.id)
 *       })
 *     }
 *     
 *     return { handleShowQR }
 *   }
 * })
 */
export async function createQRCode(
  row: any,
  fn: (() => Promise<string> | string) | null = null,
): Promise<boolean> {
  const dialogInstance = getDialogInstance()
  
  if (!dialogInstance) {
    throw new Error('无法获取 dialog 实例。请使用 useQRCode hook 或在组件中通过 setupConfig 注册 dialog 实例。')
  }
  
  const code = ref<string | null>(null)
  const loading = ref(false)
  
  const dialogOptions = createDialogOptions({
    type: 'info',
    showIcon: false,
    style: {
      width: '350px',
      height: '350px',
    },
    content: () => (
      <div className="qr-box">
        {loading.value ? <NSpin class="qr-spin" show /> : ''}
        <div className="qr-img">
          <NImage src={code.value} style={{ width: '100%' }} />
        </div>
        <div className="qr-title">{loading.value ? '' : row.name}</div>
      </div>
    ),
  }, dialogInstance)
  
  dialogInstance.info(dialogOptions)
  
  if (fn) {
    loading.value = true
    code.value = await fn()
    loading.value = false
  }
  return true
}
