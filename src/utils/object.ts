import { unref } from 'vue'
import {
  labelField as globalLabelField,
  valueField as globalValueField,
} from '../enum/options'

export function ObjectToArray<T extends Record<string, any> = any>(
  obj: Record<string, any>,
  {
    labelField = globalLabelField,
    valueField = globalValueField,
  }: {
    labelField?: string
    valueField?: string
  } = {},
): T[] {
  return Object.keys(obj).reduce((o: T[], n: string) => {
    const data = toObject(obj[n], n)
    const params = {
      ...data,
    } as T
    ;(params as any)[labelField] = data?.[labelField]
    ;(params as any)[valueField] = data?.[valueField]
    return o.concat(params)
  }, [])
}

export function toObject(
  label: any,
  value: string | number,
): Record<string, any> {
  const params = {
    [globalLabelField]: unref(label),
    [globalValueField]: Number.isNaN(Number(value)) ? value : Number(value),
  }
  return typeof unref(label) === 'object'
    ? {
        ...unref(label),
        [globalValueField]: Number.isNaN(Number(value)) ? value : Number(value),
      }
    : params
}
