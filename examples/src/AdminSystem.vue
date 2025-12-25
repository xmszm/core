<script setup lang="jsx">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  NButton,
  NCard,
  NSpace,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NLayoutContent,
  NMenu,
  NIcon,
  NAvatar,
  NDropdown,
  NBadge,
  NDivider,
  NPagination,
} from 'naive-ui'
import {
  PersonOutline,
  SettingsOutline,
  LogOutOutline,
  NotificationsOutline,
  MenuOutline,
  PeopleOutline,
  ShieldCheckmarkOutline,
  DocumentTextOutline,
  BarChartOutline,
  HomeOutline,
  ArrowBackOutline,
} from '@vicons/ionicons5'
import {
  commonDialogMethod,
  CommonQuery,
  createActionColumnJsx,
  DataTable,
} from '@xmszm/core'
import '@xmszm/core/dist/style.css'

// 当前选中的菜单项
const activeMenuKey = ref('users')
const collapsed = ref(false)

// 菜单配置
const menuOptions = [
  {
    label: '首页',
    key: 'home',
    icon: HomeOutline,
  },
  {
    label: '用户管理',
    key: 'users',
    icon: PeopleOutline,
  },
  {
    label: '角色管理',
    key: 'roles',
    icon: ShieldCheckmarkOutline,
  },
  {
    label: '权限管理',
    key: 'permissions',
    icon: SettingsOutline,
  },
  {
    label: '数据统计',
    key: 'statistics',
    icon: BarChartOutline,
  },
  {
    label: '系统日志',
    key: 'logs',
    icon: DocumentTextOutline,
  },
]

// 用户信息
const userInfo = reactive({
  name: '管理员',
  avatar: '',
  role: '超级管理员',
})

// 查询与分页状态
const listQuery = reactive({
  page: 1,
  pageSize: 10,
  desc: true,
  likeQuery: {
    name: '',
    email: '',
    status: '',
  },
})

const pageState = reactive({
  data: [],
  itemCount: 0,
  loading: false,
  page: computed(() => listQuery.page),
  pageSize: computed(() => listQuery.pageSize),
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
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
      // 根据当前菜单项模拟不同的数据
      const mockData = generateMockData(activeMenuKey.value)
      pageState.itemCount = mockData.length
      const start = (listQuery.page - 1) * listQuery.pageSize
      const end = start + listQuery.pageSize
      pageState.data = mockData.slice(start, end)
    } finally {
      pageState.loading = false
    }
  },
  search: () => {
    listQuery.page = 1
    pageState.fetchData()
  },
  reset: () => {
    listQuery.likeQuery = { name: '', email: '', status: '' }
    listQuery.page = 1
    pageState.fetchData()
  },
})

// 根据菜单项生成模拟数据
function generateMockData(key) {
  const count = 35
  switch (key) {
    case 'users':
      return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        name: `用户${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? '管理员' : i % 3 === 1 ? '编辑' : '普通用户',
        status: i % 4 === 0 ? '禁用' : '启用',
        createTime: `2024-01-${String(i % 28 + 1).padStart(2, '0')} 10:00:00`,
      }))
    case 'roles':
      return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        name: `角色${i + 1}`,
        code: `ROLE_${String(i + 1).padStart(3, '0')}`,
        description: `这是角色${i + 1}的描述信息`,
        userCount: Math.floor(Math.random() * 100),
        createTime: `2024-01-${String(i % 28 + 1).padStart(2, '0')} 10:00:00`,
      }))
    case 'permissions':
      return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        name: `权限${i + 1}`,
        code: `PERM_${String(i + 1).padStart(3, '0')}`,
        type: i % 3 === 0 ? '菜单' : i % 3 === 1 ? '按钮' : '接口',
        path: `/system/permission${i + 1}`,
        createTime: `2024-01-${String(i % 28 + 1).padStart(2, '0')} 10:00:00`,
      }))
    case 'statistics':
      return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        date: `2024-01-${String(i % 28 + 1).padStart(2, '0')}`,
        pv: Math.floor(Math.random() * 10000),
        uv: Math.floor(Math.random() * 5000),
        orderCount: Math.floor(Math.random() * 500),
        revenue: (Math.random() * 100000).toFixed(2),
      }))
    case 'logs':
      return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        operator: `操作员${i + 1}`,
        action: i % 4 === 0 ? '新增' : i % 4 === 1 ? '编辑' : i % 4 === 2 ? '删除' : '查询',
        module: i % 3 === 0 ? '用户管理' : i % 3 === 1 ? '角色管理' : '权限管理',
        ip: `192.168.1.${i % 255}`,
        time: `2024-01-${String(i % 28 + 1).padStart(2, '0')} ${String(10 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
      }))
    default:
      return []
  }
}

// 根据菜单项获取查询配置
function getQueryOptions() {
  switch (activeMenuKey.value) {
    case 'users':
      return [
        { label: '用户名', key: 'name', queryType: 'likeQuery' },
        { label: '邮箱', key: 'email', queryType: 'likeQuery' },
        {
          label: '状态',
          key: 'status',
          queryType: 'likeQuery',
          way: 'select',
          options: [
            { name: '启用', id: '启用' },
            { name: '禁用', id: '禁用' },
          ],
        },
      ]
    case 'roles':
      return [
        { label: '角色名称', key: 'name', queryType: 'likeQuery' },
        { label: '角色编码', key: 'code', queryType: 'likeQuery' },
      ]
    case 'permissions':
      return [
        { label: '权限名称', key: 'name', queryType: 'likeQuery' },
        { label: '权限编码', key: 'code', queryType: 'likeQuery' },
        {
          label: '类型',
          key: 'type',
          queryType: 'likeQuery',
          way: 'select',
          options: [
            { name: '菜单', id: '菜单' },
            { name: '按钮', id: '按钮' },
            { name: '接口', id: '接口' },
          ],
        },
      ]
    case 'statistics':
      return [
        { label: '日期', key: 'date', queryType: 'likeQuery', way: 'date-picker' },
      ]
    case 'logs':
      return [
        { label: '操作员', key: 'operator', queryType: 'likeQuery' },
        { label: '操作模块', key: 'module', queryType: 'likeQuery' },
      ]
    default:
      return []
  }
}

// 根据菜单项获取表格列配置
function getTableColumns() {
  switch (activeMenuKey.value) {
    case 'users':
      return [
        { title: 'ID', key: 'id', width: 80 },
        { title: '用户名', key: 'name', width: 120 },
        { title: '邮箱', key: 'email', width: 200 },
        { title: '角色', key: 'role', width: 120 },
        { title: '状态', key: 'status', width: 100 },
        { title: '创建时间', key: 'createTime', width: 180 },
      ]
    case 'roles':
      return [
        { title: 'ID', key: 'id', width: 80 },
        { title: '角色名称', key: 'name', width: 150 },
        { title: '角色编码', key: 'code', width: 150 },
        { title: '描述', key: 'description', width: 200 },
        { title: '用户数', key: 'userCount', width: 100 },
        { title: '创建时间', key: 'createTime', width: 180 },
      ]
    case 'permissions':
      return [
        { title: 'ID', key: 'id', width: 80 },
        { title: '权限名称', key: 'name', width: 150 },
        { title: '权限编码', key: 'code', width: 150 },
        { title: '类型', key: 'type', width: 100 },
        { title: '路径', key: 'path', width: 200 },
        { title: '创建时间', key: 'createTime', width: 180 },
      ]
    case 'statistics':
      return [
        { title: 'ID', key: 'id', width: 80 },
        { title: '日期', key: 'date', width: 120 },
        { title: 'PV', key: 'pv', width: 120 },
        { title: 'UV', key: 'uv', width: 120 },
        { title: '订单数', key: 'orderCount', width: 120 },
        { title: '收入(元)', key: 'revenue', width: 120 },
      ]
    case 'logs':
      return [
        { title: 'ID', key: 'id', width: 80 },
        { title: '操作员', key: 'operator', width: 120 },
        { title: '操作', key: 'action', width: 100 },
        { title: '模块', key: 'module', width: 120 },
        { title: 'IP地址', key: 'ip', width: 150 },
        { title: '操作时间', key: 'time', width: 180 },
      ]
    default:
      return []
  }
}

// 根据菜单项获取表单配置
function getFormOptions() {
  switch (activeMenuKey.value) {
    case 'users':
      return [
        { key: 'name', label: '用户名', way: 'input', required: true },
        { key: 'email', label: '邮箱', way: 'input', required: true },
        {
          key: 'role',
          label: '角色',
          way: 'select',
          required: true,
          options: [
            { name: '管理员', id: '管理员' },
            { name: '编辑', id: '编辑' },
            { name: '普通用户', id: '普通用户' },
          ],
        },
        {
          key: 'status',
          label: '状态',
          way: 'select',
          required: true,
          options: [
            { name: '启用', id: '启用' },
            { name: '禁用', id: '禁用' },
          ],
        },
      ]
    case 'roles':
      return [
        { key: 'name', label: '角色名称', way: 'input', required: true },
        { key: 'code', label: '角色编码', way: 'input', required: true },
        { key: 'description', label: '描述', way: 'textarea' },
      ]
    case 'permissions':
      return [
        { key: 'name', label: '权限名称', way: 'input', required: true },
        { key: 'code', label: '权限编码', way: 'input', required: true },
        {
          key: 'type',
          label: '类型',
          way: 'select',
          required: true,
          options: [
            { name: '菜单', id: '菜单' },
            { name: '按钮', id: '按钮' },
            { name: '接口', id: '接口' },
          ],
        },
        { key: 'path', label: '路径', way: 'input' },
      ]
    default:
      return []
  }
}

// 表格列与操作列
const columns = computed(() => getTableColumns())
const defaultColumns = []
const selectColumns = { type: 'selection', width: '40px' }
const opr = createActionColumnJsx([
  {
    label: '编辑',
    type: 'primary',
    onClick: (row) => onAdd(row, 'edit'),
  },
  {
    label: '删除',
    type: 'error',
    mode: 'pop',
    onClick: (row) => {
      console.log('删除', row)
      pageState.fetchData()
    },
  },
])

// 弹窗新增/编辑
function onAdd(row = null, mode = 'add') {
  if (activeMenuKey.value === 'statistics' || activeMenuKey.value === 'logs') {
    return
  }
  const formOptions = getFormOptions()
  if (formOptions.length === 0) return

  commonDialogMethod({
    title: mode === 'add' ? '新增' : '编辑',
    mode,
    options: formOptions,
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

// 菜单切换
function handleMenuSelect(key) {
  activeMenuKey.value = key
  listQuery.page = 1
  listQuery.likeQuery = { name: '', email: '', status: '' }
  pageState.fetchData()
}

// 用户下拉菜单
const userMenuOptions = [
  {
    label: '个人设置',
    key: 'settings',
    icon: SettingsOutline,
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: LogOutOutline,
  },
]

function handleUserMenuSelect(key) {
  if (key === 'logout') {
    console.log('退出登录')
  } else if (key === 'settings') {
    console.log('个人设置')
  }
}

// 返回按钮处理
function handleBack() {
  // 如果在 GitHub Pages 环境，跳转到文档
  if (window.location.pathname.includes('/examples/')) {
    window.location.href = '/core/'
  } else {
    // 本地开发环境，切换视图
    localStorage.setItem('core-app-view', 'introduction')
    window.dispatchEvent(new CustomEvent('view-change', {
      detail: { view: 'introduction' }
    }))
  }
}

onMounted(() => {
  pageState.fetchData()
})
</script>

<template>
  <n-layout class="admin-layout" has-sider>
    <!-- 侧边栏 -->
    <n-layout-sider
      :collapsed="collapsed"
      :collapsed-width="64"
      :width="240"
      show-trigger
      collapse-mode="width"
      bordered
      class="admin-sider"
    >
      <div class="sider-header">
        <div class="logo">
          <n-icon :component="MenuOutline" :size="24" />
          <span v-if="!collapsed" class="logo-text">管理系统</span>
        </div>
      </div>
      <div class="sider-menu-wrapper">
        <n-menu
          :value="activeMenuKey"
          :options="menuOptions"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          @update:value="handleMenuSelect"
        />
      </div>
    </n-layout-sider>

    <!-- 主布局 -->
    <n-layout class="main-layout">
      <!-- 顶部导航栏 -->
      <n-layout-header bordered class="admin-header">
        <div class="header-left">
          <n-button
            quaternary
            circle
            @click="collapsed = !collapsed"
          >
            <template #icon>
              <n-icon :component="MenuOutline" />
            </template>
          </n-button>
          <n-divider vertical style="margin: 0 8px" />
          <n-button
            quaternary
            @click="handleBack"
          >
            <template #icon>
              <n-icon :component="ArrowBackOutline" />
            </template>
            返回
          </n-button>
        </div>
        <div class="header-right">
          <n-space :size="16">
            <!-- 通知 -->
            <n-badge :value="5" :max="99">
              <n-button quaternary circle>
                <template #icon>
                  <n-icon :component="NotificationsOutline" :size="20" />
                </template>
              </n-button>
            </n-badge>

            <!-- 用户信息 -->
            <n-dropdown
              :options="userMenuOptions"
              @select="handleUserMenuSelect"
            >
              <n-space :size="12" style="cursor: pointer; padding: 4px 8px">
                <n-avatar round :size="32">
                  {{ userInfo.name.charAt(0) }}
                </n-avatar>
                <div v-if="!collapsed" class="user-info">
                  <div class="user-name">{{ userInfo.name }}</div>
                  <div class="user-role">{{ userInfo.role }}</div>
                </div>
              </n-space>
            </n-dropdown>
          </n-space>
        </div>
      </n-layout-header>

      <!-- 主内容区 -->
      <n-layout-content class="admin-content">
        <!-- 内容区域（可滚动） -->
        <div class="content-scroll-area">
          <!-- 页面标题 -->
          <div class="page-header">
            <h2 class="page-title">
              {{ menuOptions.find(m => m.key === activeMenuKey)?.label || '管理后台' }}
            </h2>
          </div>

          <!-- 查询区域 -->
          <n-card class="query-card" v-if="activeMenuKey !== 'home'">
            <CommonQuery
              :query="listQuery"
              :options="getQueryOptions()"
              @submit="pageState.search()"
              @reset="pageState.reset()"
            />
          </n-card>

          <!-- 操作区域 -->
          <div class="action-bar" v-if="activeMenuKey !== 'home' && activeMenuKey !== 'statistics' && activeMenuKey !== 'logs'">
            <n-space>
              <n-button type="primary" @click="onAdd()">新增</n-button>
              <n-button type="primary" :loading="exportLoading.value" @click="onExport">
                导出
              </n-button>
            </n-space>
          </div>

          <!-- 首页内容 -->
          <div v-if="activeMenuKey === 'home'" class="home-content">
            <n-space vertical :size="24">
              <n-card title="系统概览">
                <n-space :size="24">
                  <n-card size="small" class="stat-card">
                    <div class="stat-value">1,234</div>
                    <div class="stat-label">总用户数</div>
                  </n-card>
                  <n-card size="small" class="stat-card">
                    <div class="stat-value">56</div>
                    <div class="stat-label">角色数量</div>
                  </n-card>
                  <n-card size="small" class="stat-card">
                    <div class="stat-value">128</div>
                    <div class="stat-label">权限数量</div>
                  </n-card>
                  <n-card size="small" class="stat-card">
                    <div class="stat-value">5,678</div>
                    <div class="stat-label">今日访问</div>
                  </n-card>
                </n-space>
              </n-card>
            </n-space>
          </div>

          <!-- 表格区域 -->
          <n-card v-else class="table-card">
            <DataTable
              :data="pageState.data"
              :pagination="false"
              :columns="columns"
              :opr-columns="opr"
              :default-columns="defaultColumns"
              :row-key="(row) => row?.id"
              :select-columns="selectColumns"
              :loading="pageState.loading"
              :flex-height="false"
            />
          </n-card>
        </div>

        <!-- 底部区域（固定） -->
        <div class="content-footer" v-if="activeMenuKey !== 'home'">
          <n-card class="footer-card">
            <div class="footer-content">
              <div class="pagination-wrapper">
                <n-pagination
                  v-model:page="listQuery.page"
                  v-model:page-size="listQuery.pageSize"
                  :page-count="Math.ceil(pageState.itemCount / listQuery.pageSize)"
                  :page-sizes="pageState.pageSizes"
                  :show-size-picker="pageState.showSizePicker"
                  @update:page="pageState.onUpdatePage"
                  @update:page-size="pageState.onUpdatePageSize"
                />
              </div>
            </div>
          </n-card>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped lang="less">
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  :deep(.n-layout) {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
}

.main-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-sider {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.n-layout-sider-scroll-container) {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .sider-header {
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--n-border-color);

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      font-weight: 600;
      color: #18a058;

      .logo-text {
        white-space: nowrap;
      }
    }
  }

  .sider-menu-wrapper {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.admin-header {
  height: 64px;
  flex-shrink: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-right {
    .user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.4;

      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .user-role {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f5f5;
  min-height: 0;

  // 内容滚动区域
  .content-scroll-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px;
    min-height: 0;
  }

  .page-header {
    flex-shrink: 0;
    margin-bottom: 24px;

    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
  }

  .query-card {
    flex-shrink: 0;
    margin-bottom: 16px;
    border-radius: 8px;
  }

  .action-bar {
    flex-shrink: 0;
    margin-bottom: 16px;
  }

  .table-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-radius: 8px;
    overflow: hidden;

    :deep(.n-card__content) {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    :deep(.n-data-table) {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;

      .n-data-table-wrapper {
        flex: 1;
        overflow: auto;
      }

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

  .home-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .stat-card {
      min-width: 200px;
      text-align: center;

      .stat-value {
        font-size: 32px;
        font-weight: 600;
        color: #18a058;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #666;
      }
    }
  }

  // 底部固定区域
  .content-footer {
    flex-shrink: 0;
    border-top: 1px solid var(--n-border-color);
    background: #fff;

    .footer-card {
      border-radius: 0;
      border: none;
      margin: 0;

      .footer-content {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 12px 24px;

        .pagination-wrapper {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>

