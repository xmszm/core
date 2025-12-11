---
title: 示例 Demo 说明
---

## 本地预览 Demo

项目内提供 `examples/demo.vue`，包含 `DataForm`、`DataTable`、`commonDialogMethod` 的最小示例。

### 运行方式

1) 确认已安装依赖：
```bash
npm install
```

2) 在你的宿主工程中引入该组件文件（或复制内容），确保存在以下 alias：
```javascript
// vite / webpack 示例
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    core: path.resolve(__dirname, 'src'),
  },
}
```

3) 在页面中引用 `examples/demo.vue`，即可直接运行。

## 预览文档站点

项目内已配置 VitePress：

```bash
npm run docs:dev     # 本地启动文档
npm run docs:build   # 生成静态文档
npm run docs:preview # 预览打包产物
```

生成的静态文件位于 `.vitepress/dist`，可部署到 GitHub Pages / 其他静态托管服务。

## 小贴士
- 需要更多自定义场景，可在 `examples/` 下新增页面，并在文档中添加入口链接。
- 若使用 GitHub Actions 部署，可直接在构建步骤运行 `npm run docs:build` 后推送 `.vitepress/dist`。

## 标准后台列表页示例
典型布局：头部筛选区 + 操作区 + 内容表格区（含弹窗操作）。`DataTable` 本身是 flex 元素，会在容器内自适应填满。

```vue
<script setup lang="jsx">
import AddButton from '@/components/button/AddButton.jsx'
import { useNaivePage } from '@/use/useNaivePage'
import { onMounted, ref } from 'vue'
import {
  commonDialogMethod,
  CommonQuery,
  createActionColumnJsx,
  DataTable,
} from '@xmszm/core'

// 列表数据与查询管理
const { pageState, listQuery } = useNaivePage(() => {
  listQuery.desc = true
  // 示例：请求数据
  // fetchList(listQuery)
  //   .then(res => {
  //     pageState.data = res.data.records
  //     pageState.itemCount = res.data.total
  //   })
  //   .finally(pageState.hideLoading)
})

// 头部查询项
const keyQuery = [
  { label: '名称1', key: 'name1', queryType: 'likeQuery' },
  { label: '名称2', key: 'name2', queryType: 'likeQuery' },
  { label: '名称3', key: 'name3', queryType: 'likeQuery' },
]

// 表格列与操作列
const columns = []
const defaultColumns = []
const selectColumns = { type: 'selection', width: '40px' }
const opr = createActionColumnJsx([
  {
    label: '编辑',
    type: 'primary',
    onClick: row => onAdd(row),
  },
  {
    label: '删除',
    type: 'error',
    mode: 'pop',
    onClick: (row) => {
      // del(row.id).then(() => pageState.fetchData())
    },
  },
])

// 弹窗新增/编辑
function onAdd(row = null, mode = 'add') {
  commonDialogMethod({
    title: '示例弹窗',
    mode,
    options: [], // 这里填入 DataForm 配置
    valueData: { ...row },
    interfaceFn: (data, { close }) => {
      // save(data).then(() => { pageState.fetchData(); close() })
    },
  })
}

// 导出示例
const exportLoading = ref(false)
function onExport() {
  exportLoading.value = true
  // exportApi(listQuery).finally(() => (exportLoading.value = false))
}

onMounted(() => pageState.fetchData())
</script>

<template>
  <div class="page-box">
    <!-- 头部筛选 -->
    <n-card class="page-head">
      <CommonQuery
        :query="listQuery"
        :options="keyQuery"
        @submit="pageState.search()"
        @reset="pageState.reset()"
      />
    </n-card>

    <!-- 操作区 -->
    <n-space justify="space-between">
      <n-space>
        <AddButton @click="onAdd()">新增</AddButton>
        <n-button type="primary" :loading="exportLoading" @click="onExport">
          导出
        </n-button>
      </n-space>
    </n-space>

    <!-- 内容表格区 -->
    <div class="page-main">
      <DataTable
        :data="pageState.data"
        :pagination="pageState"
        :columns="columns"
        :opr-columns="opr"
        :default-columns="defaultColumns"
        :row-key="row => row?.id"
        :select-columns="selectColumns"
        :loading="pageState.loading"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.page-head {
  border-radius: 8px;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.page-main {
  flex: 0 1 auto;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  flex-direction: column;
  row-gap: 10px;

  .n-data-table {
    .n-data-table-th {
      background-color: #f7f8fa;
      border-right: 1px solid var(--n-merged-border-color);
      white-space: break-spaces;
    }
    .n-data-table-th--last {
      border-right: 1px solid transparent;
    }
    .n-data-table-td--last-row {
      border-bottom: 1px solid var(--n-merged-border-color);
    }
  }
}

.page-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px); // 可按实际头/标签高度调整
  margin: -16px;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
  row-gap: 20px;
}
</style>
```

> 说明：
> - `.page-box / .page-head / .page-main` 可抽成全局布局样式复用。
> - `DataTable` 是 flex 元素，会在容器内自适应填满；容器需设置高度或弹性布局。
> - 示例中的接口调用、列配置、表单 options 需按业务填充。

