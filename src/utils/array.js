import { unref } from 'vue'
import {
  labelField as globalLabelField,
  valueField as globalValueField,
} from '../enum/options'

export function ArrayToObject(
  arr = [],
  { labelField = globalLabelField, valueField = globalValueField } = {
    labelField: globalLabelField,
    valueField: globalValueField,
  },
) {
  return unref(arr).reduce((o, n) => {
    o[n[valueField]] = {
      ...n,
      [labelField]: n[labelField],
      [valueField]: n[valueField],
    }
    return o
  }, {})
}

export function toArray(v) {
  return Array.isArray(v) ? v : [v]
}
