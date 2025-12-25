/**
 * 组件类型定义
 * 
 * 本文件包含所有组件的详细类型定义，包括 props、options 和 expose
 */

import type { Component, VNode, Ref } from 'vue'

// Vue 组件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * 表单选项配置项
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | key | 是 | string \| string[] | 字段标识，支持数组用于日期范围等场景 |
 * | label | 否 | string \| () => string | 字段标签 |
 * | way | 否 | 'input' \| 'select' \| 'date' \| 'time' \| 'dateRange' \| 'dateRangeTime' \| 'textarea' \| 'number' \| 'switch' \| 'radio' \| 'checkbox' \| 'upload' \| 'uploadDragger' \| 'progress' \| 'render' | 表单控件类型，默认为 'input' |
 * | required | 否 | boolean \| (model: any, formOpr: any) => boolean | 是否必填，支持函数动态判断 |
 * | message | 否 | string | 验证失败时的提示信息 |
 * | rule | 否 | object \| (model: any, formOpr: any) => object | 自定义验证规则 |
 * | options | 否 | Array<any> \| (value: any) => Array<any> | 选项列表（用于 select、radio、checkbox） |
 * | enum | 否 | Record<string, any> | 枚举对象，会自动转换为 options |
 * | props | 否 | object \| (value: any, formOpr: any) => object | 传递给表单控件的属性 |
 * | formItemProps | 否 | object \| (value: any, formOpr: any) => object | 传递给 NFormItem 的属性 |
 * | read | 否 | boolean | 是否只读模式 |
 * | readProps | 否 | object | 只读模式下传递给显示组件的属性 |
 * | format | 否 | (value: any, options?: any) => any | 格式化显示值 |
 * | formatTime | 否 | string | 日期时间格式化字符串 |
 * | type | 否 | string | 日期选择器类型（date、datetime、daterange 等） |
 * | loading | 否 | boolean \| Ref<boolean> | 加载状态（用于异步选项） |
 * | permission | 否 | string | 权限标识，需要配合 corePermission 指令使用 |
 * | isRender | 否 | boolean \| (value: any) => boolean | 是否渲染该字段 |
 * | render | 否 | (value: any, index: number, formOpr: any) => VNode | 自定义渲染函数 |
 * | default | 否 | FormOption \| FormOption[] | 默认子项（用于组合表单） |
 * | prefix | 否 | FormOption \| FormOption[] | 前缀子项 |
 * | suffix | 否 | FormOption \| FormOption[] | 后缀子项 |
 * | isWrap | 否 | boolean | 是否换行（用于 NSpace） |
 * | contentProps | 否 | object | 传递给 NSpace 的属性 |
 * | labelField | 否 | string | 选项的标签字段名，默认为 'label' |
 * | valueField | 否 | string | 选项的值字段名，默认为 'id' |
 * | labelSuffix | 否 | string \| () => VNode | 标签后缀图标或组件 |
 * | labelSuffixProps | 否 | object | 标签后缀的属性 |
 * | labelClass | 否 | string | 标签的 CSS 类名 |
 * | noLabel | 否 | boolean | 是否不显示标签 |
 * | queryType | 否 | string | 查询类型（用于 CommonQuery，如 'likeQuery'） |
 * | fields | 否 | object | 字段验证规则（用于复杂验证） |
 */
export interface FormOption {
  key: string | string[]
  label?: string | (() => string)
  way?: 'input' | 'select' | 'date' | 'time' | 'dateRange' | 'dateRangeTime' | 'textarea' | 'number' | 'switch' | 'radio' | 'checkbox' | 'upload' | 'uploadDragger' | 'progress' | 'render'
  required?: boolean | ((model: any, formOpr: any) => boolean)
  message?: string
  rule?: object | ((model: any, formOpr: any) => object)
  options?: Array<any> | ((value: any) => Array<any>)
  enum?: Record<string, any>
  props?: object | ((value: any, formOpr: { formRef: any; resetForm: () => void; close: () => void; setValue: (val: any) => void }) => object)
  formItemProps?: object | ((value: any, formOpr: any) => object)
  read?: boolean
  readProps?: object
  format?: (value: any, options?: any) => any
  formatTime?: string
  type?: string
  loading?: boolean
  permission?: string
  isRender?: boolean | ((value: any) => boolean)
  render?: (value: any, index: number, formOpr: { setValue: (val: any) => void; value: any }) => VNode
  default?: FormOption | FormOption[]
  prefix?: FormOption | FormOption[]
  suffix?: FormOption | FormOption[]
  isWrap?: boolean
  contentProps?: object
  labelField?: string
  valueField?: string
  labelSuffix?: string | (() => VNode)
  labelSuffixProps?: object
  labelClass?: string
  noLabel?: boolean
  queryType?: string
  fields?: object
}

/**
 * commonDialogMethod 函数参数
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | title | 否 | string | 弹窗标题 |
 * | noTitle | 否 | boolean | 是否不显示标题，默认 false |
 * | titleFull | 否 | string \| (sub: string) => VNode | 完整标题（会覆盖 title） |
 * | options | 否 | FormOption[] | 表单配置项数组 |
 * | mode | 否 | 'add' \| 'edit' \| 'view' \| 'create' \| 'export' \| 'import' \| 'delete' \| 'copy' \| 'none' | 弹窗模式，默认 'add' |
 * | modeEnum | 否 | Record<string, { sub?: string; read?: boolean }> | 模式枚举配置 |
 * | labelField | 否 | string | 标签字段名，默认 'label' |
 * | isNo | 否 | boolean | 是否不设置最小高度，默认 true |
 * | formProps | 否 | object | 传递给 NForm 的属性 |
 * | interfaceFn | 否 | (data: any, { close, hideLoading }: { close: () => void; hideLoading: () => void }) => Promise<void> \| void | 提交回调函数 |
 * | interfaceFnCancel | 否 | (data: any, { close }: { close: () => void }) => void | 取消回调函数 |
 * | valueData | 否 | object | 初始表单数据 |
 * | read | 否 | boolean | 是否只读模式 |
 * | isRead | 否 | boolean | 是否只读模式（与 read 相同） |
 * | action | 否 | Array<DialogAction> \| ({ formRef, data, d, close }) => VNode | 自定义操作按钮 |
 * | contentStyle | 否 | object | 内容区域样式 |
 * | actionProps | 否 | object | 操作按钮区域属性（NSpace 属性） |
 */
export interface CommonDialogOptions {
  title?: string
  noTitle?: boolean
  titleFull?: string | ((sub: string) => VNode)
  options?: FormOption[]
  mode?: 'add' | 'edit' | 'view' | 'create' | 'export' | 'import' | 'delete' | 'copy' | 'none'
  modeEnum?: Record<string, { sub?: string; read?: boolean }>
  labelField?: string
  isNo?: boolean
  formProps?: object
  interfaceFn?: (data: any, helpers: { close: () => void; hideLoading: () => void }) => Promise<void> | void
  interfaceFnCancel?: (data: any, helpers: { close: () => void }) => void
  valueData?: Record<string, any>
  read?: boolean
  isRead?: boolean
  action?: DialogAction[] | ((helpers: { formRef: any; data: any; d: any; close: () => void }) => VNode)
  contentStyle?: Record<string, any>
  actionProps?: Record<string, any>,
  render?: () => VNode
}

/**
 * 弹窗操作按钮配置
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | label | 否 | string | 按钮文本 |
 * | type | 否 | 'default' \| 'primary' \| 'success' \| 'info' \| 'warning' \| 'error' | 按钮类型 |
 * | mode | 否 | 'cancel' | 按钮模式，'cancel' 表示取消按钮 |
 * | valid | 否 | boolean | 是否在点击时验证表单 |
 * | loading | 否 | boolean | 是否显示加载状态 |
 * | onClick | 否 | ({ model, comfirm, cancel, validate, showLoading, hideLoading }) => Promise<void> \| void | 点击回调 |
 * | props | 否 | object | 传递给 NButton 的属性 |
 * | style | 否 | object | 按钮样式 |
 * | render | 否 | () => VNode | 自定义渲染函数 |
 */
export interface DialogAction {
  label?: string
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'error'
  mode?: 'cancel'
  valid?: boolean
  loading?: boolean
  onClick?: (helpers: {
    model: any
    comfirm: (fn?: () => any) => Promise<any>
    cancel: () => void
    validate: (arr?: string[]) => Promise<void>
    showLoading: () => void
    hideLoading: () => void
  }) => Promise<void> | void
  props?: Record<string, any>
  style?: Record<string, any>
  render?: () => VNode
}

/**
 * DataForm 组件 Props
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | value / v-model:value | 否 | object | 表单数据对象 |
 * | options | 否 | FormOption[] | 表单配置项数组 |
 * | isNo | 否 | boolean | 是否不设置最小高度，默认 true |
 * | read | 否 | boolean | 是否只读模式，默认 false |
 * | labelField | 否 | string | 标签字段名，默认 'label' |
 * | contentStyle | 否 | object | 内容区域样式 |
 * | rules | 否 | object | 自定义验证规则（会覆盖自动生成的规则） |
 * | formProps | 否 | object | 传递给 NForm 的属性 |
 * | formItemProps | 否 | object | 传递给所有 NFormItem 的属性 |
 * | dialog | 否 | boolean | 是否在弹窗中使用，默认 false |
 */
export interface DataFormProps {
  value?: Record<string, any>
  options?: FormOption[]
  isNo?: boolean
  read?: boolean
  labelField?: string
  contentStyle?: Record<string, any>
  rules?: Record<string, any>
  formProps?: Record<string, any>
  formItemProps?: Record<string, any>
  dialog?: boolean
}

/**
 * DataForm 组件 Expose
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | formRef | 是 | Ref<any> | NForm 组件实例引用 |
 * | getRule | 是 | () => object | 获取当前验证规则 |
 * | valid | 是 | (keyCode?: string[]) => Promise<void> | 验证表单，keyCode 为需要验证的字段 key 数组 |
 * | confirm | 是 | (fn?: (model: any) => void) => Promise<any> | 验证并确认，返回表单数据 |
 */
export interface DataFormExpose {
  formRef: any
  getRule: () => Record<string, any>
  valid: (keyCode?: string[]) => Promise<void>
  confirm: (fn?: (model: any) => void) => Promise<any>
}

/**
 * CommonQuery 组件 Props
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | query / v-model:query | 否 | object | 查询条件对象 |
 * | options | 否 | FormOption[] | 查询字段配置项数组 |
 * | inlineText | 否 | boolean | 是否内联文本，默认 true |
 * | selectCount | 否 | number | 每行显示的字段数量，默认 1 |
 * | type | 否 | 'default' \| 'primary' \| 'success' \| 'info' \| 'warning' \| 'error' | 按钮类型，默认 'primary' |
 * | noButton | 否 | boolean | 是否不显示按钮，默认 false |
 * | isRead | 否 | boolean | 是否只读模式，默认 false |
 * | btn | 否 | Array<'reset' \| 'search' \| string> | 按钮配置，默认 ['reset', 'search'] |
 * | size | 否 | 'small' \| 'medium' \| 'large' | 表单控件尺寸，默认 'medium' |
 */
export interface CommonQueryProps {
  query?: Record<string, any>
  options?: FormOption[]
  inlineText?: boolean
  selectCount?: number
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'error'
  noButton?: boolean
  isRead?: boolean
  btn?: Array<'reset' | 'search' | string>
  size?: 'small' | 'medium' | 'large'
}

/**
 * CommonQuery 组件 Events
 * 
 * | 事件名 | 参数 | 说明 |
 * |--------|------|------|
 * | update:query | (query: object) => void | 查询条件更新事件 |
 * | submit | () => void | 提交事件 |
 * | reset | () => void | 重置事件 |
 */
export interface CommonQueryEmits {
  'update:query': [query: Record<string, any>]
  submit: []
  reset: []
}

/**
 * DataTable 组件 Props
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | data | 否 | Array<any> | 表格数据数组 |
 * | pagination | 否 | object \| null | 分页配置对象 |
 * | columns | 否 | Array<TableColumn> | 表格列配置数组 |
 * | oprColumns | 否 | object \| null | 操作列配置 |
 * | selectColumns | 否 | object \| null | 选择列配置 |
 * | defaultColumns | 否 | Array<string> | 默认显示的列 key 数组 |
 * | summaryColumns | 否 | (pageData: Array<any>) => Record<string, { value: any }> \| null | 汇总列配置函数 |
 * | emptyText | 否 | string | 空数据提示文本，默认 '没有数据' |
 * | emptyIcon | 否 | string | 空数据图标，默认 '' |
 * | isFilter | 否 | boolean | 是否显示筛选按钮，默认 false |
 * | isEllipsis | 否 | boolean | 是否启用文本省略，默认 true |
 * | virtual | 否 | object \| boolean | 虚拟滚动配置，默认根据数据量自动判断 |
 * | singleColumn | 否 | boolean | 是否单列模式，默认 false |
 */
export interface DataTableProps {
  data?: Array<any>
  pagination?: DataTablePagination | null
  columns?: TableColumn[]
  oprColumns?: TableColumn | null
  selectColumns?: TableColumn | null
  defaultColumns?: string[]
  summaryColumns?: (pageData: Array<any>) => Record<string, { value: any }> | null
  emptyText?: string
  emptyIcon?: string
  isFilter?: boolean
  isEllipsis?: boolean
  virtual?: object | boolean
  singleColumn?: boolean
}

/**
 * 表格列配置
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | key | 否 | string | 列标识 |
 * | title / label | 否 | string \| () => VNode | 列标题 |
 * | width | 否 | number \| string | 列宽度 |
 * | align | 否 | 'left' \| 'center' \| 'right' | 对齐方式，默认 'center' |
 * | ellipsis | 否 | boolean \| object | 文本省略配置 |
 * | ellipsisProp | 否 | (ellipsis: any) => object | 自定义省略配置函数 |
 * | sorter | 否 | object \| (listQuery: any, pageState: any, key: string) => void | 排序配置 |
 * | display | 否 | boolean | 是否显示该列，默认 true |
 * | render | 否 | (row: any, index: number) => VNode | 自定义渲染函数 |
 */
export interface TableColumn {
  key?: string
  title?: string | (() => VNode)
  label?: string | (() => VNode)
  width?: number | string
  align?: 'left' | 'center' | 'right'
  ellipsis?: boolean | object
  ellipsisProp?: (ellipsis: any) => object
  sorter?: object | ((listQuery: any, pageState: any, key: string) => void)
  display?: boolean
  render?: (row: any, index: number) => VNode
  [key: string]: any
}

/**
 * 分页配置
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | page | 是 | number | 当前页码 |
 * | pageSize | 是 | number | 每页条数 |
 * | itemCount | 是 | number | 总条数 |
 * | showSizePicker | 否 | boolean | 是否显示每页条数选择器 |
 * | pageSizes | 否 | number[] | 每页条数选项数组 |
 * | onUpdatePage | 否 | (page: number) => void | 页码更新回调 |
 * | onUpdatePageSize | 否 | (pageSize: number) => void | 每页条数更新回调 |
 */
export interface DataTablePagination {
  page: number
  pageSize: number
  itemCount: number
  showSizePicker?: boolean
  pageSizes?: number[]
  onUpdatePage?: (page: number) => void
  onUpdatePageSize?: (pageSize: number) => void
  [key: string]: any
}

/**
 * DataTable 组件 Expose
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | filterHandle | 是 | () => void | 打开筛选弹窗 |
 * | filterButton | 是 | () => VNode | 获取筛选按钮组件 |
 * | initColumns | 是 | () => void | 初始化列配置 |
 */
export interface DataTableExpose {
  filterHandle: () => void
  filterButton: () => VNode
  initColumns: () => void
}

/**
 * createActionColumnJsx 函数参数
 * 
 * | 参数位置 | 必填 | 类型 | 说明 |
 * |----------|------|------|------|
 * | defaultOption | 是 | Array<ActionOption> | 操作按钮配置数组 |
 * | oprParams | 否 | object | 操作列额外参数（会合并到列配置） |
 * | collectParams | 否 | boolean \| { max: number; width: number } | 是否收集操作按钮（超过 max 个时收起），默认 false |
 */
export interface ActionOption {
  label: string | ((row: any) => string)
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'error'
  mode?: 'pop'
  disabled?: boolean | ((row: any) => boolean)
  onClick?: (row: any) => void | Promise<void>
  isRender?: (row: any) => boolean
  permission?: string
  loading?: boolean
  [key: string]: any
}

/**
 * Options 组件 Props（内部组件）
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | option | 否 | FormOption[] | 表单配置项数组 |
 * | value | 否 | object | 表单数据对象 |
 * | read | 否 | boolean | 是否只读模式 |
 * | labelField | 否 | string | 标签字段名 |
 * | valueField | 否 | string | 值字段名 |
 * | style | 否 | object | 样式对象 |
 * | formRef | 否 | object | 表单引用 |
 * | formProps | 否 | object | 表单属性 |
 */
export interface OptionsProps {
  option?: FormOption[]
  value?: Record<string, any>
  read?: boolean
  labelField?: string
  valueField?: string
  style?: Record<string, any>
  formRef?: any
  formProps?: Record<string, any>
}
