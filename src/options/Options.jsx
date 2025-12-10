import { ObjectToArray } from 'core/utils/object'

import { NFormItem, NIcon, NSpace } from 'naive-ui'
import {
  computed,
  defineComponent,
  isRef,
  isVNode,
  ref,
  unref,
  watch,
} from 'vue'
import {
  labelField as globalLabelField,
  valueField as globalValueField,
} from '../enum/options'
import { getOptions } from './defaultOptions'
import SvgIcon from '../image/SvgIcon.vue'

export default defineComponent(
  (props, { emit }) => {
    const _value = ref(props.value)
    const _isRead = computed(() => props.read || false)

    let _formRef = props.formRef

    watch(
      () => props.formRef,
      v => (_formRef = v),
    )
    const _data = computed(() => props.option)

    function cellcetWayKeys(op) {
      return op.reduce((a, b) => {
        a.push(b?.way ?? 'input')
        const arr = [b?.default, b?.suffix, b?.prefix].reduce((k, k1) => {
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
          arr.forEach(v => a.push(v?.way ?? 'input'))
        return a
      }, [])
    }

    const _optionsByWayKey = computed(() => [
      ...new Set(cellcetWayKeys(props.option)),
    ])
    const defaultOption = getOptions(_optionsByWayKey.value)
    console.log(props.option)
    console.log('defaultOption', defaultOption, _optionsByWayKey.value)
    watch(
      () => _value.value,
      (v) => {
        emit('update:value', v)
      }
    ,{
      immediate: true,
    })

    function initProps(cProp) {
      let obj = {}
      const type = typeof cProp
      let handleProps = null
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
            close: () => props.cancel(),
            setValue,
          })
        }
        if (typeof handleProps === 'object' && !Array.isArray(handleProps)) {
          Object.keys(handleProps).forEach((v) => {
            const item = handleProps[v]
            // console.log(item)
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

        _value.value = v
      },
      {
        immediate: true,
      },
    )

    function setValue(val) {
      _value.value = val
    }
    function main(item) {
      // console.log('main---重绘?', item)
      return (
        <NSpace
          wrap-item={false}
          wrap={Boolean(item?.isWrap)}
          align="center"
          style={{
            width: '100%',
          }}
          {...(item?.contentProps||{})}
        >
          {initMain(item?.prefix)}
          {initMain(item?.default || item)}
          {initMain(item?.suffix)}
        </NSpace>
      )
    }

    function initMain(dom) {
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
            {domHandle.map((item, index) => (
              <CreateFormItem item={item} index={index} />
            ))}
          </>
        )
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
    }

    function handleOptions(option) {
      if (unref(option.enum))
        option.options = ObjectToArray(unref(option.enum))
      return option
    }

    function CreateFormItem({ item, index }) {
      item.formItemProps = initProps(item?.formItemProps)
      if (!item.formItemProps)
        item.formItemProps = {}
      if (!item?.formItemProps?.labelWidth && props.formProps?.labelWidth) {
        item.formItemProps.labelWidth = props.formProps?.labelWidth
      }

      return (
        <NFormItem
          v-permission={item?.permission}
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
                {`${
                  unref(
                    typeof item?.[props.labelField] === 'function'
                      ? item?.[props.labelField]?.()
                      : item?.[props.labelField],
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
        {_data.value.map(({ isRender = true, ...item }, index) => {
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
