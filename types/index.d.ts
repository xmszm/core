import type { Component } from 'vue'

export interface CommonDialogResult {
  cancel(): void
  setValue(v: any, key?: string): void
  model: any
  modeEnum: Record<string, { sub?: string; read?: boolean }>
}

export function commonDialogMethod(
  options?: Record<string, any>,
  dialogProps?: Record<string, any>,
): CommonDialogResult

export const DataForm: Component
export const Options: Component
export const CommonQuery: Component
export const DataTable: Component
export const OprButton: Component
export const Pop: Component

export function createActionColumnJsx(...args: any[]): any
export function initRules(args: {
  options?: any[]
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

