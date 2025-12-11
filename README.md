# @xmszm/core

基于 Vue 3 + Naive UI 的组件与工具库，提供开箱即用的配置式表单、表格、弹窗等常用组件，以及丰富的工具函数集合。

## ✨ 特性

- 🎨 **配置化表单** - 通过 Options 定义字段，自动生成 rules，轻松构建复杂表单
- 📊 **表格增强** - 内置操作列创建器、排序、筛选、虚拟滚动与省略 tooltip
- 🪟 **弹窗集成** - `commonDialogMethod` 将表单与弹窗能力合并，减少样板代码
- 🛠️ **实用工具** - 上传、权限、路由 meta 初始化、数组对象转换等常用方法

## 📦 安装

```bash
npm install @xmszm/core
# 或
pnpm add @xmszm/core
# 或
yarn add @xmszm/core
```

###  peer 依赖

请确保项目中已安装以下依赖：

- `vue` >= 3.3.0
- `naive-ui` >= 2.38.0
- `vue-router` >= 4.2.0
- `dayjs` >= 1.11.0
- `lodash-es` >= 4.17.21
- `@vicons/ionicons5` >= 0.13.0

## 🚀 快速开始

### 引入组件和样式

```javascript
import { DataForm, DataTable, CommonQuery, commonDialogMethod } from '@xmszm/core'
import '@xmszm/core/dist/style.css'
```

### 基础示例

```vue
<template>
  <div>
    <!-- 表单 -->
    <DataForm v-model:value="formValue" :options="formOptions" />
    
    <!-- 表格 -->
    <DataTable :data="tableData" :columns="columns" />
    
    <!-- 查询 -->
    <CommonQuery :query="query" :options="queryOptions" @submit="handleSearch" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DataForm, DataTable, CommonQuery, commonDialogMethod } from '@xmszm/core'
import '@xmszm/core/dist/style.css'

const formValue = ref({})
const formOptions = [
  { key: 'name', label: '名称', way: 'input', required: true },
  { key: 'type', label: '类型', way: 'select', options: [
    { label: '类型A', value: 'A' },
    { label: '类型B', value: 'B' }
  ]}
]

const columns = [
  { title: '名称', key: 'name', width: 160 },
  { title: '类型', key: 'type', width: 120 }
]
const tableData = ref([
  { id: 1, name: '示例1', type: 'A' },
  { id: 2, name: '示例2', type: 'B' }
])

// 弹窗示例
function openDialog() {
  commonDialogMethod({
    title: '示例弹窗',
    options: formOptions,
    valueData: { name: '张三' },
    interfaceFn: async (data, { close }) => {
      console.log('提交数据', data)
      close()
    }
  })
}
</script>
```

## 📚 主要组件

### DataForm
配置式表单组件，支持多种输入方式（input、select、date-picker 等）

### DataTable
增强型表格组件，支持排序、筛选、操作列、虚拟滚动等功能

### CommonQuery
通用查询组件，快速构建查询表单

### Options
选项配置组件，统一管理表单字段配置

## 🛠️ 工具函数

- **上传工具** - `customUpload`, `registryUpload`, `getFileUrl`
- **权限工具** - `checkPermission`, `getHasPermission`, `useApiConfig`
- **配置工具** - `setupConfig`, `getConfig`, `getBaseURL`
- **数组工具** - `toArray`, `ArrayToObject`
- **对象工具** - `ObjectToArray`
- **表格工具** - `ellipsis`, `createActionColumnJsx`
- **路由工具** - `initRouteMeta`
- **弹窗工具** - `commonDialogMethod`, `initRules`

## 📖 文档

详细的组件文档和使用指南请查看：

- [快速开始](./docs/guide/quickstart.md)
- [组件文档](./docs/components/)
- [配置指南](./docs/guide/config.md)

或访问在线文档（如果已部署）。

## 🏗️ 开发

### 构建

```bash
npm run build
```

### 本地开发

```bash
# 启动文档开发服务器
npm run docs:dev

# 或使用 test-app 进行本地测试
cd test-app
npm install
npm run dev
```

### 项目结构

```
core/
├── src/              # 组件与工具源码
│   ├── form/         # 表单组件
│   ├── table/        # 表格组件
│   ├── dialog/       # 弹窗组件
│   ├── query/        # 查询组件
│   ├── options/      # 选项配置
│   └── utils/        # 工具函数
├── docs/             # VitePress 文档
├── examples/         # 示例代码
├── test-app/         # 测试应用
├── types/            # TypeScript 类型定义
└── dist/             # 构建输出
```

## 📝 License

UNLICENSED

## 🔗 相关链接

- [GitHub Repository](https://github.com/xmszm/core)
- [Naive UI](https://www.naiveui.com/)
- [Vue 3](https://vuejs.org/)

