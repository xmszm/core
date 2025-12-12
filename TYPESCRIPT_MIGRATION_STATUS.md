# TypeScript 改造进度

## ✅ 已改造的文件（27个）

### 工具函数（utils）
- ✅ `src/utils/array.js` → `array.ts`
- ✅ `src/utils/object.js` → `object.ts`
- ✅ `src/utils/config.js` → `config.ts`
- ✅ `src/utils/time.js` → `time.ts`
- ✅ `src/utils/upload.js` → `upload.ts`
- ✅ `src/utils/dialog.js` → `dialog.ts`
- ✅ `src/utils/auth.js` → `auth.ts`

### 枚举文件（enum）
- ✅ `src/enum/options.js` → `options.ts`
- ✅ `src/enum/sort.jsx` → `sort.tsx`

### Dialog 相关
- ✅ `src/dialog/utils/dialog.js` → `dialog.ts`
- ✅ `src/dialog/commonDialog.jsx` → `commonDialog.tsx`
- ✅ `src/dialog/useCommonDialog.js` → `useCommonDialog.ts`

### 表格组件
- ✅ `src/table/utils/ellipsis.js` → `ellipsis.ts`
- ✅ `src/table/opr/useDataColumn.jsx` → `useDataColumn.tsx`
- ✅ `src/table/opr/useDataColumnButton.jsx` → `useDataColumnButton.tsx`
- ✅ `src/table/opr/useDataColumnPop.jsx` → `useDataColumnPop.tsx`
- ✅ `src/table/opr/DataColumnCollet.jsx` → `DataColumnCollet.tsx`
- ✅ `src/table/opr/useQRCode.js` → `useQRCode.ts`

### 表单选项组件
- ✅ `src/options/Options.jsx` → `Options.tsx`
- ✅ `src/options/defaultOptions.jsx` → `defaultOptions.tsx`

### 指令相关
- ✅ `src/directives/auto-register.js` → `auto-register.ts`
- ✅ `src/directives/permission.js` → `permission.ts`

### 插件相关
- ✅ `src/plugin/index.js` → `plugin/index.ts`
- ✅ `src/plugin/vite/initRouteMeta.js` → `initRouteMeta.ts`

### 其他
- ✅ `src/list/useList.jsx` → `useList.tsx`
- ✅ `src/store/utils/index.js` → `store/utils/index.ts`
- ✅ `src/index.js` → `index.ts`

### Vue 组件（添加 TypeScript 支持）
- ✅ `src/form/DataForm.vue` - 添加 `lang="ts"`
- ✅ `src/query/CommonQuery.vue` - 添加 `lang="ts"`
- ✅ `src/table/DataTable.vue` - 添加 `lang="ts"`

---

## ❌ 未改造的文件（0个）

所有文件已完成 TypeScript 改造！

---

## 📊 统计

- **已改造**: 27 个文件
- **未改造**: 0 个文件
- **总进度**: 100% (27/27) ✅

---

## 🎯 建议改造优先级

### 高优先级（核心功能）
1. `src/index.js` - 入口文件，影响所有导出
2. `src/dialog/commonDialog.jsx` - 核心弹窗功能
3. `src/options/Options.jsx` - 核心表单组件
4. `src/table/opr/useDataColumn.jsx` - 核心表格操作

### 中优先级（工具类）
5. `src/table/utils/ellipsis.js` - 简单对象，容易改造
6. `src/directives/auto-register.js` - 指令注册工具
7. `src/directives/permission.js` - 权限指令
8. `src/dialog/useCommonDialog.js` - Dialog Hook

### 低优先级（辅助功能）
9. 其他 JSX 组件文件
10. 插件相关文件

---

## 📝 注意事项

1. **JSX 文件**：需要改为 `.tsx` 扩展名
2. **Vue 组件**：需要在 `<script setup>` 中添加 `lang="ts"`
3. **导入路径**：改造后需要更新 `src/index.js` 中的导入路径
4. **类型引用**：可以使用已定义的 `types/components.d.ts` 中的类型
