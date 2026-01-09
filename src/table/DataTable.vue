<script setup lang="tsx">
import type { DataTableProps, DataTableExpose } from "../../types/components";
import { ChevronDown, ChevronUp, Code, Funnel } from "@vicons/ionicons5";
import { commonDialogMethod, toArray } from "core";
import { ellipsis } from "core/table/utils/ellipsis";
import dayjs from "dayjs";
import { uniqueId } from "lodash-es";
import { NButton, NTooltip } from "naive-ui";
import {
  computed,
  onMounted,
  ref,
  unref,
  watch,
  isProxy,
  getCurrentInstance,
} from "vue";
import { useRoute } from "vue-router";
import FilterDialog from "./FilterDialog.vue";
import { orderEnum } from "core";
import { registerDirectives } from "../directives/auto-register";
import { NDataTable, NEmpty } from "naive-ui";
// 自动注册指令
const instance = getCurrentInstance();
if (instance?.appContext?.app) {
  registerDirectives(instance.appContext.app);
}

const props = withDefaults(defineProps<DataTableProps>(), {
  data: () => [],
  pagination: undefined,
  columns: () => [
    {
      title: "测试案例",
    },
  ],
  oprColumns: null,
  selectColumns: null,
  defaultColumns: () => [],
  summaryColumns: null,
  emptyText: "没有数据",
  emptyIcon: "",
  isFilter: false,
  isEllipsis: true,
  virtual: () => false,
  singleColumn: false,
});
const route = useRoute();
const FilterKey = "filter_key";
const emit = defineEmits<{
  sorted: [];
}>();

// 安全获取路由路径，如果没有路由上下文则使用默认值
const getRoutePath = (): string => {
  try {
    return route?.fullPath || route?.path || "";
  } catch {
    return "";
  }
};

const _data = computed(() => {
  console.log("table -data", props.data);

  return props.data;
});
function setHeadFilter(val: Record<string, any>): void {
  window.localStorage.setItem(FilterKey, JSON.stringify(val));
}

function getHeadFilter(): Record<string, any> {
  return JSON.parse(window.localStorage.getItem(FilterKey) || "{}") || {};
}

const getFilterAll = ref(getHeadFilter());
const headDefault = ref([]);

const scrollX = ref(0);

function _summary(pageData: any[]): Record<string, { value: any }> | undefined {
  if (!props.summaryColumns) return;
  return [
    props.selectColumns,
    ...unref(props.columns || []),
    props.oprColumns,
  ]?.reduce((o: Record<string, { value: any }>, n: any) => {
    if (n?.key)
      o[n.key] = props.summaryColumns?.(pageData)?.[n.key] || { value: null };
    else o[uniqueId("table")] = { value: null };
    return o;
  }, {});
}

const _columns = ref([]);

watch(
  () => unref(props.columns),
  () => {
    init();
  },
  {
    immediate: true,
  }
);

watch(
  () => props.oprColumns,
  (v) => {
    console.log("oprColumns", v);
  }
);

function init(): void {
  const columns = unref(props.columns || []);
  const routePath = getRoutePath();
  headDefault.value =
    (routePath && getFilterAll.value?.[routePath]) ||
    columns?.map(
      (v: any, i: number) => v?.key || String(dayjs().valueOf() + i)
    );

  const arr: any[] = props.isFilter
    ? columns.filter((item: any) => headDefault.value?.includes(item.key))
    : [...columns];
  if (props.selectColumns)
    arr.unshift({ key: "selectKey", ...props.selectColumns });
  if (props.oprColumns) arr.push(props.oprColumns);
  let scrollNum = 0;
  _columns.value = arr.reduce((o: any[], obj: any) => {
    if (obj?.display) console.log("display", obj?.display);
    if (!(obj?.display ?? true)) return o;
    const v: any = {
      align: "center",
      width: 120,
      ...obj,
      key: obj?.key || uniqueId("table"),
      ellipsis:
        obj?.ellipsis || props.isEllipsis
          ? obj?.ellipsisProp
            ? obj?.ellipsisProp(ellipsis)
            : ellipsis
          : false,
      "ellipsis-component": "ellipsis",
      title: () => {
        const title = obj?.label || obj?.title || "";
        return (
          <div style={{ width: "100%", whiteSpace: "pre-wrap" }}>
            {typeof title === "string" ? title : title?.()}
          </div>
        );
      },
    };

    if (obj?.sorter) {
      v.renderSorterIcon = ({ order }: { order: string }) => {
        const { Icon, title } = orderEnum[order as keyof typeof orderEnum];
        return (
          <NTooltip>
            {{
              trigger: () => Icon,
              default: () => title,
            }}
          </NTooltip>
        );
      };
      v.sorter = {
        multiple: 1,
        fn: obj.sorter,
      };
    }

    scrollNum += v?.width
      ? Number.parseInt(String(v?.width))
      : (typeof v?.title === "string" ? v?.title?.length * 30 : 0) || 0;

    o.push(v);
    return o;
  }, []);
  scrollX.value = scrollNum;
  console.log("计算");
}

function filterButton(): any {
  return (
    <NButton type="info" onClick={() => filterHandle()}>
      {{
        default: () => "筛选字段",
        icon: () => <Funnel />,
      }}
    </NButton>
  );
}

function filterHandle(): void {
  const { cancel } = commonDialogMethod(
    {
      title: "筛选字段",
      read: true,
      options: [
        {
          key: "filter-dialog",
          render: () => (
            <FilterDialog
              style={{
                width: "100%",
                margin: "0",
                padding: 0,
              }}
              filterItem={unref(props.columns || [])}
              selectItem={headDefault.value}
              defaultItem={props.defaultColumns}
              onSubmit={(v: string[]) => {
                const routePath = getRoutePath();
                if (routePath) {
                  getFilterAll.value[routePath] = v;
                  setHeadFilter(getFilterAll.value);
                }
                init();
                cancel();
              }}
            />
          ),
        },
      ],
    },
    {
      closable: false,
      style: {
        width: "500px",
      },
    }
  );
}

function onSorter(e: any): void {
  console.log("onSorter", e);
  if (!e) return;
  const sortArr = toArray(e);

  sortArr.forEach((v: any) => {
    console.log("v", v);

    if (v?.sorter) {
      v?.sorter?.fn?.(
        (listQuery: any, pageState: any, key: string) => {
          orderEnum[v.order as keyof typeof orderEnum]?.fn(listQuery, key);
          pageState.fetchData();
        },
        {
          field: v?.columnKey,
          value: orderEnum[v?.order as keyof typeof orderEnum]?.value,
          isClick: !isProxy(v),
        }
      );
    }
  });

  emit("sorted");
}

defineExpose<DataTableExpose>({
  filterHandle,
  filterButton,
  initColumns: init,
});

onMounted(() => {});
</script>

<template>
  <NDataTable
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
    :virtual-scroll="!!(props.virtual ?? props.data.length > 1000)"
    style="flex: 1"
    @update:sorter="onSorter"
  >
    <!-- props.data.length > 30 -->
    <template #empty>
      <slot name="empty">
        <NEmpty>{{ emptyText }}</NEmpty>
      </slot>
    </template>
  </NDataTable>
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
