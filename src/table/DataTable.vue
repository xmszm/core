<script setup lang="jsx">
import { ChevronDown, ChevronUp, Code, Funnel } from '@vicons/ionicons5'
import { commonDialogMethod, toArray } from 'core'
import { ellipsis } from 'core/table/utils/ellipsis'
import dayjs from 'dayjs'
import { uniqueId } from 'lodash-es'
import { NButton, NTooltip } from 'naive-ui'
import { computed, onMounted, ref, unref, watch ,isProxy} from 'vue'
import { useRoute } from 'vue-router'
import FilterDialog from './FilterDialog.vue'
import { orderEnum } from 'core'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: [Object, null],
    default: () => undefined,
  },
  columns: {
    type: Array,
    default: () => [
      {
        title: '测试案例',
      },
    ],
  },
  oprColumns: {
    type: [Object, null],
    default: () => null,
  },
  selectColumns: {
    type: [Object, null],
    default: () => null,
  },
  defaultColumns: {
    type: Array,
    default: () => [],
  },
  summaryColumns: {
    type: null,
    default: () => null,
  },
  emptyText: {
    type: String,
    default: () => '没有数据',
  },
  emptyIcon: {
    type: String,
    default: () => '',
  },
  isFilter: {
    type: Boolean,
    default: () => false,
  },
  isEllipsis: {
    type: Boolean,
    default: () => true,
  },
  virtual: {
    type: null,
    default: () => {},
  },
  singleColumn: {
    type: Boolean,
    default: () => false,
  },
})
const route = useRoute()
const FilterKey = 'filter_key'
const emit = defineEmits(['sorted'])
const _data = computed(() => {
  console.log('table -data', props.data)

  return props.data
})
function setHeadFilter(val) {
  window.localStorage.setItem(FilterKey, JSON.stringify(val))
}

function getHeadFilter() {
  return JSON.parse(window.localStorage.getItem(FilterKey)) || {}
}

const getFilterAll = ref(getHeadFilter())
const headDefault = ref([])

const scrollX = ref(0)

function _summary(pageData) {
  if (!props.summaryColumns)
    return
  return [
    props.selectColumns,
    ...unref(props.columns),
    props.oprColumns,
  ]?.reduce((o, n) => {
    if (n?.key)
      o[n.key] = props.summaryColumns?.(pageData)?.[n.key] || { value: null }
    else o[uniqueId('table')] = { value: null }
    return o
  }, {})
}

const _columns = ref([])

watch(
  () => unref(props.columns),
  () => {
    init()
  },
  {
    immediate: true,
  },
)

watch(
  () => props.oprColumns,
  (v) => {
    console.log('oprColumns', v)
  },
)

function init() {
  const columns = unref(props.columns)
  headDefault.value
    = getFilterAll.value?.[route.fullPath]
      || columns?.map((v, i) => v?.key || dayjs().valueOf() + i)

  const arr = props.isFilter
    ? columns.filter(item => headDefault.value?.includes(item.key))
    : [...columns]
  if (props.selectColumns)
    arr.unshift({ key: 'selectKey', ...props.selectColumns })
  if (props.oprColumns)
    arr.push(props.oprColumns)
  let scrollNum = 0
  _columns.value = arr.reduce((o, obj) => {
    if (obj?.display)
      console.log('display', obj?.display)
    if (!(obj?.display ?? true))
      return o
    const v = {
      'align': 'center',
      'width': 120,
      ...obj,
      'key': obj?.key || uniqueId('table'),
      'ellipsis':
        obj?.ellipsis || props.isEllipsis
          ? obj?.ellipsisProp
            ? obj?.ellipsisProp(ellipsis)
            : ellipsis
          : false,
      'ellipsis-component': 'ellipsis' || 'performant-ellipsis',
      'title': () => {
        const title = obj?.label || obj?.title || ''
        return (
          <div style={{ width: '100%', whiteSpace: 'pre-wrap' }}>
            {typeof title === 'string' ? title : title?.()}
          </div>
        )
      },
    }

    if (obj?.sorter) {
      v.renderSorterIcon = ({ order }) => {
        const { Icon, title } = orderEnum[order]
        return (
          <NTooltip>
            {{
              trigger: () => Icon,
              default: () => title,
            }}
          </NTooltip>
        )
      }
      v.sorter = {
        multiple: 1,
        fn:obj.sorter
      }
    }


    scrollNum += v?.width
      ? Number.parseInt(v?.width)
      : null || v?.title?.length * v.length + 30 || 0

    o.push(v)
    return o
  }, [])
  scrollX.value = scrollNum
  console.log('计算')
}

function filterButton() {
  return (
    <NButton type="info" onClick={() => filterHandle()}>
      {{
        default: () => '筛选字段',
        icon: () => <Funnel />,
      }}
    </NButton>
  )
}

function filterHandle() {
  const { cancel } = commonDialogMethod(
    {
      title: '筛选字段',
      read: true,
      options: [
        {
          render: () => (
            <FilterDialog
              style={{
                width: '100%',
                margin: '0',
                padding: 0,
              }}
              filterItem={unref(props.columns)}
              selectItem={headDefault.value}
              defaultItem={props.defaultColumns}
              onSubmit={(v) => {
                getFilterAll.value[route.fullPath] = v
                setHeadFilter(getFilterAll.value)
                init()
                cancel()
              }}
            />
          ),
        },
      ],
    },
    {
      closable: false,
      style: {
        width: '500px',
      },
    },
  )
}

function onSorter(e) {
  console.log('onSorter', e)
  if (!e)
    return
  const sortArr = toArray(e)

  sortArr.forEach(v => {
    console.log('v', v)
    
    if (v?.sorter) {
      v?.sorter?.fn
      ((listQuery, pageState, key) => {
        orderEnum[v.order]?.fn(listQuery, key)
        pageState.fetchData()
      },{
        field: v?.columnKey,
        value: orderEnum[v?.order]?.value,
        isClick : !isProxy(v)
      })
    }
  })

  emit('sorted')
}

defineExpose({
  filterHandle,
  filterButton,
  initColumns: init,
})

onMounted(() => {})
</script>

<template>
  <n-data-table
    :data="_data"
    :columns="_columns"
    :scroll-x="scrollX"
    :single-column="props.singleColumn"
    :summary="props.summaryColumns ? _summary : undefined"
    summary-placement="bottom"
    :pagination="props.pagination"
    :row-props="() => ({ style: { height: '60px' } })"
    flex-height
    remote
    :virtual-scroll="props.virtual ?? props.data.length > 1000"
    style="flex: 1"
    @update:sorter="onSorter"
  >
    <!-- props.data.length > 30 -->
    <template #empty>
      <slot name="empty">
        <n-empty>{{ emptyText }}</n-empty>
      </slot>
    </template>
  </n-data-table>
</template>

<style scoped lang="less">
:deep(.n-data-table-tr--summary) {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  .n-data-table-td--summary {
    border-top: 1px solid var(--n-merged-border-color);
  }
}
</style>
