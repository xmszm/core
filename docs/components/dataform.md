---
title: DataForm
---

配置式表单组件，依赖 `Options` 渲染字段，并自动生成校验规则。

## 基础用法
```vue
<script setup>
import { ref } from 'vue'
import { DataForm } from '@xmszm/core'

const model = ref({})
const options = [
  { key: 'name', label: '名称', way: 'input', required: true },
  {
    key: 'type',
    label: '类型',
    way: 'select',
    options: [{ label: 'A', value: 'a' }],
    required: true,
  },
]
</script>

<template>
  <DataForm v-model:value="model" :options="options" />
</template>
```

## Props
- `options: Array` 表单项配置，透传给 `Options`。
- `value (v-model:value): Object` 表单数据。
- `read: boolean` 只读模式。
- `labelField: string` 默认 `label`，决定 label 字段名。
- `formProps: Object` 透传给 `naive-ui` `NForm`。
- `formItemProps: Object` 透传给每个 `NFormItem`。
- `dialog: boolean` 在弹窗场景下使用时自动附加样式。
- `rules: Object` 自定义校验规则；不传则根据 `options` 自动生成。

## Options 关键字段
- `key` 必填，字段键名。支持数组键用于区间。
- `label` 显示文本。
- `way` 字段类型，默认 `input`。常用：`select`、`date`、`dateRange`、`time`、`radio`、`switch`、`uploadFile`、`image`、`dataTable` 等。
- `options / enum` 选择类数据。`enum` 会通过 `ObjectToArray` 转数组。
- `props` 透传到具体控件（如 `NInput`、`NSelect`）。
- `formItemProps` 透传到 `NFormItem`，可控制 label、样式、校验反馈等。
- `required / rule / message` 影响自动校验。
- `render` 自定义渲染，优先级最高。

## 方法（defineExpose）
- `formRef` Naive UI `NForm` 实例引用。
- `getRule()` 获取自动生成的 rules。
- `valid(keyCode?: string[])` 返回 Promise，支持按键位校验。
- `confirm(fn)` 触发校验后执行回调。

## 场景提示
- 自动校验逻辑由 `initRules` 提供，`required`/`rule`/`message` 会影响生成结果。
- 若需要动态选项，可在 `options` 内传入函数或 `ref`，组件内部会自动解包。
- 弹窗模式结合 `commonDialogMethod` 使用最少代码完成「表单 + 弹窗 + 校验 + 提交」。

