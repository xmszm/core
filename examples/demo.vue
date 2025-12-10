<script setup lang="jsx">
import { computed, onMounted, reactive } from 'vue'
import { NButton, NCard, NSpace } from 'naive-ui'
import {
  commonDialogMethod,
  CommonQuery,
  createActionColumnJsx,
  DataTable,
} from 'core'
import 'core/dist/style.css'

// 查询与分页状态（可替换为业务方的 useNaivePage）
const listQuery = reactive({
  page: 1,
  pageSize: 10,
  desc: true,
  likeQuery: {
    name1: '',
    name2: '',
    name3: '',
  },
})

const pageState = reactive({
  data: [],
  itemCount: 0,
  loading: false,
  page: computed(() => listQuery.page),
  pageSize: computed(() => listQuery.pageSize),
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onUpdatePage: (p) => {
    listQuery.page = p
    pageState.fetchData()
  },
  onUpdatePageSize: (ps) => {
    listQuery.pageSize = ps
    listQuery.page = 1
    pageState.fetchData()
  },
  fetchData: async () => {
    pageState.loading = true
    try {
      // 模拟请求
      const mock = Array.from({ length: 25 }).map((_, i) => ({
        id: i + 1,
        name: `名称-${i + 1}`,
        type: i % 2 ? 'B' : 'A',
      }))
      pageState.itemCount = mock.length
      const start = (listQuery.page - 1) * listQuery.pageSize
      const end = start + listQuery.pageSize
      pageState.data = mock.slice(start, end)
    }
    finally {
      pageState.loading = false
    }
  },
  search: () => {
    listQuery.page = 1
    pageState.fetchData()
  },
  reset: () => {
    listQuery.likeQuery = { name1: '', name2: '', name3: '' }
    listQuery.page = 1
    pageState.fetchData()
  },
})

// 查询项
const keyQuery = [
  { label: '名称1', key: 'name1', queryType: 'likeQuery' },
  { label: '名称2', key: 'name2', queryType: 'likeQuery' },
  { label: '名称3', key: 'name3', queryType: 'likeQuery' },
]

// 表格列与操作列
const columns = [
  { title: '名称', key: 'name', width: 160 },
  { title: '类型', key: 'type', width: 120 },
]
const defaultColumns = []
const selectColumns = { type: 'selection', width: '40px' }
const opr = createActionColumnJsx([
  {
    label: '编辑',
    type: 'primary',
    onClick: row => onAdd(row, 'edit'),
  },
  {
    label: '删除',
    type: 'error',
    mode: 'pop',
    onClick: (row) => {
      // del(row.id).then(() => pageState.fetchData())
      console.log('删除', row)
    },
  },
])

// 弹窗新增/编辑
function onAdd(row = null, mode = 'add') {
  commonDialogMethod({
    title: '示例弹窗',
    mode,
    options: [
      { key: 'name', label: '名称', way: 'input', required: true },
      {
        key: 'type',
        label: '类型',
        way: 'select',
        options: [
          { label: '类型A', value: 'A' },
          { label: '类型B', value: 'B' },
        ],
      },
    ],
    valueData: { ...row },
    interfaceFn: async (data, { close }) => {
      console.log('提交数据', data)
      // await save(data)
      pageState.fetchData()
      close()
    },
  })
}

// 导出示例
const exportLoading = reactive({ value: false })
function onExport() {
  exportLoading.value = true
  // exportApi(listQuery).finally(() => (exportLoading.value = false))
  setTimeout(() => (exportLoading.value = false), 800)
}

onMounted(() => pageState.fetchData())
</script>

<template>
  <div class="page-box">
    <!-- 头部筛选 -->
    <NCard class="page-head">
      <CommonQuery
        :query="listQuery"
        :options="keyQuery"
        @submit="pageState.search()"
        @reset="pageState.reset()"
      />
    </NCard>

    <!-- 操作区 -->
    <NSpace justify="space-between">
      <NSpace>
        <NButton type="primary" @click="onAdd()">新增</NButton>
        <NButton type="primary" :loading="exportLoading.value" @click="onExport">
          导出
        </NButton>
      </NSpace>
    </NSpace>

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

