import { ObjectToArray } from '../utils/object'
import type { FormOption, OptionsProps } from '../../types/components'

import { NFormItem, NIcon, NSpace } from 'naive-ui'
import {
  computed,
  defineComponent,
  isRef,
  isVNode,
  ref,
  unref,
  watch,
  type VNode,
} from 'vue'
import {
  labelField as globalLabelField,
  valueField as globalValueField,
} from '../enum/options'
import { getOptions } from './defaultOptions'
import SvgIcon from '../image/SvgIcon.vue'
import { registerDirectives, getGlobalApp } from '../directives/auto-register'
import { getCurrentInstance } from 'vue'

export default defineComponent(
  (props: OptionsProps, { emit }) => {
    // 自动注册 corePermission 指令（如果尚未注册）
    // 必须在组件渲染前注册，确保指令可用
    const instance = getCurrentInstance()
    if (instance?.appContext?.app) {
      registerDirectives(instance.appContext.app)
    } else {
      // 如果无法从实例获取，尝试使用全局应用实例
      const globalApp = getGlobalApp()
      if (globalApp) {
        registerDirectives(globalApp)
      }
    }
    const _value = ref(props.value || {})
    const _isRead = computed(() => props.read || false)

    let _formRef: any = props.formRef

    watch(
      () => props.formRef,
      (v) => (_formRef = v),
    )
    const _data = computed(() => props.option || [])

    function cellcetWayKeys(op: FormOption[]): string[] {
      return op.reduce((a: string[], b: FormOption) => {
        a.push(b?.way ?? 'input')
        const arr = [b?.default, b?.suffix, b?.prefix].reduce((k: any[], k1: any) => {
          if (Array.isArray(k1)) {
            k = k.concat(k1)
          }
          else if (k1 && Object.keys(k1)?.length) {
            k.push(k1)
          }
          return k
        }, [])

        console.log(arr)

        if (arr.length)
          arr.forEach((v: any) => a.push(v?.way ?? 'input'))
        return a
      }, [])
    }

    const _optionsByWayKey = computed(() => [
      ...new Set(cellcetWayKeys(props.option || [])),
    ])
    const defaultOption = getOptions(_optionsByWayKey.value)
    console.log(props.option)
    console.log('defaultOption', defaultOption, _optionsByWayKey.value)
    watch(
      () => _value.value,
      (v) => {
        emit('update:value', v)
      },
      {
        immediate: true,
      })

    function initProps(cProp: any, typeHint?: string): any {
      let obj: any = {}
      const type = typeof cProp
      let handleProps: any = null
      try {
        if (!cProp) {
          handleProps = cProp
        }
        else if (type === 'string' || type === 'object') {
          handleProps = cProp
        }
        else if (type === 'function') {
          handleProps = cProp(unref(_value), {
            formRef: _formRef,
            resetForm: () => _formRef?.value?.restoreValidation(),
            close: () => (props as any).cancel?.(),
            setValue,
          })
        }
        if (typeof handleProps === 'object' && !Array.isArray(handleProps)) {
          Object.keys(handleProps).forEach((v) => {
            const item = handleProps[v]
            if (isRef(item))
              obj[v] = unref(item)
            else obj[v] = item
          })
        }
        else {
          obj = handleProps
        }

        return obj
      }
      catch {
        return {}
      }
    }

    watch(
      () => props.value,
      (v) => {
        console.log(v)

        _value.value = v || {}
      },
      {
        immediate: true,
      },
    )

    function setValue(val: any) {
      _value.value = val
    }
    function main(item: FormOption): VNode {
      return (
        <NSpace
          wrap-item={false}
          wrap={Boolean(item?.isWrap)}
          align="center"
          style={{
            width: '100%',
          }}
          {...(item?.contentProps || {})}
        >
          {initMain(item?.prefix)}
          {initMain(item?.default || item)}
          {initMain(item?.suffix)}
        </NSpace>
      )
    }

    function initMain(dom: any): VNode | string | null | undefined {
      if (!dom)
        return
      let domHandle = dom

      if (typeof dom === 'function')
        domHandle = initProps(dom)
      domHandle = initProps(domHandle)

      if (isVNode(domHandle)) {
        console.log('??? isVNode')
        return domHandle
      }
      else if (typeof domHandle === 'string') {
        console.log('??? string')
        return domHandle
      }
      else if (Array.isArray(domHandle)) {
        console.log('???')

        return (
          <>
            {domHandle.map((item: any, index: number) => (
              <CreateFormItem item={item} index={index} />
            ))}
          </>
        ) as any
      }
      else if (typeof domHandle === 'object') {
        console.log('??? object')
        domHandle.props = initProps(domHandle?.props ?? {})
        return unref(
          computed(() =>
            defaultOption?.[domHandle?.way || 'input']?.(
              handleOptions(domHandle),
              {
                _value: domHandle?.queryType
                  ? unref(_value)[domHandle?.queryType]
                  : unref(_value),
                _formRef: unref(_formRef),
                _isRead: unref(_isRead),
                labelField: globalLabelField,
                valueField: globalValueField,
              },
            ),
          ),
        )
      }
      return null
    }

    function handleOptions(option: FormOption): FormOption {
      if (unref(option.enum))
        option.options = ObjectToArray(unref(option.enum))
      return option
    }

    function CreateFormItem({ item, index }: { item: FormOption; index: number }): VNode {
      item.formItemProps = initProps(item?.formItemProps)
      if (!item.formItemProps)
        item.formItemProps = {}
      if (!item?.formItemProps?.labelWidth && props.formProps?.labelWidth) {
        item.formItemProps.labelWidth = props.formProps?.labelWidth
      }

      return (
        <NFormItem
          v-corePermission={item?.permission}
          key={index}
          showLabel={!item?.noLabel}
          {...item?.formItemProps}
          labelWidth={item?.formItemProps?.labelWidth || 'auto'}
          feedback={initProps(item?.formItemProps?.feedback, 'string')}
          style={{
            padding: '0 15px',
            boxSizing: 'border-box',
            width: '100%',
            ...(item?.formItemProps?.style || {}),
          }}
          path={String(item.key)}
        >
          {{
            default: () => main(item),
            label: () => (
              <div
                class={
                  item?.labelClass || item?.labelSuffix
                    ? ` ${item?.labelClass} flex items-center gap-col-9px`
                    : ''
                }
              >
                {item?.labelSuffix
                  ? (
                    typeof item?.labelSuffix === 'string'
                      ? (
                        <NIcon
                          {...{
                            class: 'wh-20px c-inherit',
                            ...item?.labelSuffixProps,
                          }}
                        >
                          <SvgIcon name={item?.labelSuffix} />
                        </NIcon>
                      )
                      : (
                        item?.labelSuffix?.()
                      )
                  )
                  : (
                    <></>
                  )}
                {`${unref(
                  typeof item?.[props.labelField || 'label'] === 'function'
                    ? item?.[props.labelField || 'label']?.()
                    : item?.[props.labelField || 'label'],
                ) || ''
                  } ${_isRead.value || item.read ? '  ' : '  '}
              `}
              </div>
            ),
          }}
        </NFormItem>
      )
    }

    return () => (
      <NSpace
        wrap-item={false}
        size={[0, 8]}
        style={{
          width: '100%',
          minHeight: '100%',
          alignContent: 'baseline',
          ...props.style,
        }}
      >
        {_data.value.map(({ isRender = true, ...item }: any, index: number) => {
          return (
            typeof unref(isRender) !== 'boolean'
              ? isRender?.(unref(_value))
              : unref(isRender)
          )
            ? (
              item?.render
                ? (
                  item?.render(unref(_value), index, {
                    setValue,
                    value: unref(_value),
                  })
                )
                : (
                  <CreateFormItem item={item} index={index} />
                )
            )
            : null
        })}
      </NSpace>
    )
  },
  {
    props: {
      option: {
        type: Array,
        default: () => [],
      },
      value: {
        type: Object,
        default: () => ({}),
      },
      read: {
        type: Boolean,
        default: () => false,
      },
      labelField: {
        type: String,
        default: () => globalLabelField,
      },
      valueField: {
        type: String,
        default: () => globalValueField,
      },
      style: {
        type: Object,
        default: () => ({}),
      },
      formRef: {
        type: Object,
        default: () => ({}),
      },
      formProps: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['update:value'],
  },
)
