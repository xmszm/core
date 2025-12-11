# 使用指南（核心要点）

## 安装
```bash
npm install @xmszm/core
# 或
pnpm add @xmszm/core
# 或
yarn add @xmszm/core
```

需要同时安装的 peer 依赖（版本可按项目统一）：
- `vue` >= 3.3.0
- `naive-ui` >= 2.38.0
- `vue-router` >= 4.2.0
- `dayjs` >= 1.11.0
- `lodash-es` >= 4.17.21
- `@vicons/ionicons5` >= 0.13.0

如项目使用 `@` 别名，请确保存在对应的打包/运行时配置。

## 快速开始
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
      // 在此提交数据
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

## 主要导出清单
- 组件：`DataForm`、`Options`、`CommonQuery`、`DataTable`、`OprButton`、`Pop`
- 方法：`commonDialogMethod`、`createActionColumnJsx`、`initRules`
- 工具：`toArray`、`ArrayToObject`、`ObjectToArray`、`customUpload`、`registryUpload`、`getFileUrl`
- 常量：`orderEnum`、`globalLabelField`、`globalValueField`
- 路由辅助：`initRouteMeta`、`useApiConfig`、`useAuthPermission`、`cellectChildenPermission`

## 常见提示
- 若打包时报 `@/utils/...` 未找到，请在宿主项目配置 `@` 路径或提供对应实现。
- Vue TS 项目可直接使用内置 `types/index.d.ts` 获取基础类型提示。

