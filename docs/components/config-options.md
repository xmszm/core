---
title: 配置项说明
---

本文档包含所有组件中使用的通用配置项说明。

## Options 配置字段

`Options` 配置字段用于 `DataForm`、`CommonQuery`、`Options` 等组件的表单项配置。

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| `key` | 是 | `string \| string[]` | 字段键名，支持数组键用于区间 |
| `label` | 否 | `string` | 显示文本 |
| `way` | 否 | `string` | 控件类型，默认 `'input'`。支持的枚举值见下方 [way 字段类型说明](#way-字段类型说明) |
| `options` | 否 | `Array` | 选择类数据，数组项默认使用 `name` 和 `id` 字段（可通过 `labelField`、`valueField` 配置） |
| `enum` | 否 | `Object` | 对象形式的枚举，会通过 `ObjectToArray` 转数组 |
| `props` | 否 | `Object \| Function` | 透传到具体控件（如 `NInput`、`NSelect`），支持函数，入参包含 `formRef`、`setValue` |
| `formItemProps` | 否 | `Object` | 透传到 `NFormItem`，可控制 label、样式、校验反馈等 |
| `required` | 否 | `boolean` | 是否必填，影响自动校验 |
| `rule` | 否 | `Function \| Array` | 自定义校验规则 |
| `message` | 否 | `string` | 校验失败时的提示信息 |
| `render` | 否 | `Function` | 完全自定义渲染，优先级最高 |
| `isRender` | 否 | `boolean \| Function` | 控制是否渲染该项 |
| `default` | 否 | `any \| Function` | 默认值，支持函数 |
| `prefix` | 否 | `Function \| Object` | 前缀内容，支持函数或对象 |
| `suffix` | 否 | `Function \| Object` | 后缀内容，支持函数或对象 |
| `labelSuffix` | 否 | `string \| Function` | label 后缀，支持图标或函数 |
| `labelSuffixProps` | 否 | `Object` | label 后缀的属性配置 |
| `noLabel` | 否 | `boolean` | 是否隐藏 label |
| `labelClass` | 否 | `string` | label 的 class |
| `permission` | 否 | `string` | 权限标识，用于权限指令控制显示 |

### way 字段类型说明

| 类型值 | 说明 | 对应组件 |
|--------|------|----------|
| `input` | 文本输入框 | `NInput` |
| `select` | 选择器 | `NSelect` |
| `date` | 日期选择器 | `NDatePicker` |
| `dateRange` | 日期范围选择器 | `NDatePicker` |
| `time` | 时间选择器 | `NTimePicker` |
| `radio` | 单选框 | `NRadioGroup` |
| `switch` | 开关 | `NSwitch` |
| `uploadFile` | 文件上传 | 自定义上传组件 |
| `image` | 图片上传 | 自定义图片组件 |
| `dataTable` | 表格选择 | `DataTable` |
| `button` | 按钮 | `NButton` |

## commonDialogMethod Mode 枚举

`commonDialogMethod` 的 `mode` 参数用于指定弹窗模式。

| 枚举值 | 说明 | 是否只读 |
|--------|------|----------|
| `none` | 无模式，不显示模式前缀 | 否 |
| `create` | 创建模式，标题前缀为"创建" | 否 |
| `add` | 添加模式，标题前缀为"添加"，默认值 | 否 |
| `edit` | 编辑模式，标题前缀为"编辑" | 否 |
| `view` | 查看模式，标题前缀为"查看"，自动设置为只读 | 是 |
| `export` | 导出模式，标题前缀为"导出" | 否 |
| `import` | 导入模式，标题前缀为"导入" | 否 |
| `delete` | 删除模式，标题前缀为"删除" | 否 |
| `copy` | 复制模式，标题前缀为"复制" | 否 |

> 注意：`view` 模式会自动设置 `read: true`，使表单变为只读状态。

## commonDialogMethod Action 配置

`commonDialogMethod` 的 `action` 参数用于自定义弹窗底部按钮。

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| `label` | 否 | `string` | 按钮文本 |
| `mode` | 否 | `string` | 按钮模式，`'cancel'` 表示取消按钮 |
| `valid` | 否 | `boolean` | 是否执行 DataForm 校验，默认 `false` |
| `loading` | 否 | `boolean` | 是否自动切换 loading 状态，默认 `false` |
| `onClick` | 否 | `Function` | 点击事件，入参 `{ model, cancel, validate, showLoading, hideLoading }` |
| `render` | 否 | `Function` | 自定义渲染函数，优先级高于 `label` |
| `props` | 否 | `Object` | 透传给 `NButton` 的属性 |
| `style` | 否 | `Object` | 按钮样式 |

## createActionColumnJsx 配置

`createActionColumnJsx` 用于生成表格操作列配置。

| 字段名 | 必填 | 类型 | 说明 |
|--------|------|------|------|
| `label` | 否 | `string` | 按钮文本 |
| `type` | 否 | `string` | 按钮类型，默认 `'primary'`。支持的枚举值见下方 [按钮类型枚举](#按钮类型枚举) |
| `mode` | 否 | `string` | 操作模式，`'pop'` 表示需要二次确认，其他值或不设置则直接执行 |
| `onClick` | 否 | `Function` | 点击事件，入参为当前行数据 `row` |
| `permission` | 否 | `string` | 权限标识，用于权限控制 |
| `render` | 否 | `Function` | 自定义渲染函数 |
| `props` | 否 | `Object` | 透传给按钮的属性 |

### 按钮类型枚举

| 类型值 | 说明 |
|--------|------|
| `default` | 默认按钮 |
| `primary` | 主要按钮（默认值） |
| `success` | 成功按钮 |
| `info` | 信息按钮 |
| `warning` | 警告按钮 |
| `error` | 错误按钮 |
| `tertiary` | 第三级按钮 |
| `quaternary` | 第四级按钮 |

## CommonQuery queryType 说明

`CommonQuery` 组件中，`options` 配置项的 `queryType` 字段用于指定查询参数的类型。

| queryType 值 | 说明 | 示例 |
|--------------|------|------|
| `likeQuery` | 模糊查询，值会放入 `query.likeQuery[key]` | `{ key: 'name', queryType: 'likeQuery' }` |
| 不设置或空字符串 | 直接放入 `query[key]` | `{ key: 'status' }` |

## 相关链接

- [DataForm 组件](/components/dataform)
- [Options 组件](/components/options)
- [CommonQuery 组件](/components/query)
- [commonDialogMethod](/components/dialog)

