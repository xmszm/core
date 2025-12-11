---
title: 快速开始
---

## 安装

```bash
npm install @xmszm/core
# 或
pnpm add @xmszm/core
# 或
yarn add @xmszm/core
```

同时请在项目中安装（或确保已存在）以下 peer 依赖（版本可按你项目统一）：

- `vue` >= 3.3.0
- `naive-ui` >= 2.38.0
- `vue-router` >= 4.2.0
- `dayjs` >= 1.11.0
- `lodash-es` >= 4.17.21
- `@vicons/ionicons5` >= 0.13.0

> 若项目使用 `@` 路径别名，请确认在构建/运行配置中存在相同的 alias。

## 引入与基本使用

```vue
<script setup>
import { ref } from 'vue'
import { DataForm, DataTable, commonDialogMethod } from '@xmszm/core'
import '@xmszm/core/dist/style.css' // 如需默认样式

const formValue = ref({})
const formOptions = [
  { key: 'name', label: '名称', way: 'input', required: true },
  { key: 'type', label: '类型', way: 'select', options: [{ label: 'A', value: 'a' }] },
]

const tableColumns = [
  { title: '名称', key: 'name', width: 160 },
  { title: '类型', key: 'type', width: 100 },
]
const tableData = ref([{ name: '示例', type: 'a' }])

function openDialog() {
  commonDialogMethod({
    title: '示例弹窗',
    options: formOptions,
    valueData: { name: '张三' },
    interfaceFn: async () => {
      // 这里提交数据
    },
  })
}
</script>

<template>
  <div class="p-16">
    <DataForm v-model:value="formValue" :options="formOptions" />
    <DataTable :data="tableData" :columns="tableColumns" style="margin-top: 12px" />
    <button @click="openDialog">打开弹窗</button>
  </div>
</template>
```

## 目录结构建议

```text
docs/                # VitePress 文档
examples/demo.vue    # 可运行的最小示例
src/                 # 组件与工具源码
types/               # 类型定义
```

## 常见问题

- 找不到 `@/utils/...`：请在宿主项目配置 `@` 别名或提供对应实现。
- 样式缺失：如需库内 less 默认样式，确保引入 `@xmszm/core/dist/style.css`。
- TS 类型：库内已内置 `types/index.d.ts`，可直接获得基础提示。

