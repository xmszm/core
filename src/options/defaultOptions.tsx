import DataTable from '../table/DataTable.vue'
import dayjs from 'dayjs'
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NDivider,
  NEllipsis,
  NIcon,
  NInput,
  NInputNumber,
  NProgress,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpace,
  NSwitch,
  NText,
  NTimePicker,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import { ArchiveOutline } from '@vicons/ionicons5'
import { unref, type VNode, type Ref, type ComputedRef } from 'vue'
import type { FormOption } from '../../types/components'
import {
  labelField as globalLabelField,
  valueField as globalValueField,
} from '../enum/options'
import ImagesUpload from '../image/ImagesUpload.vue'
import { ArrayToObject } from '../utils/array'

import { timeFormat } from '../utils/time'

interface OptionContext {
  _value: Ref<Record<string, any>> | Record<string, any>
  _isRead: ComputedRef<boolean> | boolean
  labelField?: string
  valueField?: string
  _formRef?: any
}

interface OptionParams {
  label?: string | (() => string)
  key: string | string[]
  props?: Record<string, any>
  readProps?: Record<string, any>
  format?: (value: any, options?: any) => any
  formatTime?: string
  type?: string
  read?: boolean
  options?: any[] | ((value: any) => any[])
  loading?: boolean | Ref<boolean>
  radioLabelProps?: (v: any) => Record<string, any>
  text?: string
  onClick?: (value: any) => void
  pageState?: any
  opr?: any
  [key: string]: any
}

type OptionFunction = (params: OptionParams, context: OptionContext) => VNode

const defaultOptions: Record<string, OptionFunction> = {
  input: (
    { label, key, props, readProps, format = null, read }: OptionParams,
    { _value, _isRead }: OptionContext,
  ): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (read ?? isRead)
      ? (
          <NEllipsis {...readProps}>
            {format
              ? format?.(value[key as string], value)
              : value[key as string]}
          </NEllipsis>
        )
      : (
          <NInput
            v-model:value={value[key as string]}
            clearable
            placeholder={`请输入${unref(label)}`}
            {...props}
          >
            {{
              ...(props?.slots || {}),
            }}
          </NInput>
        )
  },
  select: (
    { label, key, props, options = [], loading = false, format = null, read }: OptionParams,
    { _value, _isRead }: OptionContext,
  ): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    const fnOptions = Array.isArray(options)
      ? options
      : typeof options === 'function'
        ? options(value[key as string])
        : []
    return (read ?? isRead)
      ? (
          <div>
            {format
              ? format?.(value[key as string], fnOptions)
              : ArrayToObject(
                fnOptions,
                props?.labelField || globalLabelField,
                props?.valueField || globalValueField,
              )?.[value[key as string]]?.[props?.labelField || globalLabelField] || value[key as string]}
          </div>
        )
      : (
          <NSelect
            v-model:value={value[key as string]}
            options={fnOptions}
            loading={unref(loading)}
            clearable
            filterable
            fallback-option={() => {
              if (!props?.asyncFallback)
                value[key as string] = null
              return false
            }}
            labelField={props?.labelField || globalLabelField}
            valueField={props?.valueField || globalValueField}
            placeholder={`请选择${unref(label)}`}
            style="width:100%"
            max-tag-count="responsive"
            {...props}
          >
            {{
              ...(props?.slots || {}),
            }}
          </NSelect>
        )
  },
  date: (
    {
      label,
      key,
      props,
      formatTime = 'YYYY-MM-DD',
      type = 'date',
      format,
      read,
    }: OptionParams,
    { _value, _isRead }: OptionContext,
  ): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (read ?? isRead)
      ? (
          <div>
            {format ? format?.(value[key as string]) : timeFormat(value[key as string], formatTime)}
          </div>
        )
      : (
          <NDatePicker
            formatted-value={value[key as string]}
            onUpdate:formatted-value={(v: string) => {
              value[key as string] = v
            }}
            type={type as any}
            clearable
            placeholder={`请选择${unref(label)}`}
            update-value-on-close={!['year']?.includes(props?.type)}
            style="width:100%"
            {...props}
          >
            {{
              ...(props?.slots || {}),
            }}
          </NDatePicker>
        )
  },
  time: (
    { label, key, props, format, formatTime = 'YYYY-MM-DD', read }: OptionParams,
    { _value, _isRead }: OptionContext,
  ): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (read ?? isRead)
      ? (
          <div>
            {format ? format?.(value[key as string]) : timeFormat(value[key as string], formatTime)}
          </div>
        )
      : (
          <NTimePicker
            formatted-value={value[key as string]}
            onUpdate:value={(_: any, v: string) => {
              console.log('v', v)
              value[key as string] = v
            }}
            clearable
            format="HH:mm:ss"
            style="width:100%"
            placeholder={`请选择${unref(label)}`}
            {...props}
          >
            {{
              ...(props?.slots || {}),
            }}
          </NTimePicker>
        )
  },
  dateRange: (
    { key, props, type = 'datetimerange', read }: OptionParams,
    { _value, _isRead }: OptionContext,
  ): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    const timeEnum: Record<string, string> = {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss',
      time: 'HH:mm:ss',
      datetimerange: 'YYYY-MM-DD HH:mm:ss',
      daterange: 'YYYY-MM-DD',
    }
    const formatStr = props?.format
      ? props?.format?.replace('yyyy', 'YYYY')?.replace('dd', 'DD')
      : timeEnum[props?.type || type]

    console.log('formatStr type', type)
    console.log('formatStr', formatStr)

    return (read ?? isRead)
      ? (
          <div>
            {Array.isArray(key)
              ? `${value?.[key?.[0]]} - ${value?.[key?.[1]]}`
              : value?.[key as string]}
          </div>
        )
      : (
          <NDatePicker
            formatted-value={
              Array.isArray(key)
                ? value?.[key?.[0]] && value?.[key?.[1]]
                  ? [
                      dayjs(value?.[key?.[0]]).format(formatStr),
                      dayjs(value?.[key?.[1]]).format(formatStr),
                    ]
                  : null
                : value?.[key as string] || null
            }
            onUpdate:formatted-value={(v: string[] | null) => {
              console.log(v)

              if (v && ![timeEnum.datetime, timeEnum.datetimerange].includes(formatStr)) {
                v = v.map((d, i) =>
                  dayjs(d, formatStr)
                    [!i ? 'startOf' : 'endOf']('day')
                    .format(formatStr),
                ) as any
              }
              if (Array.isArray(key)) {
                value[key?.[0]] = v?.[0]
                value[key?.[1]] = v?.[1]
              }
              else {
                value[key as string] = v as any
              }
            }}
            update-value-on-close={!['year', 'month']?.includes(props?.type)}
            type={type as any}
            clearable
            style="width:100%"
            {...props}
          >
            {{
              ...(props?.slots || {}),
            }}
          </NDatePicker>
        )
  },
  radio: (
    { key, options = [], props, radioLabelProps, read }: OptionParams,
    { _value, _isRead, labelField, valueField }: OptionContext,
  ): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (read ?? isRead)
      ? (
          <div>
            {
              ArrayToObject(
                Array.isArray(options) ? options : [],
                props?.labelField || labelField || globalLabelField,
                props?.valueField || valueField || globalValueField,
              )?.[value[key as string]]?.[props?.labelField || labelField || globalLabelField]
            }
          </div>
        )
      : (
          <NRadioGroup
            style={{ width: '100%' }}
            v-model:value={value[key as string]}
            {...props}
          >
            {{
              ...(props?.slots || {}),
              default: () => (
                <NSpace item-wrap={false} {...(props?.radioProps || {})}>
                  {(Array.isArray(options) ? options : [])?.map((v: any) => (
                    <NRadio
                      key={v.value}
                      value={v?.[props?.valueField || valueField || globalValueField]}
                      class="items-center"
                    >
                      <div {...(radioLabelProps?.(v) || {})}>
                        {v?.[props?.labelField || labelField || globalLabelField]}
                      </div>
                    </NRadio>
                  ))}
                </NSpace>
              ),
            }}
          </NRadioGroup>
        )
  },
  inputPhone: ({ label, key, props, read }: OptionParams, { _value, _isRead }: OptionContext): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (read ?? isRead)
      ? (
          <div>{value[key as string]}</div>
        )
      : (
          <NInput
            v-model:value={value[key as string]}
            clearable
            style="width:100%"
            allow-input={(v: string) => !v || /^\d$/.test(v) || v.length <= 11}
            placeholder={`请输入${unref(label)}`}
            {...props}
          >
            {{
              ...props?.slots,
            }}
          </NInput>
        )
  },
  inputNumber: ({ label, key, props, read }: OptionParams, { _value, _isRead }: OptionContext): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (read ?? isRead)
      ? (
          <div>{value[key as string]}</div>
        )
      : (
          <NInputNumber
            value={
              typeof value[key as string] === 'string' && value[key as string]
                ? Number(value[key as string])
                : value[key as string]
            }
            onUpdate:value={(v: number | null) => {
              value[key as string] = v
            }}
            showButton={false}
            clearable
            style="width:100%"
            placeholder={`请输入${unref(label)}`}
            min={0}
            {...props}
          >
            {{
              ...(props?.slots || {}),
            }}
          </NInputNumber>
        )
  },
  uploadFile: ({ key, props }: OptionParams, { _value }: OptionContext): VNode => {
    const value = unref(_value)
    return (
      <NUpload
        multiple
        max={1}
        accept=".xls,.xlsx"
        v-model:file-list={value[key as string]}
        {...props}
      >
        <NUploadDragger>
          <div style="margin-bottom: 12px">
            <NIcon size="48" depth={3}>
              <ArchiveOutline />
            </NIcon>
          </div>
          <NText style="font-size: 16px">点击或者拖动文件到该区域来上传</NText>
        </NUploadDragger>
      </NUpload>
    )
  },
  dataTable: (
    { key, loading = false, props, options, opr, pageState }: OptionParams,
    { _value, _isRead }: OptionContext,
  ): VNode => {
    const value = unref(_value)
    console.log(loading)
    console.log(pageState)

    const tableData = pageState?.data?.length ? pageState.data : value[key as string]
    const tableColumns = Array.isArray(options) ? options : typeof options === 'function' ? options(value[key as string]) : []

    const dataTableProps = {
      data: tableData as any[],
      columns: tableColumns as import('../../types/components').TableColumn[],
      maxHeight: 200,
      minHeight: 200,
      isEllipsis: false,
      oprColumns: opr as import('../../types/components').TableColumn | null,
      loading: pageState?.loading as boolean,
      ...props
    } as import('../../types/components').DataTableProps & Record<string, any>

    return (
      <DataTable {...dataTableProps} />
    )
  },
  progress: ({ key, props }: OptionParams, { _value }: OptionContext): VNode => {
    const value = unref(_value)
    return <NProgress percentage={value[key as string]} {...props} />
  },
  line: (): VNode => <NDivider />,

  image: ({ key, props, read }: OptionParams, { _isRead, _value }: OptionContext): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (
      <ImagesUpload
        v-model:value={value[key as string]}
        max={1}
        {...props}
        read={read ?? isRead}
      />
    )
  },
  button: ({ onClick, props, text }: OptionParams, { _value }: OptionContext): VNode => {
    const value = unref(_value)
    return (
      <NButton
        type="info"
        {...props}
        onClick={() =>
          props?.onClick
            ? props?.onClick(value)
            : onClick?.(value)}
      >
        {text}
      </NButton>
    )
  },
  switch: ({ key, props, read }: OptionParams, { _isRead, _value }: OptionContext): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (read ?? isRead)
      ? (
          <div>{value[key as string] ? '是' : '否'}</div>
        )
      : (
          <NSwitch v-model:value={value[key as string]} {...props}>
            {{
              ...(props?.slots || {}),
            }}
          </NSwitch>
        )
  },
  checkbox: (
    { key, options = [], props, read }: OptionParams,
    { _value, _isRead, labelField, valueField }: OptionContext,
  ): VNode => {
    const value = unref(_value)
    const isRead = unref(_isRead)
    return (read ?? isRead)
      ? (
          <div>
            {(Array.isArray(options) ? options : [])
              ?.filter((v: any) =>
                value[key as string]?.includes(
                  v[props?.valueField || valueField || globalValueField],
                ),
              )
              ?.map((v: any) => v[props?.labelField || labelField || globalLabelField])
              ?.join('、')}
          </div>
        )
      : (
          <NCheckboxGroup
            v-model:value={value[key as string]}
            style={{ width: '100%' }}
            {...props}
          >
            {{
              ...(props?.slots || {}),
              default: () => (
                <NSpace {...(props?.checkBoxProps || {})}>
                  {(Array.isArray(options) ? options : [])?.map((v: any) => (
                    <NCheckbox
                      key={v?.[props?.valueField || valueField || globalValueField]}
                      value={
                        v?.[props?.valueField || valueField || globalValueField]
                      }
                    >
                      {v?.[props?.labelField || labelField || globalLabelField]}
                    </NCheckbox>
                  ))}
                </NSpace>
              ),
            }}
          </NCheckboxGroup>
        )
  },
  filterList: ({ key, props, options }: OptionParams, { _value }: OptionContext): VNode => {
    const value = unref(_value)
    // FilterSelect 可能是外部组件，暂时注释掉
    // return (
    //   <FilterSelect
    //     v-model:value={value[key as string]}
    //     option={options}
    //     clearable
    //     filterButtonKey={['all', 'selectDefault']}
    //     {...props}
    //   />
    // )
    return <div>FilterSelect 组件需要外部提供</div>
  },
}

let extendOptions: Record<string, OptionFunction> = {}

class DefaultOptions {
  defaultMap: Map<string, OptionFunction> | null = null
  extendOptions: Record<string, OptionFunction> | null = null

  constructor() {
    console.log('DefaultOptions init')

    this.defaultMap = null
    this.init()
  }

  set(key: string, fn: OptionFunction): void {
    if (!this.defaultMap) return
    this.defaultMap.set(key, fn)
  }

  get(key: string): OptionFunction | undefined {
    if (!this.defaultMap) return undefined
    return this.defaultMap.get(key)
  }

  clear(): void {
    this.defaultMap?.clear()
  }

  setupOptions(key: string, fn: OptionFunction): void {
    if (!this.defaultMap) return
    const keys = this.defaultMap.size > 0 ? [...this.defaultMap.keys()] : []
    if (this.defaultMap.has(key))
      return console.error(`${key} 已存在,不能使用${keys?.join('、')}`)
    this.defaultMap.set(key, fn)
  }

  setupExtendOptions(key: string, fn: OptionFunction): void {
    if (!extendOptions) extendOptions = {}
    if (!extendOptions?.[key]) {
      extendOptions[key] = fn
    }
  }

  getAllOptions(): Record<string, OptionFunction> {
    const options: Record<string, OptionFunction> = {}
    this.defaultMap?.forEach((v, key) => {
      options[key] = v
    })

    return options
  }

  getOptions(keys: string[] = []): Record<string, OptionFunction> {
    console.log('getOptions', this.defaultMap)
    const options: Record<string, OptionFunction> = {}
    keys.forEach((key) => {
      if (this.defaultMap?.has(key))
        options[key] = this.defaultMap.get(key)!
    })

    return options
  }

  initOptions(options: Record<string, OptionFunction> = {}): void {
    Object.keys(options).forEach((key) => {
      this.setupOptions(key, options[key])
    })
  }

  initSetup(callback?: () => void): void {
    if (this.defaultMap)
      this.clear()
    this.defaultMap = new Map<string, OptionFunction>()
    this.initOptions(defaultOptions)
    callback && callback()
    if (import.meta.hot) {
      if (Object.keys(extendOptions).length)
        import.meta.hot.data.extendOptions = extendOptions
      else extendOptions = import.meta.hot?.data?.extendOptions || {}
    }
    this.initOptions(extendOptions)
  }

  init(callback?: () => void): void {
    this.initSetup(callback)
  }
}

const defaultOptionsMap = new DefaultOptions()

/**
 * 初始化默认选项
 * @param options - 选项对象
 */
export const initOptions = (options: Record<string, OptionFunction>): void =>
  defaultOptionsMap.initOptions(options)

export default (callback?: () => void): void => defaultOptionsMap.init(callback)

/**
 * 获取选项
 * @param keys - 选项键数组
 * @returns 选项对象
 */
export const getOptions = (keys: string[] = []): Record<string, OptionFunction> =>
  defaultOptionsMap.getOptions(keys)

/**
 * 获取所有选项
 * @returns 所有选项对象
 */
export function getAllOptions(): Record<string, OptionFunction> {
  return defaultOptionsMap.getAllOptions()
}

/**
 * 注册一个选项
 * @param key - 选项键
 * @param fn - 选项函数
 * @example setupOptions('input',({},{_value,_isRead})=>{})
 */
export function setupOptions(key: string, fn: OptionFunction): void {
  return defaultOptionsMap.setupExtendOptions(key, fn)
}
