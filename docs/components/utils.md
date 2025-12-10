---
title: 工具与常量
---

## 操作列 / 排序 / 省略

### createActionColumnJsx
快速生成表格操作列。

```js
import { createActionColumnJsx } from 'core'

const oprColumn = createActionColumnJsx(
  [
    { label: '查看', onClick: (row) => view(row) },
    { label: '删除', mode: 'pop', onClick: (row) => remove(row) },
  ],
  { fixed: 'right' },
  { max: 3 }, // collectParams：超过数量折叠
)
```

### orderEnum（表格内部用）
- 来源：`src/enum/sort.jsx`，通过 `DataTable` 列的 `sorter` 使用。
- 功能：提供升序/降序/默认三态的图标与处理函数，修改 `listQuery` 的排序字段并配合重新拉取数据。
- 注意：离开 `DataTable` 排序场景单独调用无意义；详细示例见 `DataTable` 文档中的排序段落。

### ellipsis
表格省略 tooltip 配置：
```js
import { ellipsis } from 'core/table/utils/ellipsis'
```

## 上传工具
```js
import { registryUpload, customUpload, getFileUrl } from 'core'

registryUpload((config) => axios.request(config)) // 注册实际上传实现
await customUpload({ url: '/upload', data: file })
const url = getFileUrl('/path/to/file', 200) // 拼接 OSS 样式
```

## 权限与路由
- `useAuthPermission(...routeNames)` / `useApiConfig(...routeNames)`：读取路由 meta 中的 `auth` / `api`。
- `cellectChildenPermission(route)`：合并子路由权限到父节点。
- `initRouteMeta(routes, base?)`：补全 `meta.title`、`meta.permission`、`sourceFullPath` 等。
- `handleParams(str, map)`：替换路径参数。

## 数据工具
- `toArray(value)`：非数组包装成数组。
- `ArrayToObject(arr, { labelField, valueField })`：数组转对象映射。
- `ObjectToArray(obj, { labelField, valueField })`：对象转数组。

## 类型
库内提供 `types/index.d.ts`，涵盖组件、方法与工具的基础类型，可在 TS 项目中直接获得提示。

