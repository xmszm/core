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

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| `options` | 否 | `Array` | 表单项配置，透传给 `Options` |
| `value` / `v-model:value` | 否 | `Object` | 表单数据，支持 v-model 双向绑定 |
| `read` | 否 | `boolean` | 只读模式，默认 `false` |
| `labelField` | 否 | `string` | 决定 label 字段名，默认 `'label'` |
| `formProps` | 否 | `Object` | 透传给 `naive-ui` `NForm` 的属性 |
| `formItemProps` | 否 | `Object` | 透传给每个 `NFormItem` 的属性 |
| `dialog` | 否 | `boolean` | 在弹窗场景下使用时自动附加样式，默认 `false` |
| `rules` | 否 | `Object` | 自定义校验规则；不传则根据 `options` 自动生成 |
| `isNo` | 否 | `boolean` | 内容最小高度控制，默认 `true` |
| `contentStyle` | 否 | `Object` | 内容区域样式，默认 `{}` |

## Options 配置字段

`options` 配置项使用 [Options 配置字段](/components/config-options#options-配置字段)，详见配置项说明文档。

## 方法（defineExpose）

| 方法名 | 类型 | 说明 |
|--------|------|------|
| `formRef` | `Ref<FormInstance>` | Naive UI `NForm` 实例引用 |
| `getRule()` | `() => Object` | 获取自动生成的 rules |
| `valid(keyCode?)` | `(keyCode?: string[]) => Promise<void>` | 表单校验，返回 Promise，支持按键位校验 |
| `confirm(fn)` | `(fn?: Function) => Promise<Object>` | 触发校验后执行回调，返回 Promise |

## initRules

`initRules` 用于根据 `options` 配置自动生成表单校验规则。规则处理基于 [async-validator](https://github.com/yiminghe/async-validator) 库。

```javascript
import { initRules } from '@xmszm/core'

const options = [
  { key: 'name', label: '名称', way: 'input', required: true },
  { key: 'email', label: '邮箱', way: 'input', rule: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/ },
]

const rules = initRules(options)
// => {
//   name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
//   email: [{ pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '请输入正确的邮箱', trigger: 'blur' }]
// }
```

### 规则生成逻辑

#### required

- `required: true`：自动生成必填校验
- 默认情况下，只需要 `required: true` 即可满足大部分校验需求

```javascript
const options = [
  { key: 'name', label: '名称', way: 'input', required: true },
  // 自动生成：{ required: true, message: '请输入名称', trigger: 'blur' }
]
```

#### rule（自定义校验规则）

`rule` 支持以下形式：

1. **对象形式**：直接传入校验规则对象

```javascript
const options = [
  {
    key: 'age',
    label: '年龄',
    way: 'input',
    rule: {
      type: 'number',
      min: 18,
      max: 100,
      message: '年龄必须在 18-100 之间',
    },
  },
]
```

2. **函数形式**：函数返回校验规则对象，可以根据当前值和表单数据动态生成规则

```javascript
const options = [
  {
    key: 'password',
    label: '密码',
    way: 'input',
    rule: (value, formData) => {
      // 函数返回的是规则配置对象，可以根据 value 和 formData 动态生成规则
      if (value && value.length < 8) {
        return {
          required: true,
          message: '密码长度不能少于 8 位',
        }
      }
      // 返回规则对象，用于动态校验
      return {
        required: true,
        min: 8,
        message: '密码长度不能少于 8 位',
      }
    },
  },
  {
    key: 'confirmPassword',
    label: '确认密码',
    way: 'input',
    rule: (value, formData) => {
      // 可以根据其他字段的值动态生成规则
      return {
        required: true,
        validator: (rule, val) => {
          if (val !== formData.password) {
            return Promise.reject('两次输入的密码不一致')
          }
          return Promise.resolve()
        },
      }
    },
  },
]
```

::: tip 函数形式的优势
函数形式的 `rule` 可以根据当前字段的值（`value`）和整个表单数据（`formData`）动态生成校验规则，从而实现：
- 动态必填校验（根据其他字段的值决定是否必填）
- 联动校验（如确认密码需要与密码一致）
- 条件校验（根据表单状态动态调整校验规则）
:::

::: warning 重要提示
当使用 `rule` 自定义校验规则时，**外部的 `required` 配置将无效**。如果需要在自定义规则中包含必填校验，请在 `rule` 对象中显式设置 `required: true`。

```javascript
// ❌ 错误：rule 存在时，外部的 required 无效
{
  key: 'name',
  required: true,
  rule: { type: 'string', min: 2 },
}

// ✅ 正确：在 rule 中包含 required
{
  key: 'name',
  rule: {
    type: 'string',
    required: true,
    min: 2,
    message: '名称至少需要 2 个字符',
  },
}
```
:::

#### message

自定义错误提示信息。

```javascript
const options = [
  {
    key: 'name',
    label: '名称',
    way: 'input',
    required: true,
    message: '请输入您的姓名', // 自定义错误提示
  },
]
```

### 参考文档

更多关于校验规则的详细说明，请参考 [async-validator](https://github.com/yiminghe/async-validator) 官方文档。

## 场景提示
- 自动校验逻辑由 `initRules` 提供，`required`/`rule`/`message` 会影响生成结果。
- 若需要动态选项，可在 `options` 内传入函数或 `ref`，组件内部会自动解包。
- 弹窗模式结合 `commonDialogMethod` 使用最少代码完成「表单 + 弹窗 + 校验 + 提交」。
- `options` 中的 `way` 字段支持自定义控件类型，可通过 `setupOptions` 注册，详见 [初始化配置 - Options 注册](/guide/config#options-注册)。

