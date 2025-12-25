<script setup lang="tsx">
import { RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import type { CommonQueryProps, CommonQueryEmits, FormOption } from '../../types/components'
import DataForm from '../form/DataForm.vue'
import { getOptions } from '../options/defaultOptions'
import { ObjectToArray } from '../utils/object'
import { computed, onMounted, onUnmounted, ref, getCurrentInstance } from 'vue'
import { NButton, NSpace } from 'naive-ui'
import { registerDirectives } from '../directives/auto-register'

// 自动注册指令
const instance = getCurrentInstance()
if (instance?.appContext?.app) {
  registerDirectives(instance.appContext.app)
}

// 防抖函数
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
const emit = defineEmits<CommonQueryEmits>()

const props = withDefaults(defineProps<CommonQueryProps>(), {
  inlineText: true,
  options: () => [],
  query: () => ({}),
  selectCount: 1,
  type: 'primary',
  noButton: false,
  isRead: false,
  btn: () => ['reset', 'search'],
  size: 'medium',
})

function onBeforeOptions(arr: FormOption[]): FormOption[] {
  return arr.map((v: FormOption) => ({
    ...v,
    props: {
      ...v.props,
      ...((!v.way || v.way === 'input') ? {
        onUpdateValue: (...args: any[]) => {
          ;(v.props as any)?.onUpdateValue?.(...args)
        debouncedSubmit()
      }
      } : {}),
    ...(v?.way === 'select' ? {
        onUpdateValue: (...args: any[]) => {
          ;(v.props as any)?.onUpdateValue?.(...args)
        debouncedSubmit()
      }
      } : {})
  }
  }))
}

// 创建防抖的提交函数（500ms延迟）
const debouncedSubmit = debounce(() => {
  emit('submit')
}, 500)

function onSubmit() {
  // loading.value = true
  debouncedSubmit()
  // loading.value = false
  // return false
}
const loading = ref(false)
const _query = defineModel('query', {
  type: Object,
  default: () => ({}),
})

const defaultFormItemProps = {
  style: {
    width: '33%',
  },
}
const _queryOptionsKey = computed(() =>
  props.options?.map(v => v?.way || 'input'),
)
const defaultOptions = getOptions(_queryOptionsKey.value)

const _queryOptions = computed(() => {
  try {
    const arr: FormOption[] = []
    for (let i = 0; i < (props.options?.length || 0); i++) {
      const v = props.options![i]
      if (v?.enum && !v?.options)
        v.options = ObjectToArray(v.enum)
      if (!v?.props) {
        v.props = {
          size: props.size,
        }
      }

      if (!v?.formItemProps) {
        v.formItemProps = { ...defaultFormItemProps }
      }
      else {
        const formItemProps = typeof v.formItemProps === 'function'
          ? v.formItemProps({}, {})
          : v.formItemProps
        v.formItemProps = {
          ...defaultFormItemProps,
          ...formItemProps,
          style: { ...defaultFormItemProps.style, ...(formItemProps as any)?.style },
        }
      }

      const key = v?.key || (v as any)?.value
      if (!key)
        throw new Error('key no set')
      arr.push({
        ...v,
        key,
      })
    }
    return onBeforeOptions(arr)
  }
  catch (e) {
    console.warn('error', e)
    return []
  }
})

const classComponent = {
  input: '',
  select: '',
  dateRange: 'input-range',
  dateRangeTime: 'input-range-time',
}
const defaultBtnProps = {
  style: {
    borderRadius: '3px',
  },
}
const defaultBtn = {
  search: () => (
    <NButton
      type={props.type}
      loading={loading.value}
      default-props={{ attrType: 'submit' }}
      onClick={() => onSubmit()}
      {...defaultBtnProps}
    >
      {{
        default: () => '搜索',
        icon: () => <SearchOutline />,
      }}
    </NButton>
  ),
  reset: () => (
    <NButton
      type="default"
      onClick={() => {
        clearQuery()
      }}
      {...defaultBtnProps}
    >
      {{
        default: () => '重置',
        icon: () => <RefreshOutline />,
      }}
    </NButton>
  ),
}

function clearQuery(): void {
  props.options?.forEach((v: FormOption) => {
    const key = (v?.key as string) || (v as any)?.value
    if (key) {
      if (v?.queryType) {
        if (!(_query.value as any)[v.queryType]) {
          (_query.value as any)[v.queryType] = {}
        }
        (_query.value as any)[v.queryType][key] = null
      }
      else {
        (_query.value as any)[key] = null
      }
    }
  })
  emit('reset')
}

// 全局监听 Enter 键的方法
function handleGlobalEnter(event: KeyboardEvent): void {
  // 检查是否按下了 Enter 键
  if (event.key === 'Enter') {
    onSubmit()
  }
}

// 组件挂载时添加全局监听
onMounted(() => {
  document.addEventListener('keydown', handleGlobalEnter)
})

// 组件卸载时移除全局监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalEnter)
})
</script>

<template>
  <NSpace
    :wrap-item="false"
    justify="space-between"
    align="center"
    :wrap="false"
  >
    <div class="flex-1">
      <DataForm
        v-model:value="_query"
        :options="_queryOptions"
        :form-props="{ showFeedback: false }"
      />
    </div>
    <NSpace v-if="!props.noButton" align="center" :wrap="false">
      <slot name="left-btn" />
      <template v-for="(itm, idx) in props.btn" :key="idx">
        <component :is="defaultBtn?.[itm]?.()" />
      </template>
      <slot name="right-btn" />
    </NSpace>
  </NSpace>
</template>

<style scoped lang="less">
.select-text {
  min-width: 100px;
  max-width: 240px;
  text-align: center;
}

.select-line-text {
  text-align: center;
  white-space: nowrap;
  display: inline;
}
</style>
