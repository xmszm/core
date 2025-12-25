<script setup>
import {
  useThemeVars,
  NCheckboxGroup,
  NCheckbox,
  NButton,
  NEllipsis,
} from "naive-ui";
import { ref, watchEffect } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: () => "primary",
  },
  filterItem: {
    type: Array,
    default: () => [],
  },
  selectItem: {
    type: Array,
    default: () => [],
  },
  defaultItem: {
    type: Array,
    default: () => [],
  },
  filterButtonKey: {
    type: Array,
    default: () => ["all", "selectDefault"],
    // default: () => ['all', 'selectDefault','currentSelect']
  },
});
const emit = defineEmits(["submit"]);
const theme = useThemeVars();
const keySelect = ref([]);

watchEffect(() => {
  keySelect.value = props.selectItem;
});
const filterButton = ref([]);
const filterOprButton = [
  {
    key: "all",
    label: "全选",
    onCheck: () => (keySelect.value = props.filterItem?.map((v) => v.key)),
    unCheck: () => (keySelect.value = []),
  },
  {
    key: "selectDefault",
    label: "选中默认",
    onCheck: () => (keySelect.value = props.defaultItem),
    unCheck: () => (keySelect.value = props.selectItem),
  },
  {
    key: "currentSelect",
    label: "选中当前列表",
    onCheck: () => (keySelect.value = props.selectItem),
    unCheck: () => (keySelect.value = props.selectItem),
  },
];
watchEffect(() => {
  filterButton.value = filterOprButton.filter((v) =>
    props.filterButtonKey.includes(v.key)
  );
  console.log(props.filterButtonKey);
});

function onSubmit() {
  emit("submit", keySelect.value);
}

const checkKey = ref(
  props.filterItem?.length === props.selectItem?.length ? ["all"] : []
);

function onCheckModel(string, meta) {
  console.log(string);
  console.log(meta);
  if (meta.actionType === "uncheck") {
    filterButton.value?.find((v) => v?.key === meta.value)?.unCheck();
    checkKey.value = [];
  } else {
    filterButton.value?.find((v) => v?.key === meta.value)?.onCheck();
    checkKey.value = [meta.value];
  }
}
</script>

<template>
  <div class="filter-box">
    <NCheckboxGroup v-model:value="keySelect" class="filter-main">
      <NCheckbox
        v-for="item in filterItem"
        :key="item.key"
        :value="item.key"
        class="filter-item"
      >
        <NEllipsis style="max-width: 100px">
          {{ item.title }}
        </NEllipsis>
      </NCheckbox>
    </NCheckboxGroup>
    <div class="filter-footer">
      <NCheckboxGroup
        :type="props.type"
        :value="checkKey"
        @update:value="onCheckModel"
      >
        <NCheckbox
          v-for="item in filterButton"
          :key="item.key"
          :value="item.key"
        >
          {{ item.label }}
        </NCheckbox>
      </NCheckboxGroup>
      <NButton class="submit-btn" :type="props.type" @click="onSubmit">
        保存
      </NButton>
    </div>
  </div>
</template>

<style scoped lang="less">
.filter-box {
  padding: 20px;
  margin: -16px -28px -20px;
  box-sizing: border-box;
}

.filter-main {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  min-height: 500px;
  max-height: 700px;
  overflow-y: auto;
  row-gap: 20px;
  padding: 0 0 15px;
  box-sizing: border-box;

  .filter-item {
    --info-color: v-bind(theme.infoColor);
    --n-border-checked: 1px solid var(--info-color) !important;
    --n-border-focus: 1px solid var(--info-color) !important;
    --n-color-checked: var(--info-color) !important;
    --n-box-shadow-focus: 0 0 0 2px #6a1f7403 !important;
    width: calc(100% / 3);
  }
}

.filter-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .submit-btn {
    width: 80px;
  }
}
</style>
