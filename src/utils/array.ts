import { unref } from 'vue'
import {
  labelField as globalLabelField,
  valueField as globalValueField,
} from '../enum/options'

export function ArrayToObject<T extends Record<string, any> = any>(
  arr: T[] = [],
  {
    labelField = globalLabelField,
    valueField = globalValueField,
  }: {
    labelField?: string
    valueField?: string
  } = {
    labelField: globalLabelField,
    valueField: globalValueField,
  },
): Record<string, T> {
  return unref(arr).reduce((o: Record<string, T>, n: T) => {
    o[n[valueField] as string] = {
      ...n,
      [labelField]: n[labelField],
      [valueField]: n[valueField],
    }
    return o
  }, {})
}

export function toArray<T = any>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}
