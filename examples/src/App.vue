<script setup lang="jsx">
import { computed, onMounted, reactive, ref } from 'vue'
import { NButton, NCard, NSpace, NLayout, NLayoutHeader, NLayoutContent } from 'naive-ui'
import {
  commonDialogMethod,
  CommonQuery,
  createActionColumnJsx,
  DataTable,
} from '@xmszm/core'
import '@xmszm/core/dist/style.css'
import Introduction from './Introduction.vue'

// 从 localStorage 读取保存的视图，如果没有则默认为 'introduction'
const getInitialView = () => {
  const saved = localStorage.getItem('core-app-view')
  return saved === 'demo' ? 'demo' : 'introduction'
}

const currentView = ref(getInitialView())

// 切换视图时保存到 localStorage
const switchView = (view) => {
  currentView.value = view
  localStorage.setItem('core-app-view', view)
  // 如果切换到 demo 视图且数据为空，则加载数据
  if (view === 'demo' && pageState.data.length === 0) {
    pageState.fetchData()
  }
}

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
          { name: '类型A', id: 'A' },
          { name: '类型B', id: 'B' },
        ],
      },
    ],
    valueData: { ...row },
    interfaceFn: async (data, { close }) => {
      console.log('提交数据', data)
      pageState.fetchData()
      close()
    },
  })
}

// 导出示例
const exportLoading = reactive({ value: false })
function onExport() {
  exportLoading.value = true
  setTimeout(() => (exportLoading.value = false), 800)
}

onMounted(() => {
  // 如果当前视图是 demo，则加载数据
  if (currentView.value === 'demo') {
    pageState.fetchData()
  }
})
</script>

<template>
  <n-layout class="app-layout">
    <n-layout-header class="app-header" bordered>
      <div class="header-content">
        <h2 class="app-title">@xmszm/core 组件库</h2>
        <n-space>
          <n-button
            :type="currentView === 'introduction' ? 'primary' : 'default'"
            @click="switchView('introduction')"
          >
            项目介绍
          </n-button>
          <n-button
            :type="currentView === 'demo' ? 'primary' : 'default'"
            @click="switchView('demo')"
          >
            组件示例
          </n-button>
        </n-space>
      </div>
    </n-layout-header>
    <n-layout-content class="app-content">
      <Introduction v-if="currentView === 'introduction'" />
      <div v-else class="page-box">
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
            :flex-height="false"
          />
        </div>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<style scoped lang="less">
.app-layout {
  height: 100vh;
}

.app-header {
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  background: #fff;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #18a058;
}

.app-content {
  padding: 0;
  overflow: auto;
}

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
  min-height: calc(100vh - 64px);
  padding: 24px;
  box-sizing: border-box;
  background: #f5f5f5;
  row-gap: 20px;
}
</style>

