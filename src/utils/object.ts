import { unref } from 'vue'
import {
  labelField as globalLabelField,
  valueField as globalValueField,
} from '../enum/options'

export function ObjectToArray(
  obj,
  { labelField = globalLabelField, valueField = globalValueField } = {},
) {
  return Object.keys(obj).reduce((o, n) => {
    const data = toObject(obj[n], n)
    const params = {
      ...data,
    }
    params[labelField] = data?.[labelField]
    params[valueField] = data?.[valueField]
    return o.concat(params)
  }, [])
}

export function toObject(label, value) {
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
