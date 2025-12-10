export const dialogDefaultOption = {
  showIcon: false,
  autoFocus: false,
}

export function initRules({
  options = [],
  model,
  labelField = 'label',
  formOpr = {},
}) {
  return computed(
    () =>
      options?.reduce((o, { fields, ...n }) => {
        if (Array.isArray(n?.key)) {
          n.key.forEach((v) => {
          if(n?.required) o[String(v)] = {
              key:v,
              type:'any',
              required: n?.required
                ? typeof n?.required === 'function'
                  ? n?.required(unref(model), { ...formOpr })
                  : n?.required
                : false,
              message: n?.message || `请选择${n?.[labelField]}`,
              fields,
            }
          })
        }
        // } else {
       const rule =  n?.rule
          ? typeof n?.rule !== 'function'
            ? n?.rule
            : n?.rule(unref(model), { ...formOpr })
          : fields
            ? {
                key: n?.key,
                  type:'any',
                required: n?.required
                  ? typeof n?.required === 'function'
                    ? n?.required(unref(model), { ...formOpr })
                    : n?.required
                  : false,
                message:
                  n?.message
                  || `请${n?.options?.length ? '选择' : '输入'}${n?.[labelField]}`,
                fields,
              }
            : {
                key: n?.key,
                  type:'any',
                required: n?.required
                  ? typeof n?.required === 'function'
                    ? n?.required(unref(model), { ...formOpr })
                    : n?.required
                  : false,
                message:
                  n?.message
                  || `请${n?.options?.length ? '选择' : '输入'}${n?.[labelField]}`,
                ...(Array.isArray(n?.key)
                  ? {
                      validator: (rule) => {
                        console.log(rule)

                        const obj = n?.key.every(v => unref(model)[v])
                        if (!obj && n?.required)
                          return new Error(rule?.message)

                        return true
                      },
                    }
                  : {}),
              }
              if(rule?.required){
                o[String(n?.key)] = rule
              }
        // }

        return o
      }, {}) || {},
  )
}
