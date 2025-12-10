import { hasPermission } from '@/utils/permission'
import { NButton, NImage, NSpace, NSpin } from 'naive-ui'
import { ref } from 'vue'
import DataColumnCollet from './DataColumnCollet.jsx'
import OprButton from './useDataColumnButton.jsx'
import Pop from './useDataColumnPop.jsx'

export const rowIndexKey = (row, index) => (row ? JSON.stringify(row) : index)

export function createActionColumnJsx(
  defaultOption,
  oprParams = null,
  collectParams,
) {
  // 粗滤计算操作栏占用宽度
  // 粗滤计算操作栏占用宽度
  const defaultCollectParams = {
    max: 4,
    width: 80,
  }
  let collect = false
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
  let actions = []
  let width = 0
  const filterAction = []
  const isLoading = false

  if (Array.isArray(defaultOption)) {
    actions = defaultOption
    actions.forEach((itm, idx) => {
      if (itm.permission) {
        if (hasPermission(itm.permission)) {
          if (!collectParams || idx < collect.max)
            width += itm?.label?.length * 12 + 36

          filterAction.push(itm)
        }
      }
      else {
        if (!collectParams || idx < collect.max)
          width += itm?.label?.length * 12 + 36
        filterAction.push(itm)
      }
    })

    // for (const item of actions) {
    //   if (!isLoading && item?.loading) isLoading = true
    //   if (item.permission && item?.label) {
    //     if (hasPermission(item.permission)) {
    //       width += item?.label?.length * 12 + 36
    //       filterAction.push(item)
    //     }
    //   } else if (item?.label) {
    //     width += item?.label?.length * 12 + 36
    //     filterAction.push(item)
    //   }
    // }
  }

  width = Math.max(80, width)
  // return filterAction.length
  //   ?
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
        render(row, index) {
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
                  .filter(v => v)
              )
          return oprParams?.isRender
            ? (
                oprParams?.render(row)
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

export async function createQRCode(row, fn = null) {
  const code = ref(null)
  const loading = ref(false)
  $dialog.info({
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
  })
  if (fn) {
    loading.value = true
    code.value = await fn()
    loading.value = false
  }
  return true
}
