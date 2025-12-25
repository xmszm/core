import { NButton, NSpace, useDialog, createDiscreteApi } from 'naive-ui'
import type { DialogApi } from 'naive-ui'
import { reactive, ref, unref, defineComponent } from 'vue'
import type { Ref, VNode } from 'vue'
import type { CommonDialogOptions, DialogAction } from '../../types/components'
import type { CommonDialogResult } from '../../types'
import DataForm from '../form/DataForm.vue'
import { dialogDefaultOption } from './utils/dialog'
import './style/commonDialog.less'

// 声明全局 $dialog 变量（外部可能注入）
declare global {
  // eslint-disable-next-line no-var
  var $dialog: DialogApi | undefined
}

// 全局缓存 dialog 实例，避免重复创建离散 API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalDialogInstance: any = null
let discreteDialogFactory: { dialog: any } | null = null

function getDialogInstanceOnce(): any {
  if (globalDialogInstance)
    return globalDialogInstance

  // 1. 检查全局 $dialog
  if (typeof $dialog !== 'undefined' && $dialog) {
    globalDialogInstance = $dialog
    return globalDialogInstance
  }

  // 2. 组件上下文中尝试 useDialog（若无上下文会抛错）
  try {
    const dialog = useDialog()
    if (dialog) {
      globalDialogInstance = dialog
      return globalDialogInstance
    }
  }
  catch (e) {
    // 忽略，继续尝试离散 API
  }

  // 3. 使用离散 API，且只创建一次
  if (!discreteDialogFactory) {
    const { dialog } = createDiscreteApi(['dialog'])
    discreteDialogFactory = { dialog }
  }
  globalDialogInstance = discreteDialogFactory.dialog
  return globalDialogInstance
}

/**
 * 集成填写表单功能的弹窗
 * @param param - 弹窗配置选项
 * @param dialogProps - 传递给 NDialog 的属性
 * @returns 弹窗控制对象 {cancel, setValue, model, modeEnum}
 */
export function commonDialogMethod(
  {
    title = '',
    noTitle = false,
    titleFull = null,
    options = [],
    mode = 'add',
    modeEnum = {},
    labelField = 'label',
    isNo = true,
    formProps = {},
    interfaceFn = null,
    interfaceFnCancel = null,
    valueData,
    read,
    isRead,
    action = null,
    contentStyle = {},
    actionProps = {},
  }: CommonDialogOptions = {
    title: '自定义弹窗',
    noTitle: false,
    action: [],
    options: [],
    read: false,
    isRead: false,
    valueData: {},
  },
  dialogProps: Record<string, any> | null = null,
): CommonDialogResult {
  // 优先使用外部注册的 $dialog；再尝试组件上下文 useDialog；再退回离散 API（仅全局创建一次）
  const dialogInstance = getDialogInstanceOnce()
  
  const defaultModeEnum: Record<string, { sub?: string; read?: boolean }> = {
    none: { sub: '', read: false },
    create: { sub: '创建', read: false },
    add: { sub: '添加', read: false },
    edit: { sub: '编辑', read: false },
    view: { sub: '查看', read: true },
    export: { sub: '导出', read: false },
    import: { sub: '导入', read: false },
    delete: { sub: '删除', read: false },
    copy: { sub: '复制', read: false },
    ...modeEnum,
  }
  const formRef: Ref<any> = ref()
  const actionLoading = reactive<boolean[]>([])
  const model = ref({ ...valueData })
  const defaultActionProps = {
    justify: 'end' as 'end',
    wrapItem: false,
    style: {
      width: '100%',
    },
  }

  const defaultButtonStyle = {
    width: '120px',
  }
  const defaultAction: DialogAction[] = [
    {
      label: '取消',
      props: {
        type: 'primary',
        ghost: true,
      },
      onClick: ({ cancel }) => {
        if (interfaceFnCancel) {
          interfaceFnCancel(unref(model), {
            close: cancel,
          })
        } else {
          cancel()
        }
      },
    },
    {
      label: '确定',
      valid: true,
      onClick: async ({ cancel, hideLoading }) =>
        interfaceFn
          ? await interfaceFn(unref(model), {
            close: cancel,
            hideLoading,
          })
          : cancel(),
    },
  ];

  (Array.isArray(action) ? action : defaultAction).forEach((v, i) => {
    actionLoading[i] = false
  })
  const titleRender = typeof titleFull === 'function'
    ? () => titleFull(defaultModeEnum[mode]?.sub || '')
    : titleFull

  // 使用 ref 存储 dialog 实例，以便在函数中访问
  const dialogRef: Ref<any> = ref()

  function cancel(): void {
    console.log('取消', model.value)
    dialogRef.value?.destroy()
  }

  async function validate(arr: string[] = []): Promise<void> {
    console.log('开启验证')
    await formRef.value?.valid()
  }

  async function comfirm(fn?: () => any): Promise<any> {
    return fn && fn()
  }

  const renderAction = !(read ?? isRead)
    ? typeof action === 'function'
      ? () => action({ formRef, data: unref(model), d: dialogRef.value, close: cancel })
      : () => (
          <NSpace
            {...defaultActionProps}
            {...actionProps}
            style={{
              ...defaultActionProps?.style,
              ...(actionProps?.style || {}),
            }}
          >
            {(Array.isArray(action) ? action : defaultAction).map((v, i) =>
              v?.render
                ? (
                    v?.render?.()
                  )
                : (
                    <NButton
                      type="primary"
                      ghost={v.mode === 'cancel'}
                      {...(v?.props || {})}
                      {...(actionProps?.buttonProps || {})}
                      style={{ ...defaultButtonStyle, ...(v?.style || {}) }}
                      loading={actionLoading[i]}
                      onClick={async () => {
                        if (v.mode === 'cancel') {
                          dialogRef.value?.destroy()
                        }
                        else {
                          const showLoading = () => (actionLoading[i] = true)
                          const hideLoading = () => (actionLoading[i] = false)
                          if (v?.loading)
                            showLoading()
                          try {
                            console.log('model', unref(model))
                            
                            if (v?.valid)
                              await validate()
                            console.log(v?.valid)
                            if (v?.valid || v?.loading)
                              showLoading()
                            await v?.onClick?.({
                              model: unref(model),
                              comfirm,
                              cancel,
                              validate,
                              showLoading,
                              hideLoading,
                            })
                          }
                          catch (e) {
                            console.log(e)
                          }
                          finally {
                            if (v?.valid || v?.loading)
                              hideLoading()
                          }
                        }
                      }}
                    >
                      {v.label || ''}
                    </NButton>
                  ),
            )}
          </NSpace>
        )
    : null

  const d = dialogInstance.create({
    type: 'info',
    ...dialogDefaultOption,
    ...(!noTitle
      ? { title: titleRender || (defaultModeEnum[mode]?.sub ?? '') + title }
      : {}),
    style: {
      width: '500px',
    },
    content: () => (
      <DataForm
        ref={(v: any) => {
          formRef.value = v
        }}
        options={options}
        v-model:value={model}
        isNo={isNo}
        read={read ?? isRead}
        labelField={labelField}
        formProps={formProps}
        contentStyle={contentStyle}
        dialog
      />
    ),
    action: renderAction,
    // ...readButton.value,
    ...dialogProps,
    class: `core-dialog ${(read ?? isRead) ? 'core-dialog-read' : ''} ${dialogProps?.class || ''}`,
  })

  // 将 dialog 实例存储到 ref 中
  dialogRef.value = d

  // onBeforeUnmount(() => {
  //   console.log('commomDialog end')
  //   cancel()
  // })

  return {
    cancel,
    setValue: (v: any, str?: string) => str ? (model.value[str] = v) : (model.value = { ...model.value, ...v }),
    model: unref(model),
    modeEnum: defaultModeEnum
  };
}
