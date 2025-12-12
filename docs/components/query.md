---
title: CommonQuery
---

查询表单组件，基于 `DataForm` 封装，支持自动提交/重置按钮。

## 基础用法
```vue
<script setup>
import { ref } from 'vue'
import { CommonQuery } from '@xmszm/core'

const query = ref({})
const options = [
  { key: 'keyword', label: '关键词', way: 'input' },
  { key: 'type', label: '类型', way: 'select', options: [{ label: 'A', value: 'a' }] },
]

function onSubmit() {
  // 根据 query.value 触发列表请求
}
</script>

<template>
  <CommonQuery v-model:query="query" :options="options" @submit="onSubmit" @reset="onReset" />
</template>
```

### 完整示例（结合分页）

```vue
<script setup>
import { reactive } from 'vue'
import { CommonQuery } from '@xmszm/core'

const listQuery = reactive({
  page: 1,
  pageSize: 10,
  likeQuery: {
    keyword: '',
    type: '',
  },
})

const queryOptions = [
  { label: '关键词', key: 'keyword', queryType: 'likeQuery', way: 'input' },
  { label: '类型', key: 'type', queryType: 'likeQuery', way: 'select', options: [
    { label: '类型A', value: 'A' },
    { label: '类型B', value: 'B' }
  ]},
]

function handleSearch() {
  listQuery.page = 1
  fetchData()
}

function handleReset() {
  listQuery.likeQuery = { keyword: '', type: '' }
  listQuery.page = 1
  fetchData()
}
</script>

<template>
  <CommonQuery
    :query="listQuery"
    :options="queryOptions"
    @submit="handleSearch"
    @reset="handleReset"
  />
</template>
```

## Props

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| `options` | 否 | `Array` | 查询项配置，规则同 `Options`，默认 `[]` |
| `query` / `v-model:query` | 否 | `Object` | 查询对象，支持 v-model 双向绑定，默认 `{}` |
| `inlineText` | 否 | `boolean` | 布局控制，默认 `true` |
| `selectCount` | 否 | `number` | 每行显示的查询项数量，默认 `1` |
| `type` | 否 | `string` | 按钮类型（传给 `NButton`），默认 `'primary'` |
| `noButton` | 否 | `boolean` | 是否隐藏底部按钮区，默认 `false` |
| `btn` | 否 | `string[]` | 按钮配置数组，默认 `['reset', 'search']` |
| `size` | 否 | `string` | 传入控件尺寸，默认 `'medium'` |
| `isRead` | 否 | `boolean` | 只读模式，默认 `false` |

## 事件

| 事件名 | 类型 | 说明 |
|--------|------|------|
| `update:query` | `(query: Object) => void` | 查询对象变化时触发，用于 v-model 双向绑定 |
| `submit` | `() => void` | 点击搜索或回车触发（内置 500ms 防抖） |
| `reset` | `() => void` | 重置查询模型时触发 |

## 特性
- 默认监听全局 Enter 键以触发搜索。
- 为 `input`/`select` 自动绑定 `onUpdateValue`，输入即触发防抖搜索，可通过 `props.onUpdateValue` 自定义。
- `formProps` 默认关闭校验反馈，适合轻量搜索区域。
- `options` 配置项支持 `queryType` 字段，用于指定查询参数类型，详见 [CommonQuery queryType 说明](/components/config-options#commonquery-querytype-说明)。
- `options` 中的 `way` 字段支持自定义控件类型，可通过 `setupOptions` 注册，详见 [初始化配置 - Options 注册](/guide/config#options-注册)。

