import { useRoute, useRouter } from 'vue-router'
import { toArray } from './array'

interface RouteMeta {
  permission?: string | string[] | Record<string, any> | null
  auth?: Record<string, any>
  api?: Record<string, any>
  [key: string]: any
}

interface Route {
  name?: string | symbol
  meta?: RouteMeta
  children?: Route[]
  [key: string]: any
}

export function cellectChildenPermission(o: Route): Route {
  if (o?.children?.length) {
    const pn: (string | null)[] = []
    o.children.forEach((v) => {
      cellectChildenPermission(v)
      let arr: string[] | null = []
      if (typeof v?.meta?.permission === 'string')
        arr = [v.meta.permission]
      else if (Array.isArray(v.meta?.permission))
        arr.push(...v.meta.permission)
      else if (typeof v.meta?.permission === 'object')
        arr.push(...mergaMethod(allMethod(v.meta.permission)))
      else if (!v?.meta?.permission)
        arr = null
      v.meta.permission = arr
      if (arr) pn.push(...new Set(arr))
    })
    if (!o?.meta?.permission)
      o.meta.permission = pn.filter((v): v is string => v !== null)
    else o.meta.permission = [...new Set((o.meta.permission as string[]).concat(pn.filter((v): v is string => v !== null)))]
  }

  return o
}

export function mergaMethod(...arg: any[]): string[] {
  const arr = arg?.map(v => (Array.isArray(v) ? v : v?.ALL))
  return [].concat(...arr).filter(Boolean)
}

export function allMethod(data: any): string[] {
  if (!data) return []
  return Object.keys(data).reduce((a: string[], b: string) => {
    if (typeof data[b] !== 'string') {
      return a.concat(allMethod(data[b]))
    } else {
      a.push(data[b])
    }
    return a
  }, [])
}

export function useAuthPermission(...arg: any[]): Record<string, any> {
  return {
    ...getRouteMeta('auth', arg),
  }
}

export function useApiConfig(...arg: any[]): Record<string, any> {
  return {
    ...getRouteMeta('api', arg),
  }
}

/**
 * 处理参数替换
 * @param str - 接口字符串
 * @param op - 接口参数替换对象
 * @returns 处理后的字符串
 * @example
 * return handleParams(data?.id ? updateTask : createTask, {
 *   '{processId}': unref(processId),
 *   '{id}': data?.id,
 * })[data?.id ? '$Put' : '$Post']({
 *   ...data,
 * })
 */
export function handleParams(str?: string, op: Record<string, any> = {}): string {
  if (!str) return ''
  let result = str
  const arr = Object.keys(op)
  if (arr.length) {
    arr.forEach((v) => {
      const reg = new RegExp(`${v}`, 'g')
      result = result?.replace(reg, op[v])
    })
  }
  return result
}

function getRouteMeta(name: 'auth' | 'api', arg: any[]): Record<string, any> {
  const route = useRoute()
  const router = useRouter()
  const meta = handleMeta((route?.meta?.[name] ?? {}) as Record<string, any>)
  const routeNameArr = toArray(arg[0])

  if (routeNameArr?.length) {
    const routeArr = router
      .getRoutes()
      .filter(v => routeNameArr.includes(v.name))
    routeArr.forEach((v) => {
      if (v.meta?.[name])
        meta[v.name as string] = handleMeta(v.meta[name] as Record<string, any>)
    })
  }
  return {
    ...meta,
  }
}

function handleMeta(o: Record<string, any> = {}): Record<string, any> {
  return Object.keys(o).reduce((a: Record<string, any>, b: string) => {
    const data = o[b]
    if (typeof data === 'object')
      a[b] = data?.key
    else if (typeof data === 'string')
      a[b] = String(data)
    return a
  }, {})
}
