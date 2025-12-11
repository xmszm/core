# Core 组件库测试应用

这是一个用于本地测试 `@xmszm/core` 组件库的测试应用。

## 使用 npm link 进行本地测试

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

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

## 注意事项

- 修改库代码后，需要重新构建：在 core 目录执行 `npm run build`
- 测试应用会自动使用最新的构建结果
- 如果遇到问题，可以尝试重新 link：
  ```bash
  # 取消 link
  npm unlink @xmszm/core
  # 重新 link
  npm link @xmszm/core
  ```

