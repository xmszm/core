# 文档审计报告

## 缺失的文档（代码中存在但文档中缺失）

### 组件
1. **OprButton** (`src/table/opr/useDataColumnButton.jsx`)
   - 导出位置：`src/index.js`
   - 状态：仅在 `usage.md` 中提及，无详细文档
   - 建议：创建独立文档或在 `utils.md` 中补充

2. **Pop** (`src/table/opr/useDataColumnPop.jsx`)
   - 导出位置：`src/index.js`
   - 状态：仅在 `usage.md` 中提及，无详细文档
   - 建议：创建独立文档或在 `utils.md` 中补充

### Hooks/方法
3. **useCommonDialog** (`src/dialog/useCommonDialog.js`) ✅
   - 导出位置：`src/index.js`
   - 状态：已在 `dialog.md` 中补充
   - 功能：在组件中使用 `commonDialogMethod` 的便捷 Hook

4. **useQRCode** (`src/table/opr/useQRCode.js`) ✅
   - 导出位置：`src/index.js`
   - 状态：已在 `utils.md` 中补充
   - 功能：使用 QRCode 的 Hook

5. **createQRCode** (`src/table/opr/useDataColumn.jsx`) ✅
   - 导出位置：`src/index.js`
   - 状态：已在 `utils.md` 中补充
   - 功能：创建二维码弹窗

### Dialog 工具函数
6. **createDialog** (`src/utils/dialog.js`) ✅
   - 导出位置：`src/index.js`
   - 状态：已在 `dialog.md` 中补充
   - 功能：使用 dialog 的工具函数

7. **createDialogMethods** (`src/utils/dialog.js`) ✅
   - 导出位置：`src/index.js`
   - 状态：已在 `dialog.md` 中补充
   - 功能：Dialog 快捷方法（info、success、warning、error、create）

8. **createDialogOptions** (`src/utils/dialog.js`) ✅
   - 导出位置：`src/index.js`
   - 状态：已在 `dialog.md` 中补充
   - 功能：创建 dialog 配置，应用主题色继承设置

### 插件和指令
9. **CorePlugin / install** (`src/plugin/index.js`) ✅
   - 导出位置：`src/index.js`
   - 状态：已在 `config.md` 中补充
   - 功能：库插件，用于注册指令等全局功能

10. **permissionDirective** (`src/directives/permission.js`) ✅
    - 导出位置：`src/index.js`
    - 状态：已在 `utils.md` 中补充
    - 功能：权限指令 `v-corePermission`

11. **registerDirectives** (`src/directives/auto-register.js`) ✅
    - 导出位置：`src/index.js`
    - 状态：已在 `config.md` 中补充
    - 功能：注册所有指令到应用实例

12. **autoRegisterDirectives** (`src/directives/auto-register.js`) ✅
    - 导出位置：`src/index.js`
    - 状态：已在 `config.md` 中补充
    - 功能：尝试自动注册指令

13. **getGlobalApp** (`src/directives/auto-register.js`) ✅
    - 导出位置：`src/index.js`
    - 状态：已在 `config.md` 中补充
    - 功能：获取全局应用实例

### 配置相关
14. **getAllOptions** (`src/options/defaultOptions.jsx`) ✅
    - 导出位置：`src/index.js`
    - 状态：已在 `config.md` 中补充
    - 功能：获取所有已注册的 Options

15. **getOptions** (`src/options/defaultOptions.jsx`) ✅
    - 导出位置：`src/index.js`
    - 状态：已在 `config.md` 中补充
    - 功能：获取指定的 Options

## 文档中提到的但代码未导出的内容

### 需要修复
- ✅ **useAuthPermission** (`src/utils/auth.js`)
  - 状态：已在 `src/index.js` 中添加导出
  - 文档位置：`utils.md` 中已补充详细说明
  - 问题：已修复

### 需要补充说明的
- ✅ `initRules` - 已在 `dataform.md` 中补充详细说明
- ✅ `globalLabelField` / `globalValueField` - 已在 `options.md` 和 `usage.md` 中补充说明

## 已完整文档化的内容

### 组件
- ✅ DataForm (`dataform.md`)
- ✅ DataTable (`datatable.md`)
- ✅ CommonQuery (`query.md`)
- ✅ Options (`options.md`)

### 方法
- ✅ commonDialogMethod (`dialog.md`)
- ✅ createActionColumnJsx (`utils.md`)

### 工具函数
- ✅ toArray, ArrayToObject, ObjectToArray (`utils.md`)
- ✅ customUpload, registryUpload, getFileUrl (`utils.md`)
- ✅ cellectChildenPermission, handleParams, useApiConfig (`utils.md`)
- ✅ initRouteMeta (`utils.md`)
- ✅ ellipsis (`utils.md`)
- ⏸️ orderEnum - 暂时不开放（已从文档中移除）

### 配置
- ✅ setupConfig (`config.md`)
- ✅ setupOptions (`config.md`)
- ✅ registerDialogInstance (`config.md`)

## 暂时不开放的功能

### 排序相关
- ⏸️ **orderEnum** (`src/enum/sort.js`)
  - 状态：代码中存在，但文档中已移除
  - 原因：使用方式尚未确定，暂时不开放
  - 说明：相关文档已从 `utils.md` 和 `datatable.md` 中移除

## 建议的文档结构优化

1. **创建 `components/opr-button.md`** - OprButton 组件文档
2. **创建 `components/pop.md`** - Pop 组件文档
3. **在 `components/dialog.md` 中补充**：
   - useCommonDialog Hook
   - createDialog、createDialogMethods、createDialogOptions
4. **在 `components/utils.md` 中补充**：
   - useQRCode Hook
   - createQRCode 函数
   - permissionDirective 指令
5. **在 `guide/config.md` 中补充**：
   - getAllOptions、getOptions 方法
   - CorePlugin / install 插件
   - registerDirectives、autoRegisterDirectives、getGlobalApp
6. **创建 `guide/plugin.md`** - 插件和指令使用指南（可选）

