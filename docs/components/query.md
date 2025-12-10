---
title: CommonQuery
---

查询表单组件，基于 `DataForm` 封装，支持自动提交/重置按钮。

## 基础用法
```vue
<script setup>
import { ref } from 'vue'
import { CommonQuery } from 'core'

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
  <CommonQuery v-model:query="query" :options="options" @submit="onSubmit" />
</template>
```

## Props
- `options: Array` 查询项配置，规则同 `Options`。
- `query (v-model:query): Object` 查询对象。
- `inlineText: boolean` 布局控制。
- `selectCount: number` 默认 1。
- `type: string` 按钮类型（传给 `NButton`）。
- `noButton: boolean` 隐藏底部按钮区。
- `btn: string[]` 默认 `['reset', 'search']`。
- `size: string` 传入控件尺寸。
- `isRead: boolean` 只读。

## 事件
- `update:query` 双向绑定。
- `submit` 点击搜索或回车触发（内置 500ms 防抖）。
- `reset` 重置查询模型。

## 特性
- 默认监听全局 Enter 键以触发搜索。
- 为 `input`/`select` 自动绑定 `onUpdateValue`，输入即触发防抖搜索，可通过 `props.onUpdateValue` 自定义。
- `formProps` 默认关闭校验反馈，适合轻量搜索区域。

