export function initRouteMeta(routes, str = '') {
  if (routes.length) {
    routes.forEach((v) => {
      if (v.children) {
        initRouteMeta(v.children, v?.path)
      }
      if (v.path)
        v.sourceFullPath = `${str ? `${str}/`.replace(/^\/\//, '/') : ''}${v.path}`

      if (!v.meta)
        v.meta = {}
      const title = v?.title ?? v?.meta?.title ?? '未命名页面'

      if (v?.api)
        v.meta.api = v.api

      if (title) {
        v.meta.title = title
        v.title = title
      }

      if (v?.hidden)
        v.meta.hidden = v.hidden

      let authPermission = []
      if (v?.auth) {
        v.meta.auth = v.auth

        authPermission = Object.keys(v.auth).reduce((a, b) => {
          if (typeof v.auth[b] === 'string')
            a.push(v.auth[b])
          else if (typeof v.auth[b] === 'boolean')
            a.push(b)
          return a
        }, [])
      }

      if (v?.permission)
        v.meta.permission = v.permission

      if (v.meta.permission && Array.isArray(v.meta.permission)) {
        v.meta.permission = v.meta.permission.concat(authPermission)
      }
      else if (authPermission.length) {
        v.meta.permission = authPermission
      }
    })

    return routes
  }
  else {
    return []
  }
}
