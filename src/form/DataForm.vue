<script setup lang="ts">
import { NForm } from 'naive-ui'
import { ref, unref, computed } from 'vue'
import type { DataFormProps, DataFormExpose } from '../../types/components'

import Options from '../options/Options'
import { initRules } from '../dialog/utils/dialog'
import { toArray } from '../utils/array'
import { registerDirectives } from '../directives/auto-register'
import { getCurrentInstance } from 'vue'

// 自动注册指令
const instance = getCurrentInstance()
if (instance?.appContext?.app) {
  registerDirectives(instance.appContext.app)
}
const props = withDefaults(defineProps<DataFormProps>(), {
  isNo: true,
  read: false,
  labelField: 'label',
  contentStyle: () => ({}),
  options: () => [],
  rules: () => ({}),
  formProps: () => ({}),
  formItemProps: () => ({}),
  dialog: false,
})
const _options = computed(() => props.options)
// ====== 复制 initRules 逻辑 ======

const formRef = ref()

const _model = defineModel('value', {
  type: Object,
  default: () => ({})
})

// 自动生成 rules，优先用 props.rules
const autoRules = computed(() => {
  return unref(
    _options.value
      ? initRules({
          options: _options.value,
          model: _model,
          labelField: props.labelField,
          formOpr: { formRef }
        })
      : {}
  )
})
console.log(autoRules.value);

defineExpose<DataFormExpose>({
  formRef,
  getRule: () => autoRules.value,
  valid: (keyCode: string[] = []) => {
    console.log('?? valid', keyCode)
    return new Promise<void>((resolve, reject) => {
      const arrCode = toArray(keyCode)
      formRef.value?.validate((v: any) => {
        if (v) return reject(v)
        resolve()
      }, (v: any) => arrCode.length ? arrCode.includes(v?.key) : true)
    })
  },
  confirm: (fn?: (model: any) => void) =>
    new Promise<any>((resolve, reject) => {
      formRef.value?.validate((v: any) => {
        if (v) return reject(v)
        fn && fn(unref(_model))
        resolve(unref(_model))
      })
    }),
})
</script>

<template>
  <NForm
    ref="formRef"
    :model="_model"
    :rules="props.read ? {} : autoRules"
    label-placement="left"
    label-width="100px"
    require-mark-placement="right-hanging"
    :class="
      props.dialog
        ? props.read
          ? 'core-dialog-content'
          : 'core-dialog-main'
        : ''
    "
    :style="{ minHeight: props.isNo ? 'unset' : null }"
    v-bind="props.formProps"
  >
    <Options
      v-model:value="_model"
      :form-ref="formRef"
      :option="props.options"
      :label-field="props.labelField"
      :read="props.read"
      :style="props.contentStyle"
      :form-props="props.formProps"
    />
  </NForm>
</template>

<style lang="less" scoped></style>
