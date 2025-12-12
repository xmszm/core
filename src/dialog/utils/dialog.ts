import { computed, unref } from 'vue'
import type { FormOption } from '../../../types/components'

export const dialogDefaultOption = {
  showIcon: false,
  autoFocus: false,
}

interface InitRulesOptions {
  options?: FormOption[]
  model?: any
  labelField?: string
  formOpr?: Record<string, any>
}

export function initRules({
  options = [],
  model,
  labelField = 'label',
  formOpr = {},
}: InitRulesOptions) {
  return computed(
    () =>
      options?.reduce((o: Record<string, any>, { fields, ...n }: any) => {
        if (Array.isArray(n?.key)) {
          n.key.forEach((v: string) => {
            if (n?.required) {
              o[String(v)] = {
                key: v,
                type: 'any',
                required: n?.required
                  ? typeof n?.required === 'function'
                    ? n?.required(unref(model), { ...formOpr })
                    : n?.required
                  : false,
                message: n?.message || `请选择${n?.[labelField]}`,
                fields,
              }
            }
          })
        }
        const rule = n?.rule
          ? typeof n?.rule !== 'function'
            ? n?.rule
            : n?.rule(unref(model), { ...formOpr })
          : fields
            ? {
                key: n?.key,
                type: 'any',
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
                type: 'any',
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
                      validator: (rule: any) => {
                        console.log(rule)

                        const obj = n?.key.every((v: string) => unref(model)[v])
                        if (!obj && n?.required)
                          return new Error(rule?.message)

                        return true
                      },
                    }
                  : {}),
              }
        if (rule?.required) {
          o[String(n?.key)] = rule
        }

        return o
      }, {}) || {},
  )
}
