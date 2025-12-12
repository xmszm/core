---
title: commonDialogMethod
---

将表单、弹窗与动作按钮整合的快捷方法，底层使用 `$dialog` 与 `DataForm`。

## 基础用法（用函数包裹触发）
`commonDialogMethod` 调用即会创建并打开弹窗，推荐用一个函数包裹，在需要时再触发：
```javascript
import { commonDialogMethod } from '@xmszm/core'

function openEditDialog(row) {
  const { cancel, model } = commonDialogMethod(
    {
      title: '编辑',
      options: [
        { key: 'name', label: '名称', way: 'input', required: true },
        { key: 'type', label: '类型', way: 'select', options: [{ label: 'A', value: 'a' }] },
      ],
      valueData: row,
      interfaceFn: async (data, { close }) => {
        await save(data)
        close()
      },
    },
    {
      style: { width: '520px' },
    },
  )
  return { cancel, model }
}

// 需要时再调用
openEditDialog(currentRow)
```

## 参数

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| `title` | 否 | `string` | 弹窗标题，默认 `''` |
| `noTitle` | 否 | `boolean` | 是否隐藏标题，默认 `false` |
| `titleFull` | 否 | `Function \| string` | 自定义标题渲染函数或完整标题 |
| `options` | 否 | `Array` | 表单项配置，直接传给 `DataForm`，默认 `[]` |
| `mode` | 否 | `string` | 模式，默认 `'add'`。支持的枚举值见 [commonDialogMethod Mode 枚举](/components/config-options#commondialogmethod-mode-枚举) |
| `modeEnum` | 否 | `Object` | 自定义模式枚举，会与默认模式合并 |
| `labelField` | 否 | `string` | label 字段名，默认 `'label'` |
| `isNo` | 否 | `boolean` | 内容最小高度控制，默认 `true` |
| `formProps` | 否 | `Object` | 透传给 `DataForm` 的 `formProps`，默认 `{}` |
| `contentStyle` | 否 | `Object` | 透传给 `DataForm` 的 `contentStyle`，默认 `{}` |
| `action` | 否 | `Array \| Function` | 自定义底部按钮数组或函数；不传则使用默认“取消 / 确定” |
| `actionProps` | 否 | `Object` | NSpace/按钮样式补充，默认 `{}` |
| `interfaceFn` | 否 | `Function` | 点击默认“确定”时执行，入参 `(model, { close, hideLoading })` |
| `interfaceFnCancel` | 否 | `Function` | 点击默认“取消”时执行，入参 `(model, { close })` |
| `read` | 否 | `boolean` | 只读模式，默认 `false` |
| `isRead` | 否 | `boolean` | 只读模式（与 `read` 同义），默认 `false` |
| `valueData` | 否 | `Object` | 表单初始数据，默认 `{}` |
| `dialogProps` | 否 | `Object` | 透传给 `n-dialog` 的属性（第二个参数） |

## 返回值

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `cancel` | `() => void` | 关闭弹窗的方法 |
| `setValue` | `(v: any, key?: string) => void` | 设置表单数据，`key` 为空时更新整个表单对象 |
| `model` | `Ref<Object>` | 响应式表单数据快照 |
| `modeEnum` | `Object` | 默认模式枚举对象 |

## 自定义动作

`action` 参数支持数组或函数，数组项配置详见 [commonDialogMethod Action 配置](/components/config-options#commondialogmethod-action-配置)。

```javascript
commonDialogMethod({
  action: [
    { label: '关闭', mode: 'cancel' },
    {
      label: '提交',
      valid: true,   // 会执行 DataForm 校验
      loading: true, // 自动切换 loading
      async onClick({ model, cancel }) {
        await save(model)
        cancel()
      },
    },
  ],
})
```

## useCommonDialog Hook

在组件中使用 `commonDialogMethod` 的便捷方式，自动注册 Dialog 实例。

### 基础用法

```javascript
import { useCommonDialog } from '@xmszm/core'

export default {
  setup() {
    const openDialog = useCommonDialog()
    
    const handleEdit = (row) => {
      openDialog({
        title: '编辑',
        options: [
          { key: 'name', label: '名称', way: 'input', required: true },
        ],
        valueData: row,
        interfaceFn: async (data, { close }) => {
          await save(data)
          close()
        },
      })
    }
    
    return { handleEdit }
  },
}
```

### 在 Composition API 中使用

```javascript
import { useCommonDialog } from '@xmszm/core'

const openDialog = useCommonDialog()

function handleAdd() {
  openDialog({
    title: '新增',
    options: formOptions,
    interfaceFn: async (data, { close }) => {
      await create(data)
      close()
    },
  })
}
```

## Dialog 工具函数

### createDialog

使用 dialog 的工具函数，需要手动传入 dialog 实例。

```javascript
import { useDialog } from 'naive-ui'
import { createDialog } from '@xmszm/core'

const dialog = useDialog()

// 创建自定义弹窗
const { destroy } = createDialog(dialog, {
  title: '提示',
  content: '这是一个自定义弹窗',
})
```

### createDialogMethods

创建 Dialog 快捷方法（info、success、warning、error、create）。

```javascript
import { useDialog } from 'naive-ui'
import { createDialogMethods } from '@xmszm/core'

const dialog = useDialog()
const dialogMethods = createDialogMethods(dialog)

// 使用快捷方法
dialogMethods.info({
  title: '信息',
  content: '这是一条信息',
})

dialogMethods.success({
  title: '成功',
  content: '操作成功',
})

dialogMethods.warning({
  title: '警告',
  content: '请注意',
})

dialogMethods.error({
  title: '错误',
  content: '操作失败',
})
```

### createDialogOptions

创建 dialog 配置，应用主题色继承设置。通常用于自定义 Dialog 主题。

```javascript
import { useDialog } from 'naive-ui'
import { createDialogOptions } from '@xmszm/core'

const dialog = useDialog()

const options = createDialogOptions({
  title: '自定义主题',
  content: '内容',
})

dialog.create(options)
```

## 小贴士
- 表单校验委托给 `DataForm`，`valid: true` 时自动调用 `formRef.valid()`。
- 只读场景可用 `mode: 'view'`，或直接传 `read: true`。
- 若需要自定义 header，可传 `titleFull` 为渲染函数。
- 在组件中推荐使用 `useCommonDialog` Hook，它会自动处理 Dialog 实例注册。
- `createDialog`、`createDialogMethods`、`createDialogOptions` 适用于需要更细粒度控制的场景。

