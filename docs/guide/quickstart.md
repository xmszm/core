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

### 全局引入样式（推荐）

在项目的入口文件（如 `main.js` 或 `main.ts`）中全局引入样式：

```javascript
// main.js 或 main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@xmszm/core/dist/style.css' // 全局引入样式

const app = createApp(App)
app.mount('#app')
```

### 组件中使用

```vue
<script setup>
import { ref } from 'vue'
import { DataForm, DataTable, commonDialogMethod } from '@xmszm/core'
// 如果已在全局引入样式，这里无需重复引入

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

## 初始化配置（可选）

如果需要配置全局设置或注册自定义控件类型，详见 [初始化配置](/guide/config)：

- **全局配置**：使用 `setupConfig` 配置 API 地址、权限检查、上传方法等
- **自定义控件**：使用 `setupOptions` 注册自定义 `Options` 控件类型
- **Dialog 配置**：使用 `registerDialogInstance` 注册 Dialog 实例（可选）

## 常见问题

- 找不到 `@/utils/...`：请在宿主项目配置 `@` 别名或提供对应实现。
- 样式缺失：如需库内 less 默认样式，确保引入 `@xmszm/core/dist/style.css`。**推荐在全局入口文件（如 `main.js`）中引入，这样整个项目都可以使用默认样式，无需在每个组件中重复引入。**
- TS 类型：库内已内置 `types/index.d.ts`，可直接获得基础提示。
- 自定义控件：可以通过 `setupOptions` 注册自定义控件类型，详见 [初始化配置](/guide/config)。

