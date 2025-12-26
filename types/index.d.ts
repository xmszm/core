import type { Component } from 'vue'
import type {
  CommonDialogOptions,
  DialogAction,
  DataFormProps,
  DataFormExpose,
  CommonQueryProps,
  CommonQueryEmits,
  DataTableProps,
  DataTableExpose,
  TableColumn,
  DataTablePagination,
  FormOption,
  ActionOption,
  OptionsProps,
} from './components'

/**
 * commonDialogMethod 返回值
 * 
 * | 字段名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | cancel | 是 | () => void | 关闭弹窗方法 |
 * | setValue | 是 | (v: any, key?: string) => void | 设置表单值方法 |
 * | model | 是 | any | 表单数据对象（响应式） |
 * | modeEnum | 是 | Record<string, { sub?: string; read?: boolean }> | 模式枚举对象 |
 */
export interface CommonDialogResult {
  cancel(): void
  setValue(v: any, key?: string): void
  model: any
  modeEnum: Record<string, { sub?: string; read?: boolean }>
}

/**
 * 通用弹窗方法
 * 
 * @param options - 弹窗配置选项，详见 CommonDialogOptions
 * @param dialogProps - 传递给 NDialog 的属性
 * @returns CommonDialogResult 弹窗控制对象
 * 
 * @example
 * ```typescript
 * const { cancel, setValue, model } = commonDialogMethod({
 *   title: '编辑',
 *   mode: 'edit',
 *   options: [
 *     { key: 'name', label: '名称', way: 'input', required: true },
 *     { key: 'type', label: '类型', way: 'select', options: [...] }
 *   ],
 *   valueData: { name: 'test', type: 'A' },
 *   interfaceFn: async (data, { close }) => {
 *     await saveData(data)
 *     close()
 *   }
 * })
 * ```
 */
export function commonDialogMethod(
  options?: CommonDialogOptions,
  dialogProps?: Record<string, any>,
): CommonDialogResult

// 导出类型定义
export type {
  CommonDialogOptions,
  DialogAction,
  FormOption,
  DataFormProps,
  DataFormExpose,
  CommonQueryProps,
  CommonQueryEmits,
  DataTableProps,
  DataTableExpose,
  TableColumn,
  DataTablePagination,
  ActionOption,
  OptionsProps,
}

/**
 * DataForm 组件
 * 
 * Props 详见 DataFormProps
 * Expose 详见 DataFormExpose
 */
export const DataForm: Component<DataFormProps>

/**
 * Options 组件（内部组件）
 * 
 * Props 详见 OptionsProps
 */
export const Options: Component<OptionsProps>

/**
 * CommonQuery 组件
 * 
 * Props 详见 CommonQueryProps
 * Events 详见 CommonQueryEmits
 */
export const CommonQuery: Component<CommonQueryProps>

/**
 * DataTable 组件
 * 
 * Props 详见 DataTableProps
 * Expose 详见 DataTableExpose
 */
export const DataTable: Component<DataTableProps>

export const OprButton: Component
export const Pop: Component

/**
 * 创建操作列
 * 
 * @param defaultOption - 操作按钮配置数组，详见 ActionOption
 * @param oprParams - 操作列额外参数
 * @param collectParams - 是否收集操作按钮（超过 max 个时收起）
 * @returns TableColumn 表格列配置对象
 * 
 * @example
 * ```typescript
 * const opr = createActionColumnJsx([
 *   {
 *     label: '编辑',
 *     type: 'primary',
 *     onClick: (row) => onEdit(row)
 *   },
 *   {
 *     label: '删除',
 *     type: 'error',
 *     mode: 'pop',
 *     onClick: (row) => onDelete(row)
 *   }
 * ])
 * ```
 */
export function createActionColumnJsx(
  defaultOption: ActionOption[],
  oprParams?: Record<string, any>,
  collectParams?: boolean | { max: number; width: number }
): TableColumn | undefined
/**
 * 初始化表单验证规则
 * 
 * | 参数名 | 必填 | 类型 | 说明 |
 * |--------|------|------|------|
 * | options | 否 | FormOption[] | 表单配置项数组 |
 * | model | 否 | any | 表单数据对象 |
 * | labelField | 否 | string | 标签字段名，默认 'label' |
 * | formOpr | 否 | Record<string, any> | 表单操作对象 |
 * 
 * @returns ComputedRef<Record<string, any>> 验证规则对象
 */
export function initRules(args: {
  options?: FormOption[]
  model?: any
  labelField?: string
  formOpr?: Record<string, any>
}): any

/**
 * 选项函数类型
 */
export type OptionFunction = (value: any, key: string, formOpr?: any) => FormOption

/**
 * 初始化默认选项类型（自动注册所有内置选项类型）
 */
export function setupInitOptions(): void
export default setupInitOptions

/**
 * 获取所有已注册的选项类型
 * @returns 所有选项类型的Map对象
 */
export function getAllOptions(): Map<string, OptionFunction>

/**
 * 获取指定类型的选项配置函数
 * @param way - 选项类型标识
 * @returns 选项配置函数
 */
export function getOptions(way: string): OptionFunction | undefined

/**
 * 注册自定义选项类型
 * @param way - 选项类型标识
 * @param fn - 选项配置函数
 * @example
 * ```typescript
 * setupOptions('customInput', (value, key) => ({
 *   key,
 *   way: 'input',
 *   props: { placeholder: '自定义输入框' }
 * }))
 * ```
 */
export function setupOptions(way: string, fn: OptionFunction): void

/**
 * 将值转换为数组
 * @param v - 单个值或数组
 * @returns 数组
 */
export function toArray<T = any>(v: T | T[]): T[]

/**
 * 将数组转换为对象
 * @param arr - 数组
 * @param fields - 字段映射配置
 * @returns 以valueField为key的对象
 */
export function ArrayToObject<T = any>(
  arr?: T[],
  fields?: { labelField?: string; valueField?: string },
): Record<string, T>

/**
 * 将对象转换为数组
 * @param obj - 对象
 * @param fields - 字段映射配置
 * @returns 数组，每项包含labelField和valueField
 */
export function ObjectToArray<T extends Record<string, any> = any>(
  obj?: T,
  fields?: { labelField?: string; valueField?: string },
): Array<{ [K in keyof typeof fields]: any }>

/**
 * 自定义上传函数（需先通过 registryUpload 注册）
 * @param config - 上传配置对象
 * @returns Promise 返回上传结果
 */
export function customUpload(config: any): Promise<any>

/**
 * 注册全局上传方法
 * @param fn - 上传函数
 */
export function registryUpload(fn: (config: any) => Promise<any>): void

/**
 * 获取文件URL（支持OSS尺寸参数）
 * @param url - 文件URL
 * @param ossSize - OSS图片尺寸参数
 * @returns 处理后的URL
 */
export function getFileUrl(url?: string, ossSize?: number | null): string | undefined

/**
 * 收集子路由的权限
 * @param route - 路由对象
 * @returns 权限数组
 */
export function cellectChildenPermission(route: any): string[]

/**
 * 处理URL参数字符串
 * @param str - 参数模板字符串
 * @param op - 参数对象
 * @returns 处理后的字符串
 */
export function handleParams(str?: string, op?: Record<string, any>): string

/**
 * 获取API配置对象
 * @returns API配置对象
 */
export function useApiConfig(): { baseURL: string }

/**
 * 获取权限检查函数
 * @returns 权限相关方法
 */
export function useAuthPermission(): {
  hasPermission: (permission: string) => boolean
  checkPermission: (permission: string) => boolean
}

/**
 * 初始化路由元信息
 * @param routes - 路由配置数组
 * @param base - 基础路径
 * @returns 处理后的路由配置
 */
export function initRouteMeta(routes: any[], base?: string): any[]

/**
 * 表格单元格省略配置
 */
export const ellipsis: {
  tooltip: boolean
  lineClamp?: number
}

/**
 * 排序枚举
 */
export const orderEnum: {
  ascend: string
  descend: string
}

/**
 * 全局标签字段名
 */
export const globalLabelField: string

/**
 * 全局值字段名
 */
export const globalValueField: string

// ==================== 配置系统 ====================

/**
 * 全局配置对象类型
 */
export interface CoreConfig {
  /** API 基础地址 */
  baseURL?: string
  /** 权限检查函数 */
  hasPermission?: (permission: string) => boolean
  /** 上传方法 */
  uploadMethod?: (config: any) => Promise<any>
  /** Dialog 配置 */
  dialog?: {
    /** Dialog 实例 */
    instance?: any
    /** 是否继承外部定义的主题色 */
    inheritTheme?: boolean
    /** 主题色覆盖 */
    themeOverrides?: any
    /** commonDialogMethod 的默认选项配置 */
    defaultOption?: {
      /** 是否显示图标 */
      showIcon?: boolean
      /** 是否自动聚焦 */
      autoFocus?: boolean
      /** 是否可关闭 */
      closable?: boolean
      /** 是否按 ESC 关闭 */
      closeOnEsc?: boolean
      /** 其他 NDialog 支持的属性 */
      [key: string]: any
    }
  }
}

/**
 * 初始化全局配置
 * @param options - 配置选项
 */
export function setupConfig(options: CoreConfig): void

/**
 * 获取完整配置对象
 * @returns 配置对象
 */
export function getConfig(): Required<CoreConfig>

/**
 * 获取API基础地址
 * @returns 基础地址
 */
export function getBaseURL(): string

/**
 * 获取权限检查函数
 * @returns 权限检查函数
 */
export function getHasPermission(): ((permission: string) => boolean) | null

/**
 * 获取上传方法
 * @returns 上传方法
 */
export function getUploadMethod(): ((config: any) => Promise<any>) | null

/**
 * 检查权限
 * @param permission - 权限标识
 * @returns 是否有权限
 */
export function checkPermission(permission: string): boolean

/**
 * 获取Dialog配置
 * @returns Dialog配置对象
 */
export function getDialogConfig(): CoreConfig['dialog']

/**
 * 注册Dialog实例
 * @param instance - Dialog实例
 */
export function registerDialogInstance(instance: any): void

/**
 * 获取Dialog实例
 * @returns Dialog实例
 */
export function getDialogInstance(): any | null

// ==================== Dialog工具 ====================

/**
 * 创建Dialog实例
 * @returns Dialog API对象
 */
export function createDialog(): any

/**
 * 创建Dialog方法集合
 * @returns Dialog方法对象
 */
export function createDialogMethods(): any

/**
 * 创建Dialog配置选项
 * @param options - 选项
 * @returns Dialog配置对象
 */
export function createDialogOptions(options?: any): any

/**
 * 在组件中使用通用Dialog的Hook
 * @returns Dialog方法对象
 */
export function useCommonDialog(): {
  commonDialogMethod: typeof commonDialogMethod
}

// ==================== 表格工具 ====================

/**
 * 创建二维码列
 * @param config - 二维码配置
 * @returns 表格列配置
 */
export function createQRCode(config?: {
  /** 二维码数据字段 */
  dataKey?: string
  /** 列宽 */
  width?: number
  /** 二维码尺寸 */
  size?: number
}): TableColumn

/**
 * 使用二维码Hook
 * @returns 二维码相关方法
 */
export function useQRCode(): {
  /** 生成二维码 */
  generateQRCode: (data: string, size?: number) => Promise<string>
  /** 下载二维码 */
  downloadQRCode: (data: string, filename?: string) => Promise<void>
}

// ==================== 插件和指令 ====================

/**
 * Vue插件对象
 */
export const CorePlugin: {
  install(app: any, options?: any): void
}

/**
 * 安装插件
 * @param app - Vue应用实例
 * @param options - 插件选项
 */
export function install(app: any, options?: any): void

/**
 * 权限指令
 */
export const permissionDirective: {
  mounted(el: HTMLElement, binding: { value: string }): void
  updated(el: HTMLElement, binding: { value: string }): void
}

/**
 * 注册所有指令
 * @param app - Vue应用实例
 */
export function registerDirectives(app: any): void

/**
 * 自动注册指令
 * @param app - Vue应用实例
 */
export function autoRegisterDirectives(app: any): void

/**
 * 获取全局应用实例
 * @returns Vue应用实例
 */
export function getGlobalApp(): any | null

declare module 'core' {
  export * from './index.d'
}

declare module 'core/*' {
  const mod: any
  export = mod
}

// 引用类型声明文件
/// <reference path="./components.d.ts" />
/// <reference path="./src.d.ts" />

