---
title: commonDialogMethod
---

将表单、弹窗与动作按钮整合的快捷方法，底层使用 `$dialog` 与 `DataForm`。

## 基础用法（用函数包裹触发）
`commonDialogMethod` 调用即会创建并打开弹窗，推荐用一个函数包裹，在需要时再触发：
```js
import { commonDialogMethod } from 'core'

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

## 参数（主要）
- `title / noTitle / titleFull`：标题配置。
- `options: Array` 表单项，直接传给 `DataForm`。
- `mode` 与 `modeEnum`：内置 `create/add/edit/view/import/export/delete/copy/none`，`view` 会自动只读。
- `labelField`：默认 `label`。
- `isNo`：内容最小高度控制。
- `formProps`、`contentStyle`：透传 `DataForm`。
- `action`：自定义底部按钮数组或函数；不传则使用默认“取消 / 确定”。
- `actionProps`：NSpace/按钮样式补充。
- `interfaceFn`：点击默认“确定”时执行，入参 `(model, { close, hideLoading })`。
- `interfaceFnCancel`：点击默认“取消”时执行。
- `read / isRead`：只读模式。

## 返回值
- `cancel()` 关闭弹窗。
- `setValue(v, key?)` 设置表单数据。
- `model` 响应式数据快照。
- `modeEnum` 默认模式枚举。

## 自定义动作
```js
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

## 小贴士
- 表单校验委托给 `DataForm`，`valid: true` 时自动调用 `formRef.valid()`。
- 只读场景可用 `mode: 'view'`，或直接传 `read: true`。
- 若需要自定义 header，可传 `titleFull` 为渲染函数。

