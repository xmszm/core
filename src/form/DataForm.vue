<script setup>
import { NForm } from 'naive-ui'
import { ref, unref } from 'vue'

import Options from '../options/Options.jsx'
import {initRules} from '../dialog/utils/dialog.js'
import { toArray } from 'core'
import { registerDirectives } from '../directives/auto-register'
import { getCurrentInstance } from 'vue'

// 自动注册指令
const instance = getCurrentInstance()
if (instance?.appContext?.app) {
  registerDirectives(instance.appContext.app)
}
const props = defineProps({
  isNo: {
    type: Boolean,
    default: () => true
  },
  read: {
    type: Boolean,
    default: () => false
  },
  labelField: {
    type: String,
    default: () => 'label'
  },
  contentStyle: {
    type: Object,
    default: () => ({})
  },
  options: {
    type: Array,
    default: () => []
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  formProps: {
    type: Object,
    default: () => ({})
  },
  formItemProps: {
    type: Object,
    default: () => ({})
  },
  dialog: {
    type: Boolean,
    default: () => false
  }
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

defineExpose({
  formRef,
  getRule: () => autoRules.value,
  valid: (keyCode = []) =>{
    console.log('?? valid',keyCode);
    return new Promise((resolve, reject) => {
      const arrCode = toArray(keyCode)
      formRef.value?.validate((v) => {
        if (v) return reject(v)
        resolve()
      },(v)=> arrCode.length ?  arrCode.includes(v?.key) : true)
    })
  },
  confirm: (fn) =>
    new Promise((resolve, reject) => {
      formRef.value?.validate((v) => {
        if (v) return reject(v)
        fn && fn(unref(_model))
        resolve(unref(_model))
      })
    })
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
