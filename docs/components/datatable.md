---
title: DataTable
---

基于 `naive-ui` `n-data-table` 的增强组件，提供列筛选、操作列、虚拟滚动与省略。

## 基础用法
```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from '@xmszm/core'

const columns = [
  { title: '名称', key: 'name', width: 160 },
  { title: '类型', key: 'type', width: 120 },
]
const data = ref([
  { name: '苹果', type: '水果' },
  { name: '可乐', type: '饮品' },
])
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

## Props

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| `data` | 否 | `Array` | 数据源，默认 `[]` |
| `columns` | 否 | `Array` | 列定义，支持 `label`/`title`、`key`、`width`、`ellipsis` 等 |
| `pagination` | 否 | `Object \| null` | 透传 `n-data-table` 分页配置 |
| `oprColumns` | 否 | `Object \| null` | 右侧操作列配置（模板中使用 `opr-columns`） |
| `selectColumns` | 否 | `Object \| null` | 选择列配置（模板中使用 `select-columns`） |
| `defaultColumns` | 否 | `Array` | 默认可见列键（模板中使用 `default-columns`），默认 `[]` |
| `summaryColumns` | 否 | `Function \| null` | 汇总行函数（模板中使用 `summary-columns`） |
| `isFilter` | 否 | `boolean` | 是否启用列筛选，默认 `false` |
| `isEllipsis` | 否 | `boolean` | 是否开启省略，使用内置 `ellipsis` tooltip，默认 `true` |
| `virtual` | 否 | `boolean \| Object` | 虚拟滚动配置，默认数据量大时自动开启 |
| `rowKey` | 否 | `Function \| String` | 行键，用于标识每一行数据 |
| `emptyText` | 否 | `string` | 空数据提示文本，默认 `'没有数据'` |
| `emptyIcon` | 否 | `string` | 空数据图标，默认 `''` |
| `singleColumn` | 否 | `boolean` | 单列模式，默认 `false` |

## 事件

## 列筛选弹窗
- 设定 `isFilter=true` 时，右上角会出现“筛选字段”按钮。
- 弹窗使用 `FilterDialog` 组件记录用户选择，结果存储于 `localStorage`，Key 为 `filter_key + 路由全路径`。

## 省略
- 默认对列开启 `ellipsis`，使用 `@xmszm/core/table/utils/ellipsis` 配置 tooltip 样式。
- 可通过列的 `ellipsisProp` 自定义。

## 操作列
- 可搭配 `createActionColumnJsx` 快速生成操作列，或直接传入 `oprColumns`。
- `useDataColumnButton` / `useDataColumnPop` 组合了按钮与二次确认的通用场景。

### 使用示例

```vue
<script setup>
import { DataTable, createActionColumnJsx } from '@xmszm/core'

const columns = [
  { title: '名称', key: 'name', width: 160 },
  { title: '类型', key: 'type', width: 120 },
]

const opr = createActionColumnJsx([
  {
    label: '编辑',
    type: 'primary',
    onClick: (row) => handleEdit(row),
  },
  {
    label: '删除',
    type: 'error',
    mode: 'pop',
    onClick: (row) => handleDelete(row),
  },
])
</script>

<template>
  <DataTable
    :data="tableData"
    :columns="columns"
    :opr-columns="opr"
    :row-key="row => row?.id"
  />
</template>
```

