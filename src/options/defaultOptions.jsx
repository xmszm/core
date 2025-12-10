import DataTable from 'core/table/DataTable.vue'
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
import { unref } from 'vue'
import {
  labelField as globalLabelField,
  valueField as globalValueField,
} from '../enum/options'
import ImagesUpload from '../image/ImagesUpload.vue'
import { ArrayToObject } from '../utils/array'

import { timeFormat } from '../utils/time'

const defaultOptions = {
  input: (
    { label, key, props, readProps, format = null, read },
    { _value, _isRead },
  ) => {
    return (read ?? _isRead)
      ? (
          <NEllipsis {...readProps}>
            {format
              ? format?.(unref(_value)[key], unref(_value))
              : unref(_value)[key]}
          </NEllipsis>
        )
      : (
          <NInput
            v-model:value={_value[key]}
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
    { label, key, props, options = [], loading = false, format = null, read },
    { _value, _isRead },
  ) => {
    const fnOptions
      = (Array.isArray(unref(options))
        ? unref(options)
        : options?.(_value[key])) || []
    return (read ?? _isRead)
      ? (
          <div>
            {format
              ? format?.(_value[key], fnOptions)
              : ArrayToObject(
                fnOptions,
                props?.labelField || globalLabelField,
                props?.valueField || globalValueField,
              )?.[_value[key]]?.[props?.labelField || globalLabelField]}
          </div>
        )
      : (
          <NSelect
            v-model:value={_value[key]}
            options={fnOptions}
            loading={unref(loading)}
            clearable
            filterable
            fallback-option={() => {
              if (!props?.asyncFallback)
                _value[key] = null
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
    },
    { _value, _isRead },
  ) => {
    return (read ?? _isRead)
      ? (
          <div>
            {format ? format?.(_value[key]) : timeFormat(_value[key], formatTime)}
          </div>
        )
      : (
          <NDatePicker
            formatted-value={_value[key]}
            onUpdate:formatted-value={(v) => {
              _value[key] = v
            }}
            type={type}
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
    { label, key, props, format, formatTime = 'YYYY-MM-DD', read },
    { _value, _isRead },
  ) => {
    return (read ?? _isRead)
      ? (
          <div>
            {format ? format?.(_value[key]) : timeFormat(_value[key], formatTime)}
          </div>
        )
      : (
          <NTimePicker
            formatted-value={_value[key]}
            onUpdate:value={(_,v) => {
              console.log('v', v)

              _value[key] = v
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
    { key, props, type = 'datetimerange', read },
    { _value, _isRead },
  ) => {
    const timeEnum = {
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

    return (read ?? _isRead)
      ? (
          <div>
            {Array.isArray(key)
              ? `${_value?.[key?.[0]]} - ${_value?.[key?.[1]]}`
              : _value?.[key]}
          </div>
        )
      : (
          <NDatePicker
            formatted-value={
              Array.isArray(key)
                ? _value?.[key?.[0]] && _value?.[key?.[1]]
                  ? [
                      dayjs(_value?.[key?.[0]]).format(formatStr),
                      dayjs(_value?.[key?.[1]]).format(formatStr),
                    ]
                  : null
                : _value?.[key] || null
            }
            onUpdate:formatted-value={(v) => {
              console.log(v)

              if (v && ![timeEnum.datetime, timeEnum.datetimerange].includes(formatStr)) {
                v = v.map((d, i) =>
                  dayjs(d, formatStr)
                    [!i ? 'startOf' : 'endOf']('day')
                    .format(formatStr),
                )
              }
              if (Array.isArray(key)) {
                _value[key?.[0]] = v?.[0]
                _value[key?.[1]] = v?.[1]
              }
              else {
                _value[key] = v
              }
            }}
            update-value-on-close={!['year', 'month']?.includes(props?.type)}
            type={type}
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
    { key, options = [], props, radioLabelProps, read },
    { _value, _isRead, labelField, valueField },
  ) => {
    return (read ?? _isRead)
      ? (
          <div>
            {
              ArrayToObject(
                options,
                props?.labelField || labelField,
                props?.valueField || valueField,
              )?.[_value[key]]?.[props?.labelField || labelField]
            }
          </div>
        )
      : (
          <NRadioGroup
            style={{ width: '100%' }}
            v-model:value={_value[key]}
            {...props}
          >
            {{
              ...(props?.slots || {}),
              default: () => (
                <NSpace item-wrap={false} {...(props?.radioProps || {})}>
                  {options?.map(v => (
                    <NRadio
                      key={v.value}
                      value={v?.[props?.valueField || valueField]}
                      class="items-center"
                    >
                      <div {...(radioLabelProps?.(v) || {})}>
                        {v?.[props?.labelField || labelField]}
                      </div>
                    </NRadio>
                  ))}
                </NSpace>
              ),
            }}
          </NRadioGroup>
        )
  },
  inputPhone: ({ label, key, props, read }, { _value, _isRead }) => {
    return (read ?? _isRead)
      ? (
          <div>{_value[key]}</div>
        )
      : (
          <NInput
            v-model:value={_value[key]}
            clearable
            style="width:100%"
            allow-input={v => !v || /^\d$/.test(v) || v.length <= 11}
            placeholder={`请输入${unref(label)}`}
            {...props}
          >
            {{
              ...props?.slots,
            }}
          </NInput>
        )
  },
  inputNumber: ({ label, key, props, read }, { _value, _isRead }) => {
    return (read ?? _isRead)
      ? (
          <div>{_value[key]}</div>
        )
      : (
          <NInputNumber
            value={
              typeof _value[key] === 'string' && _value[key]
                ? Number(_value[key])
                : _value[key]
            }
            onUpdate:value={(v) => {
              _value[key] = v
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
  uploadFile: ({ key, props }, { _value }) => (
    <NUpload
      multiple
      max={1}
      accept=".xls,.xlsx"
      v-model:file-list={_value[key]}
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
  ),
  dataTable: (
    { key, loading = false, props, options, opr, pageState },
    { _value, _isRead },
  ) => {
    console.log(loading)
    console.log(pageState)

    return (
      <DataTable
        data={pageState?.data?.length ? pageState.data : _value[key]}
        columns={unref(options)}
        maxHeight={200}
        minHeight={200}
        is-ellipsis={false}
        opr-columns={opr}
        loading={pageState?.loading}
        {...props}
      />
    )
  },
  progress: ({ key, props }, { _value }) => (
    <NProgress percentage={_value[key]} {...props} />
  ),
  line: () => <NDivider />,

  image: ({ key, props, read }, { _isRead, _value }) => (
    <ImagesUpload
      v-model:value={_value[key]}
      max={1}
      {...props}
      read={read ?? _isRead}
    />
  ),
  button: ({ onClick, props, text }, { _value }) => {
    return (
      <NButton
        type="info"
        {...props}
        onClick={() =>
          props?.onClick
            ? props?.onClick(unref(_value))
            : onClick(unref(_value))}
      >
        {text}
      </NButton>
    )
  },
  switch: ({ key, props, read }, { _isRead, _value }) =>
    (read ?? _isRead)
      ? (
          <div>{_value[key] ? '是' : '否'}</div>
        )
      : (
          <NSwitch v-model:value={_value[key]} {...props}>
            {{
              ...(props?.slots || {}),
            }}
          </NSwitch>
        ),
  checkbox: (
    { key, options = [], props, read },
    { _value, _isRead, labelField, valueField },
  ) =>
    (read ?? _isRead)
      ? (
          <div>
            {unref(options)
              ?.filter(v =>
                unref(_value)[key]?.includes(
                  v[props?.valueField || valueField || globalValueField],
                ),
              )
              ?.map(v => v[[props?.labelField || labelField || globalLabelField]])
              ?.join('、')}
          </div>
        )
      : (
          <NCheckboxGroup
            v-model:value={_value[key]}
            style={{ width: '100%' }}
            {...props}
          >
            {{
              ...(props?.slots || {}),
              default: () => (
                <NSpace {...(props?.checkBoxProps || {})}>
                  {unref(options)?.map(v => (
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
        ),
  filterList: ({ key, props, options }, { _value }) => (
    <FilterSelect
      v-model:value={_value[key]}
      option={options}
      clearable
      filterButtonKey={['all', 'selectDefault']}
      {...props}
    />
  ),
}
let extendOptions = {}

let extendCallBack = null
class DefaultOptions {
  defaultMap = null
  extendOptions = null
  constructor() {
    console.log('DefaultOptions init')

    this.defaultMap = null
    this.init()
  }

  set(key, fn) {
    this.options.set(key, fn)
  }

  get(key) {
    return this.options.get(key)
  }

  clear() {
    this.defaultMap.clear()
  }

  setupOptions(key, fn) {
    const keys = this.defaultMap.size > 0 ? [...this.defaultMap.keys()] : []
    if (this.defaultMap.has(key))
      return console.error(`${key} 已存在,不能使用${keys?.join('、')}`)
    this.defaultMap.set(key, fn)
  }

  setupExtendOptions(key, fn) {
    if(!extendOptions) extendOptions = {}
    if (!extendOptions?.[key]) {
      extendOptions[key] = fn
    }
  }

  getAllOptions() {
    const options = {}
    this.defaultMap.forEach((v, key) => {
      options[key] = v
    })

    return options
  }

  getOptions(keys = []) {
    console.log('getOptions',this.defaultMap)
    const options = keys.reduce((o, key) => {
      if (this.defaultMap.has(key))
        o[key] = this.defaultMap.get(key)
      return o
    }, {})

    return options
  }

  initOptions(options = []) {
    Object.keys(options).forEach((key) => {
      this.setupOptions(key, options[key])
    })
  }

  initSetup(callback) {
    if (this.defaultMap)
      this.clear()
    this.defaultMap = new Map()
    this.initOptions(defaultOptions)
    callback && callback()
    if (import.meta.hot) {
      if (Object.keys(extendOptions).length)
        import.meta.hot.data.extendOptions = extendOptions
      else extendOptions = import.meta.hot?.data?.extendOptions
    }
    this.initOptions(extendOptions)
  }

  init(callback) {
    this.initSetup(callback)
  }
}

const defaultOptionsMap = new DefaultOptions()

/**
 * @returns {void}
 * 初始化默认选项
 */
export const initOptions = (...arg) => defaultOptionsMap.initOptions(...arg)

export default (...arg) =>defaultOptionsMap.init(...arg)

/**
 *
 * @param {string[]} keys
 * @returns
 * 获取选项
 */
export const getOptions = (...arg) => defaultOptionsMap.getOptions(...arg)

/**
 * @returns {Object[string,any]>}
 * 获取所有选项
 */
export function getAllOptions(...arg) {
  return defaultOptionsMap.getAllOptions(...arg)
}

/**
 *
 * @param {string} key
 * @param {Function} fn
 * @returns {void}
 * 注册一个选项
 * @example setupOptions('input',({},{_value,_isRead})=>{})
 */
export function setupOptions(...arg) {
  return defaultOptionsMap.setupExtendOptions(...arg)
}
