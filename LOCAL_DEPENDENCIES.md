# 外部依赖说明

## 需要由使用方提供的文件

本库依赖以下两个外部文件，需要在使用方项目中提供：

### 1. `@/utils/permission`
**位置**：使用方项目的 `src/utils/permission.js`（或对应路径）

**用途**：权限检查函数
- 在 `src/table/opr/useDataColumn.jsx` 中使用
- 需要导出 `hasPermission` 函数

**示例实现**：
```javascript
// 使用方项目 src/utils/permission.js
export function hasPermission(permission) {
  // 你的权限检查逻辑
  // 例如：从 store 或 context 中获取权限列表
  const permissions = getPermissions() // 你的获取权限方法
  return permissions.includes(permission)
}
```

### 2. `@/utils/request`
**位置**：使用方项目的 `src/utils/request.js`（或对应路径）

**用途**：请求配置，提供 BASE_URL
- 在 `src/utils/upload.js` 中使用
- 需要导出 `BASE_URL` 常量

**示例实现**：
```javascript
// 使用方项目 src/utils/request.js
export const BASE_URL = 'https://api.example.com'
// 或者
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
```

## 使用方项目配置

### 方式一：在 vite.config.js 中配置路径别名

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

### 方式二：在 tsconfig.json 中配置（TypeScript 项目）

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 本地连接测试

### 1. 在库项目根目录创建 link

```bash
# 在 core 项目根目录执行
cd E:\HundredsCompany\template\core
npm link
```

### 2. 在测试项目中链接库

```bash
# 在 test-app 目录执行
cd test-app
npm link @xmszm/core
```

### 3. 在测试项目中创建缺失的文件

在 `test-app/src/utils/` 目录下创建：

**permission.js**:
```javascript
export function hasPermission(permission) {
  // 测试用简单实现
  console.log('检查权限:', permission)
  return true // 或你的权限检查逻辑
}
```

**request.js**:
```javascript
export const BASE_URL = 'http://localhost:3000' // 或你的 API 地址
```

### 4. 配置测试项目的路径别名

在 `test-app/vite.config.js` 中添加：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true
  }
})
```

### 5. 安装依赖并启动

```bash
cd test-app
npm install
npm run dev
```

## 文件位置总结

```
core/                                    # 库项目
├── src/
│   ├── table/opr/useDataColumn.jsx     # 使用 @/utils/permission
│   └── utils/upload.js                  # 使用 @/utils/request
└── ...

使用方项目/                              # 使用库的项目
├── src/
│   └── utils/
│       ├── permission.js               # 需要提供：hasPermission 函数
│       └── request.js                  # 需要提供：BASE_URL 常量
└── vite.config.js                      # 需要配置 @ 别名指向 src
```

