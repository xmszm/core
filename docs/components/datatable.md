---
title: DataTable
---

基于 `naive-ui` `n-data-table` 的增强组件，提供列筛选、操作列、排序、虚拟滚动与省略。

## 基础用法
```vue
<script setup>
import { ref } from 'vue'
import { DataTable } from 'core'

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

## Props（常用）
- `data: Array` 数据源。
- `columns: Array` 列定义，支持 `label`/`title`、`key`、`width`、`ellipsis`、`sorter` 等。
- `pagination: Object | null` 透传 `n-data-table` 分页。
- `oprColumns: Object | null` 右侧操作列配置。
- `selectColumns: Object | null` 选择列。
- `defaultColumns: Array` 默认可见列键。
- `summaryColumns: Function` 汇总行。
- `isFilter: boolean` 是否启用列筛选。
- `isEllipsis: boolean` 默认开启省略，使用内置 `ellipsis` tooltip。
- `virtual: boolean` 虚拟滚动，默认数据量大时自动开启。

## 排序（orderEnum 内置工具）
`orderEnum` 专为 `DataTable` 列排序提供，离开表格场景单独调用无意义。

用法示例（结合后端查询参数与分页刷新）：
```js
import { orderEnum } from 'core'

const listQuery = reactive({ sortFieldName: '', desc: false })
const pageState = {
  fetchData: () => loadTableData(listQuery),
}

const columns = [
  {
    title: '创建时间',
    key: 'createdAt',
    width: 180,
    sorter: (listQueryParam, pageStateParam, key) => {
      // 选择升序/降序/默认时会进入这里
      orderEnum.ascend.fn(listQueryParam, key) // 设置排序字段与方向
      pageStateParam.fetchData() // 重新拉取数据
    },
  },
]
```

## 列筛选弹窗
- 设定 `isFilter=true` 时，右上角会出现“筛选字段”按钮。
- 弹窗使用 `FilterDialog` 组件记录用户选择，结果存储于 `localStorage`，Key 为 `filter_key + 路由全路径`。

## 省略
- 默认对列开启 `ellipsis`，使用 `core/table/utils/ellipsis` 配置 tooltip 样式。
- 可通过列的 `ellipsisProp` 自定义。

## 操作列
- 可搭配 `createActionColumnJsx` 快速生成操作列，或直接传入 `oprColumns`。
- `useDataColumnButton` / `useDataColumnPop` 组合了按钮与二次确认的通用场景。

