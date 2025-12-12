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

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| `option` | 否 | `Array` | 字段配置数组，默认 `[]` |
| `value` / `v-model:value` | 否 | `Object` | 数据对象，支持 v-model 双向绑定，默认 `{}` |
| `read` | 否 | `boolean` | 只读模式，默认 `false` |
| `labelField` | 否 | `string` | label 字段名，默认取全局常量 `globalLabelField`（`'name'`） |
| `valueField` | 否 | `string` | value 字段名，默认取全局常量 `globalValueField`（`'id'`） |

::: tip 全局字段常量
- `globalLabelField`：默认值为 `'name'`，用于指定选项数组中 label 字段名
- `globalValueField`：默认值为 `'id'`，用于指定选项数组中 value 字段名

这些常量可以在组件级别通过 `labelField` 和 `valueField` props 覆盖。
:::
| `formRef` | 否 | `Object` | 表单引用，供内部校验、重置使用，默认 `{}` |
| `formProps` | 否 | `Object` | 透传给外层布局的属性，默认 `{}` |
| `style` | 否 | `Object` | 根容器样式，默认 `{}` |

## 配置字段说明

`option` 配置项使用 [Options 配置字段](/components/config-options#options-配置字段)，详见配置项说明文档。

## 自定义控件类型

`Options` 支持通过 `setupOptions` 注册自定义控件类型，详见 [初始化配置 - Options 注册](/guide/config#options-注册)。

### 示例

```javascript
// main.js
import { setupOptions } from '@xmszm/core'
import { NCascader } from 'naive-ui'

// 注册自定义控件
setupOptions('cascader', (item, { _value, _isRead }) => {
  return <NCascader v-model:value={_value[item.key]} options={item.options} />
})

// 使用
const options = [
  { key: 'region', label: '地区', way: 'cascader', options: regionData }
]
```

## Tips
- `options` 内的函数会收到当前表单值与 formRef，可做动态显隐、联动控制。
- 只读模式会在大多数字段内回显文本，而不渲染输入控件。
- `labelSuffix`/`labelSuffixProps` 支持传入图标（示例使用 `SvgIcon`）。
- 可以通过 `setupOptions` 扩展自定义控件类型，详见 [初始化配置](/guide/config)。

