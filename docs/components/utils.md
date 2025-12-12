---
title: 工具与常量
---

## 操作列 / 省略

### createActionColumnJsx
快速生成表格操作列。

配置项说明详见 [createActionColumnJsx 配置](/components/config-options#createactioncolumnjsx-配置)。

```javascript
import { createActionColumnJsx } from '@xmszm/core'

const oprColumn = createActionColumnJsx(
  [
    { label: '查看', onClick: (row) => view(row) },
    { label: '删除', mode: 'pop', onClick: (row) => remove(row) },
  ],
  { fixed: 'right' },
  { max: 3 }, // collectParams：超过数量折叠
)
```

### ellipsis
表格省略 tooltip 配置：
```javascript
import { ellipsis } from '@xmszm/core/table/utils/ellipsis'
```

## 上传工具
```javascript
import { registryUpload, customUpload, getFileUrl } from '@xmszm/core'

registryUpload((config) => axios.request(config)) // 注册实际上传实现
await customUpload({ url: '/upload', data: file })
const url = getFileUrl('/path/to/file', 200) // 拼接 OSS 样式
```

## 二维码工具

### useQRCode

在组件中使用二维码弹窗的便捷 Hook。

```javascript
import { useQRCode } from '@xmszm/core'

const showQRCode = useQRCode()

function handleShowQR(row) {
  showQRCode(row, async () => {
    // 返回二维码图片 URL
    return await getQRCodeImage(row.id)
  })
}
```

### createQRCode

创建二维码弹窗的函数，需要手动传入 Dialog 实例。

```javascript
import { useDialog } from 'naive-ui'
import { createQRCode, registerDialogInstance } from '@xmszm/core'

const dialog = useDialog()
registerDialogInstance(dialog)

// 显示二维码
await createQRCode(row, async () => {
  return await getQRCodeImage(row.id)
})
```

## 权限与路由

### useAuthPermission / useApiConfig

读取路由 meta 中的 `auth` / `api` 配置。

```javascript
import { useAuthPermission, useApiConfig } from '@xmszm/core'

// 读取当前路由的 auth 配置
const auth = useAuthPermission()

// 读取指定路由的 auth 配置
const auth = useAuthPermission('userList', 'userDetail')

// 读取当前路由的 api 配置
const api = useApiConfig()
```

### cellectChildenPermission

合并子路由权限到父节点。

```javascript
import { cellectChildenPermission } from '@xmszm/core'

const route = cellectChildenPermission(routeConfig)
```

### initRouteMeta

补全路由 `meta.title`、`meta.permission`、`sourceFullPath` 等。

```javascript
import { initRouteMeta } from '@xmszm/core'

const routes = initRouteMeta(routes, '/base')
```

### handleParams

替换路径参数。

```javascript
import { handleParams } from '@xmszm/core'

const url = handleParams('/api/user/{id}', {
  '{id}': userId,
})
// => '/api/user/123'
```

## 权限指令

### permissionDirective (v-corePermission)

权限指令，根据权限标识控制元素的显示/隐藏。

```javascript
import { permissionDirective } from '@xmszm/core'

// 在 main.js 中注册
app.directive('corePermission', permissionDirective)
```

### 使用示例

```vue
<template>
  <!-- 单个权限 -->
  <div v-corePermission="'user:edit'">编辑按钮</div>
  
  <!-- 多个权限（任一满足即可） -->
  <div v-corePermission="['user:edit', 'user:view']">需要编辑或查看权限</div>
</template>
```

::: tip
指令会自动调用 `setupConfig` 中配置的 `hasPermission` 函数进行权限检查。如果未配置，默认返回 `true`（会显示警告）。
:::

## 数据工具
- `toArray(value)`：非数组包装成数组。
- `ArrayToObject(arr, { labelField, valueField })`：数组转对象映射。
- `ObjectToArray(obj, { labelField, valueField })`：对象转数组。

## 类型
库内提供 `types/index.d.ts`，涵盖组件、方法与工具的基础类型，可在 TS 项目中直接获得提示。

