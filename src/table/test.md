```vue
<template>
  <div class="page-box">
    <n-space justify="space-between">
      <CommonQuery :query="listQuery" :options="keyQuery" @submit="pageState.search()" @reset="pageState.reset()" />
    </n-space>
    <div style="margin-bottom: 15px; margin-top: 10px">
      <n-space>
        <n-button type="primary" @click="onAddOrEdit(null, 'add')">新增资讯</n-button>
        <n-button type="primary" :disabled="checkedRowKeysRef.length === 0" @click="onSendBatch()"
          >批量发布资讯</n-button
        >
      </n-space>
    </div>
    <div class="page-main">
      <DataTable
        ref="tableRef"
        v-model:checked-row-keys="checkedRowKeysRef"
        :loading="pageState.loading"
        :data="pageState.list"
        :pagination="pageState"
        :columns="columns"
        :opr-columns="oprColumns"
        :select-columns="selectColumns"
        :row-key="(row) => row.id"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNaivePage } from '@/use/useNaivePage.jsx'
import { useDeleteConfirm, useInfoConfirm } from '@/use/dialog.js'
import { getList, save, add, remove, sendBatch } from '@/api/spreadPlatform/information.js'
import { DataTable, commonDialogMethod, createActionColumnJsx } from 'core'

const router = useRouter()
const route = useRoute()

// way:'select'的 options可以根据enum 通过 options = ObjectToArray(enum) 转换


const keyQuery = [
  {
    label: '名称',
    key: 'name',
    queryType: 'likeQuery'
  },
  {
    label: '类型',
    key: 'type',
    queryType: 'andQuery',
    way: 'select',
    options: [
      { label: '类型1', value: 1 },
      { label: '类型2', value: 2 }
    ]
  },
  {
    label: '状态',
    key: 'status',
    queryType: 'andQuery',
    way: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  }
]
onMounted(() => {
  pageState.search()
})
const infoContent = ref('确认要批量发布吗？')
function ReqGetList() {
  pageState.showLoading()
  getList(listQuery)
    .then((res) => {
      pageState.list = res.data.records
      pageState.itemCount = res.data.total
    })
    .finally(() => {
      pageState.hideLoading()
    })
}
const checkedRowKeysRef = ref([])

const columns = [
  {
    key: 'sort',
    title: '排序',
    render(row, index) {
      return index + 1
    }
  },

  {
    key: 'name',
    title: '资讯标题'
  },
  {
    key: 'link',
    title: '链接'
  },
  {
    title: '来源平台',
    key: 'source'
  },
  {
    title: '发布',
    key: 'sendStatus',
    render: (row) => (row?.sendStatus ? '已发布' : '未发布')
  },
  {
    title: '发布日期',
    key: 'sendTime'
  },
  {
    title: '显示',
    key: 'status',
    render: (row) => (
      <NSwitch
        v-model:value={row.status}
        onUpdateValue={(v) => {
          pageState.showLoading()
          save({
            id: row.id,
            status: v
          })
            .then((res) => {
              $message.success('操作成功')
            })
            .catch(() => {
              row.status = !v
            })
            .finally(() => pageState.hideLoading())
        }}
      />
    )
  }
]
const oprColumns = createActionColumnJsx(
  [
    {
      label: '编辑',
      type: 'primary',

      onClick: (row) => onAddOrEdit(row, 'edit'),
      permission: []
    },

    {
      label: '删除',
      type: 'error',
      mode: 'pop',
      onClick: (row) =>
        remove({ id: row.id }).then(() => {
          $message.success('操作成功')
          pageState.fetchData()
        }),
      permission: []
    }
  ],
  {
    width: 200
  }
)
const selectColumns = {
  type: 'selection'
  width: 50
}

const { pageState, listQuery } = useNaivePage(ReqGetList)

function onSendBatch() {
  commonDialogMethod({
    title: '批量发布',
    mode: null,
    options: [
      {
        render: () => '确认要批量发布吗？'
      }
    ],
    interfaceFn: (_, { close }) =>
      sendBatch(checkedRowKeysRef.value).then(() => {
        $message.success('操作成功')
        pageState.fetchData()
        checkedRowKeysRef.value = []
        close()
      })
  })
}

function onAddOrEdit(row = {}, mode = 'add') {
  const { model, modeEnum } = commonDialogMethod(
    {
      title: '资讯',
      mode,
      options: [
        {
          label: '标题',
          key: 'name',
          required: true
        },
        {
          label: '链接',
          key: 'link',
          required: true
        },
        {
          label: '来源平台',
          key: 'source',
          required: true
        },
        {
          label: '排序',
          key: 'sort',
          way: 'inputNumber'
        },
        {
          label: '是否展示',
          key: 'status',
          way: 'switch'
        }
      ],
      valueData: { status: true, sort: pageState.itemCount, ...row },
      interfaceFn: (data, { close }) =>
        (data?.id ? save : add)(data).then(() => {
          pageState.fetchData()
          $message.succees(`${modeEnum[mode]}成功`)
          close()
        })
    },
    {
      style: {
        width: '600px'
      }
    }
  )
}
</script>

<style scoped lang="less">
.xxx-page {
}
</style>
```
