import { NButton, NSpace } from 'naive-ui'
import { computed, reactive, ref, unref, watch } from 'vue'
import DataForm from '../form/DataForm.vue'
import { dialogDefaultOption } from './utils/dialog'
import './style/commonDialog.less'

/**
 *
 * @param {*} param
 * @param {object} dialogProps
 * @returns {object {cancel,model}}
 * 集成填写表单功能的弹窗
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
  } = {
    title: '自定义弹窗',
    noTitle: false,
    action: [],
    options: [],
    read: false,
    isRead: false,
    valueData: {},
  },
  dialogProps = null,
) {
  const defaultModeEnum = {
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
  const formRef = ref()
  const actionLoading = reactive([])
  const model = ref({ ...valueData })
  const defaultActionProps = {
    justify: 'end',
    wrapItem: false,
    style: {
      width: '100%',
    },
  }

  const defaultButtonStyle = {
    width: '120px',
  }
  const defaultAction = [
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
        }else {
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
  ]

  action
  || defaultAction.forEach((v, i) => {
    actionLoading[i] = false
  })
  const titleRender
    = typeof titleFull === 'function'
      ? () => titleFull(defaultModeEnum[mode]?.sub)
      : titleFull

  const d = $dialog.create({
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
        ref={v => {
          formRef.value = v
        }}
        options={options}
        v-model:value={model.value}
        isNo={isNo}
        read={read ?? isRead}
        labelField={labelField}
        formProps={formProps}
        contentStyle={contentStyle}
        dialog
      />
    ),
    action: !(read ?? isRead)
      ? typeof action === 'function'
        ? () => action({ formRef, data: unref(model), d, close: cancel })
        : () => (
            <NSpace
              {...defaultActionProps}
              {...actionProps}
              style={{
                ...defaultActionProps?.style,
                ...(actionProps?.style || {}),
              }}
            >
              {(action || defaultAction).map((v, i) =>
                v?.render
                  ? (
                      v?.render?.()
                    )
                  : (
                      <NButton
                        type="primary" ghost={v.mode === 'cancel'} {...({ ...v?.props, ...actionProps?.buttonProps } || {})}
                        style={{ ...defaultButtonStyle, ...(v?.style || {}) }}
                        loading={actionLoading[i]}
                        onClick={async () => {
                          if (v.mode === 'cancel') {
                            d.destroy()
                          }
                          else {
                            const showLoading = () => (actionLoading[i] = true)
                            const hideLoading = () => (actionLoading[i] = false)
                            if (v?.loading)
                              showLoading()
                            try {
                              console.log('model', unref(model));
                              
                              if (v?.valid)
                                await validate()
                              console.log(v?.valid)
                              if (v?.valid || v?.loading)
                                showLoading()
                              await v?.onClick({
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
      : null,
    // ...readButton.value,
    ...dialogProps,
    class: `core-dialog ${ unref(read) ? 'core-dialog-read' : ''} ${dialogProps?.class || ''}`,
  })

  function cancel() {
    console.log('取消', model.value)

    d?.destroy()
  }

 async function validate(arr = []) {
    console.log('开启验证')
     await formRef.value?.valid()
  }

  async function comfirm(fn) {
    return fn && fn()
  }

  // onBeforeUnmount(() => {
  //   console.log('commomDialog end')
  //   cancel()
  // })

  return {
    cancel,
    setValue: (v, str) =>
      str ? (model.value[str] = v) : (model.value = { ...model.value, ...v }),
    model: unref(model),
    modeEnum: defaultModeEnum,
  }
}
