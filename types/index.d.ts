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

export function getAllOptions(...args: any[]): any
export function getOptions(...args: any[]): any
export function setupOptions(...args: any[]): any

export function toArray<T = any>(v: T | T[]): T[]
export function ArrayToObject<T = any>(
  arr?: T[],
  fields?: { labelField?: string; valueField?: string },
): Record<string, T>
export function ObjectToArray<T extends Record<string, any> = any>(
  obj?: T,
  fields?: { labelField?: string; valueField?: string },
): any[]

export function customUpload(...args: any[]): Promise<any>
export function registryUpload(fn: (...args: any[]) => Promise<any>): void
export function getFileUrl(url?: string, ossSize?: number | null): string | undefined

export function cellectChildenPermission(route: any): any
export function handleParams(str?: string, op?: Record<string, any>): string
export function useApiConfig(...args: any[]): Record<string, any>
export function useAuthPermission(...args: any[]): Record<string, any>
export function initRouteMeta(routes: any[], base?: string): any[]

export const ellipsis: any
export const orderEnum: Record<string, any>
export const globalLabelField: string
export const globalValueField: string

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

