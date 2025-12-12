---
title: 版本历史
---

# 版本历史

本文档记录了 `@xmszm/core` 的所有发布版本及其更新内容。

## 0.0.2

**发布日期**: 2025-12-12

### 新增
- 完善文档系统，使用 VitePress 构建
- 添加初始化配置文档，支持 `setupConfig` 和 `setupOptions`
- 统一配置项说明文档

### 改进
- 优化文档结构，统一使用表格展示组件 API
- 提取公共配置项到独立文档
- 改进代码示例和说明

### 修复
- 修复文档中的代码高亮问题
- 修复 GitHub Pages 部署路径问题

---

## 0.0.1

**发布日期**: 2025-12-11

### 新增
- 初始版本发布
- 核心组件：`DataForm`、`DataTable`、`CommonQuery`、`Options`
- 弹窗方法：`commonDialogMethod`
- 工具函数：上传、权限、路由等
- 基础样式和类型定义

---

## 如何查看最新版本

你可以通过以下方式查看最新的发布版本：

### npm

```bash
npm view @xmszm/core version
```

### 查看所有版本

```bash
npm view @xmszm/core versions
```

### 在 package.json 中查看

```json
{
  "dependencies": {
    "@xmszm/core": "^0.0.2"
  }
}
```

---

## 版本说明

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订版本号**：向下兼容的问题修正

建议使用 `^` 前缀来安装，以自动获取兼容的更新：

```bash
npm install @xmszm/core@^0.0.2
```

