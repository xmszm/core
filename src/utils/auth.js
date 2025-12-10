import { useRoute, useRouter } from 'vue-router'
import { toArray } from './array'

export function cellectChildenPermission(o) {
  if (o?.children?.length) {
    const pn = []
    o.children.forEach((v) => {
      cellectChildenPermission(v)
      let arr = []
      if (typeof v?.meta?.permission === 'string')
        arr = [v.meta.permission]
      else if (Array.isArray(v.meta?.permission))
        arr.push(...v.meta.permission)
      else if (typeof v.meta?.permission === 'object')
        arr.push(...mergaMethod(allMethod(v.meta.permission)))
      else if (!v?.meta?.permission)
        arr = null
      v.meta.permission = arr
      pn.push(...new Set(arr))
    })
    if (!o?.meta?.permission)
      o.meta.permission = pn
    else o.meta.permission = [...new Set(o.meta.permission.concat(pn))]
  }

  return o
}
export function mergaMethod(...arg) {
  const arr = arg?.map(v => (Array.isArray(v) ? v : v?.ALL))
  return [].concat(...arr)
}

export function allMethod(data) {
  if (!data)
    return []
  return Object.keys(data).reduce((a, b) => {
    if (typeof data[b] !== 'string') {
      a.concat(allMethod(data[b]))
    }
    else {
      a.push(data[b])
    }
    return a
  }, [])
}

export function useAuthPermission(...arg) {
  return {
    ...getRouteMeta('auth', arg),
  }
}

export function useApiConfig(...arg) {
  return {
    ...getRouteMeta('api', arg),
  }
}

/**
 *
 * @param {*} str 接口字符串
 * @param {*} op 接口参数替换
 * @returns
 * return handleParams(data?.id ? updateTask : createTask, {
      '{processId}': unref(processId),
      '{id}': data?.id,
    })[data?.id ? '$Put' : '$Post']({
      ...data,
    }).then(() => {
      reLoad()
      $message.success(`${modeEnum[str]?.sub}成功`)
      cancel()
      if (isNext.value)
        onAdd()
    })
 */

export function handleParams(str, op = {}) {
  const arr = Object.keys(op)
  if (arr.length) {
    arr.forEach((v) => {
      const reg = new RegExp(`${v}`, 'g')
      str = str?.replace(reg, op[v])
    })
  }
  return str
}

function getRouteMeta(name, arg) {
  const route = useRoute()
  const router = useRouter()
  const meta = handleMeta(route?.meta?.[name] ?? {})
  const routeNameArr = toArray(arg[0])

  if (routeNameArr?.length) {
    const routeArr = router
      .getRoutes()
      .filter(v => routeNameArr.includes(v.name))
    routeArr.forEach((v) => {
      if (v.meta?.[name])
        meta[v.name] = handleMeta(v.meta[name])
    })
  }
  return {
    ...meta,
  }
}

function handleMeta(o = {}) {
  return Object.keys(o).reduce((a, b) => {
    const data = o[b]
    if (typeof data === 'object')
      a[b] = data?.key
    else if (typeof data === 'string')
      a[b] = String(data)
    return a
  }, {})
}
