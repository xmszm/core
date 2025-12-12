---
title: 初始化配置
---

# 初始化配置

`@xmszm/core` 提供了统一的初始化配置系统，用于管理外部依赖、业务配置和自定义选项注册。

## 配置概览

| 配置项 | 说明 | 相关文档 |
|--------|------|----------|
| `setupConfig` | 全局配置（baseURL、权限、上传等） | 见下方说明 |
| `setupOptions` | 注册自定义 Options 控件类型 | 见 [Options 注册](#options-注册) |
| `registerDialogInstance` | 注册 Dialog 实例（可选） | 见 [Dialog 配置](#dialog-配置) |

## setupConfig - 全局配置

`setupConfig` 用于配置全局设置，包括 API 地址、权限检查、上传方法等。

在应用启动时，使用 `setupConfig` 进行统一配置：

```javascript
import { setupConfig } from '@xmszm/core'
import axios from 'axios'

// 初始化配置
setupConfig({
  // API 基础地址（用于文件 URL 拼接）
  baseURL: 'https://api.example.com',
  
  // 权限检查函数
  hasPermission: (permission) => {
    // 你的权限检查逻辑
    const permissions = getPermissions() // 从 store、context 等获取权限列表
    return permissions.includes(permission)
  },
  
  // 上传方法
  uploadMethod: (config) => {
    // 你的上传实现
    return axios.request(config)
  }
})
```

## 配置项说明

### baseURL

API 基础地址，用于 `getFileUrl` 函数拼接文件 URL。

```javascript
import { setupConfig, getFileUrl } from '@xmszm/core'

setupConfig({
  baseURL: 'https://api.example.com'
})

// 使用
const url = getFileUrl('/images/avatar.jpg')
// => 'https://api.example.com/images/avatar.jpg'
```

### hasPermission

权限检查函数，用于表格操作列的权限过滤。

```javascript
import { setupConfig } from '@xmszm/core'

setupConfig({
  hasPermission: (permission) => {
    // 从 Vuex/Pinia store 获取权限
    const store = useStore()
    return store.state.permissions.includes(permission)
    
    // 或从 localStorage 获取
    // const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
    // return permissions.includes(permission)
  }
})

// 在 createActionColumnJsx 中使用
const opr = createActionColumnJsx([
  {
    label: '编辑',
    permission: 'user:edit', // 会调用 hasPermission('user:edit')
    onClick: (row) => edit(row)
  }
])
```

### uploadMethod

上传方法实现，用于 `customUpload` 函数。

```javascript
import { setupConfig, customUpload } from '@xmszm/core'
import axios from 'axios'

setupConfig({
  uploadMethod: (config) => {
    return axios.request({
      ...config,
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        ...config.headers
      }
    })
  }
})

// 使用
await customUpload({
  url: '/upload',
  method: 'POST',
  data: formData
})
```

## 兼容旧版 API

为了向后兼容，仍然支持旧的 API：

```javascript
import { registryUpload } from '@xmszm/core'

// 旧版方式（仍然可用，但不推荐）
registryUpload((config) => axios.request(config))
```

## 获取配置

如果需要获取当前配置：

```javascript
import { getConfig, getBaseURL, getHasPermission, getUploadMethod } from '@xmszm/core'

// 获取所有配置
const config = getConfig()

// 获取单个配置
const baseURL = getBaseURL()
const hasPermission = getHasPermission()
const uploadMethod = getUploadMethod()
```

## 完整示例

```javascript
// main.js
import { createApp } from 'vue'
import { setupConfig } from '@xmszm/core'
import App from './App.vue'
import axios from 'axios'
import { useStore } from './store'

const app = createApp(App)

// 配置库
setupConfig({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  hasPermission: (permission) => {
    const store = useStore()
    return store.state.user.permissions?.includes(permission) ?? false
  },
  
  uploadMethod: (config) => {
    return axios.request({
      ...config,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...config.headers
      }
    })
  }
})

app.mount('#app')
```

## Options 注册（setupOptions） {#options-注册}

`setupOptions` 允许你注册自定义的控件类型，扩展 `Options` 组件的功能。

### 基础用法

```javascript
import { setupOptions } from '@xmszm/core'
import { NCascader } from 'naive-ui'

// 注册一个级联选择器控件
setupOptions('cascader', (item, { _value, _isRead, labelField, valueField }) => {
  const { key, label, props, options = [] } = item
  
  return _isRead ? (
    <div>{_value[key]}</div>
  ) : (
    <NCascader
      v-model:value={_value[key]}
      options={options}
      placeholder={`请选择${label}`}
      {...props}
    />
  )
})
```

### 注册参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | `string` | 控件类型标识，如 `'cascader'`、`'customInput'` 等。注意：不能与内置类型重复（如 `input`、`select` 等） |
| `fn` | `Function` | 渲染函数，接收两个参数：<br/>1. `item`: 配置项对象（包含 `key`、`label`、`props`、`options` 等）<br/>2. `context`: 上下文对象 `{ _value, _isRead, labelField, valueField, _formRef }`<br/><br/>函数应返回一个 VNode 或 JSX 元素 |

### 使用自定义控件

注册后，在 `options` 配置中使用 `way` 字段指定你注册的类型：

```javascript
const options = [
  { key: 'region', label: '地区', way: 'cascader', options: regionOptions },
  { key: 'custom', label: '自定义', way: 'customInput' },
]
```

### 完整示例

```javascript
// main.js
import { createApp } from 'vue'
import { setupOptions, setupConfig } from '@xmszm/core'
import { NCascader, NColorPicker } from 'naive-ui'
import App from './App.vue'

// 注册级联选择器控件
setupOptions('cascader', (item, { _value, _isRead }) => {
  const { key, label, props, options = [] } = item
  return _isRead ? (
    <div>{_value[key]}</div>
  ) : (
    <NCascader
      v-model:value={_value[key]}
      options={options}
      placeholder={`请选择${label}`}
      {...props}
    />
  )
})

// 注册颜色选择器控件
setupOptions('colorPicker', (item, { _value, _isRead }) => {
  const { key, props } = item
  return _isRead ? (
    <div style={{ 
      width: '20px', 
      height: '20px', 
      backgroundColor: _value[key],
      border: '1px solid #ccc'
    }} />
  ) : (
    <NColorPicker
      v-model:value={_value[key]}
      {...props}
    />
  )
})

// 其他全局配置
setupConfig({
  baseURL: 'https://api.example.com',
  // ... 其他配置
})

const app = createApp(App)
app.mount('#app')
```

### 使用自定义控件

注册后，在 `DataForm`、`CommonQuery`、`Options` 等组件的 `options` 配置中使用：

```javascript
const formOptions = [
  { key: 'region', label: '地区', way: 'cascader', options: regionData },
  { key: 'theme', label: '主题色', way: 'colorPicker' },
]
```

### getAllOptions / getOptions

获取已注册的 Options 控件。

```javascript
import { getAllOptions, getOptions } from '@xmszm/core'

// 获取所有已注册的 Options
const allOptions = getAllOptions()
// => { input: fn, select: fn, cascader: fn, ... }

// 获取指定的 Options
const specificOptions = getOptions(['input', 'select'])
// => { input: fn, select: fn }
```

::: tip
这些方法主要用于调试或高级用法，一般不需要直接调用。
:::

## Dialog 配置 {#dialog-配置}

### registerDialogInstance

可选配置，用于注册外部 Dialog 实例。如果不注册，库会自动尝试获取。

```javascript
import { registerDialogInstance, useDialog } from '@xmszm/core'
import { useDialog as useNaiveDialog } from 'naive-ui'

// 在组件中注册
const dialog = useNaiveDialog()
registerDialogInstance(dialog)
```

### Dialog 主题配置

```javascript
import { setupConfig } from '@xmszm/core'

setupConfig({
  dialog: {
    // 是否继承外部定义的主题色（默认 true）
    inheritTheme: true,
    // 主题色覆盖（当 inheritTheme 为 false 时使用）
    themeOverrides: {
      // 自定义主题色配置
    }
  }
})
```

## 插件和指令

### CorePlugin / install

库插件，用于注册指令等全局功能。

```javascript
import { createApp } from 'vue'
import { CorePlugin } from '@xmszm/core'
import App from './App.vue'

const app = createApp(App)

// 使用插件（会自动注册所有指令）
app.use(CorePlugin)

app.mount('#app')
```

或者使用 `install` 函数：

```javascript
import { install } from '@xmszm/core'

app.use({ install })
```

### registerDirectives

手动注册所有指令到应用实例。

```javascript
import { registerDirectives } from '@xmszm/core'

registerDirectives(app)
```

### autoRegisterDirectives

尝试自动注册指令（通过 `getCurrentInstance` 获取应用实例）。

```javascript
import { autoRegisterDirectives } from '@xmszm/core'

// 在组件中调用
autoRegisterDirectives()
```

### getGlobalApp

获取全局应用实例（如果已通过 `registerDirectives` 注册）。

```javascript
import { getGlobalApp } from '@xmszm/core'

const app = getGlobalApp()
```

::: tip
通常不需要手动调用这些函数，使用 `CorePlugin` 或 `install` 即可自动注册所有指令。
:::

## 注意事项

1. **配置时机**：建议在应用启动时（如 `main.js`）进行配置
2. **权限检查**：如果未配置 `hasPermission`，默认返回 `true`（会显示警告）
3. **BASE_URL**：如果未配置 `baseURL`，`getFileUrl` 会返回原始 URL（会显示警告）
4. **上传方法**：如果未配置 `uploadMethod`，调用 `customUpload` 会抛出错误
5. **Options 注册**：`setupOptions` 应在使用相关组件之前注册，建议在 `main.js` 中统一注册
6. **Dialog 实例**：`registerDialogInstance` 是可选的，库会自动尝试获取，仅在特殊场景下需要手动注册
7. **插件使用**：推荐使用 `CorePlugin` 或 `install` 自动注册指令，无需手动调用 `registerDirectives`

