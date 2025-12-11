# 本地开发配置

## npm/pnpm link 时的路径解析问题

当使用 `npm link` 或 `pnpm link` 进行本地开发时，Vite 可能无法正确解析链接包的路径。这是因为：

1. **符号链接解析问题**：npm/pnpm link 创建的是符号链接，Vite 的模块解析在处理符号链接时可能失败
2. **package.json exports**：链接包的 `exports` 字段路径解析可能不生效
3. **CSS 文件路径**：样式文件的路径解析尤其容易出问题

## 最小化配置方案

在测试项目的 `vite.config.js` 中添加以下配置即可：

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
      // 解决 npm/pnpm link 时的路径解析问题
      '@xmszm/core': path.resolve(__dirname, '..'), // 指向库项目根目录
      '@xmszm/core/dist/style.css': path.resolve(__dirname, '../dist/style.css'),
    },
  },
  server: {
    port: 3000,
    open: true
  }
})
```

## 为什么需要这个配置？

### 问题 1: 模块无法解析

**错误信息**：
```
Failed to resolve import "@xmszm/core" from "src/App.vue"
```

**原因**：
- npm/pnpm link 创建的符号链接路径可能无法被 Vite 正确识别
- 链接路径如 `link:C:/Users/admin/AppData/Local/pnpm/global/5/node_modules/@xmszm/core` 可能解析失败

**解决方案**：
```javascript
'@xmszm/core': path.resolve(__dirname, '..')
```
直接指向源项目根目录，绕过符号链接解析问题。

### 问题 2: 样式文件无法解析

**错误信息**：
```
Failed to resolve import "@xmszm/core/dist/style.css"
```

**原因**：
- CSS 文件的路径解析在链接包中更容易失败
- `exports` 字段对 CSS 文件的处理可能不一致

**解决方案**：
```javascript
'@xmszm/core/dist/style.css': path.resolve(__dirname, '../dist/style.css')
```
直接指向源项目的样式文件。

## 生产环境使用

在生产环境中（通过 npm 安装），**不需要**这些配置，因为：

1. 正常安装的包路径解析没有问题
2. `package.json` 的 `exports` 字段会正确工作
3. Vite 可以正确解析 `node_modules` 中的包

## 完整示例

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 仅在使用 npm/pnpm link 时需要
      '@xmszm/core': path.resolve(__dirname, '..'),
      '@xmszm/core/dist/style.css': path.resolve(__dirname, '../dist/style.css'),
    },
  },
})
```

## 注意事项

1. **仅本地开发需要**：这个配置只在本地开发（使用 link）时需要
2. **相对路径**：`path.resolve(__dirname, '..')` 假设测试项目在库项目的 `test-app` 目录下
3. **路径调整**：如果目录结构不同，需要相应调整路径

