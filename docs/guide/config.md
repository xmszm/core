# 配置指南

## 统一配置系统

`@xmszm/core` 提供了统一的配置系统，用于管理外部依赖和业务配置。

## 初始化配置

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

## 注意事项

1. **配置时机**：建议在应用启动时（如 `main.js`）进行配置
2. **权限检查**：如果未配置 `hasPermission`，默认返回 `true`（会显示警告）
3. **BASE_URL**：如果未配置 `baseURL`，`getFileUrl` 会返回原始 URL（会显示警告）
4. **上传方法**：如果未配置 `uploadMethod`，调用 `customUpload` 会抛出错误

