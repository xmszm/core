---
title: Options（动态项渲染）
---

`Options` 负责根据配置渲染具体表单项，可单独使用，也被 `DataForm` 组合。

## 基础用法
```vue
<script setup>
import { ref } from 'vue'
import { Options } from '@xmszm/core'

const model = ref({})
const formRef = ref()
const option = [
  { key: 'name', label: '名称', way: 'input', required: true },
  { key: 'age', label: '年龄', way: 'inputNumber', props: { min: 0 } },
  {
    key: 'tags',
    label: '标签',
    way: 'select',
    props: { multiple: true },
    options: [{ label: 'A', value: 'a' }],
  },
]
</script>

<template>
  <Options v-model:value="model" :option="option" :form-ref="formRef" />
</template>
```

## Props
- `option: Array` 字段配置。
- `value (v-model:value): Object` 数据对象。
- `read: boolean` 只读模式。
- `labelField` / `valueField`：默认取全局常量 `globalLabelField` / `globalValueField`。
- `formRef`: 供内部校验、重置使用。
- `formProps`: 透传给外层布局。
- `style`: 根容器样式。

## 配置字段说明
- `way`: 控件类型（input/select/date/time/dateRange/radio/switch/uploadFile/image/dataTable/button 等）。
- `default / prefix / suffix`: 支持函数或对象，组合渲染布局。
- `props`: 透传控件的属性，支持函数，入参包含 `formRef`、`setValue`。
- `formItemProps`: 透传 `NFormItem`，可控制 label/反馈/样式。
- `render`: 完全自定义渲染。
- `isRender`: 布尔或函数，控制是否渲染该项。
- `enum`: 对象形式的枚举，将被转换为数组。

## Tips
- `options` 内的函数会收到当前表单值与 formRef，可做动态显隐、联动控制。
- 只读模式会在大多数字段内回显文本，而不渲染输入控件。
- `labelSuffix`/`labelSuffixProps` 支持传入图标（示例使用 `SvgIcon`）。

