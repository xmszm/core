<script setup lang="jsx">
import { RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { DataForm } from 'core'
import { getOptions } from 'core/options/defaultOptions.jsx'
import { ObjectToArray } from 'core/utils/object.js'
import { computed, onMounted, onUnmounted, ref, getCurrentInstance } from 'vue'
import { registerDirectives } from '../directives/auto-register'

// 自动注册指令
const instance = getCurrentInstance()
if (instance?.appContext?.app) {
  registerDirectives(instance.appContext.app)
}

// 防抖函数
function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
const emit = defineEmits(['update:query', 'submit', 'reset'])

const props = defineProps({
  inlineText: {
    type: Boolean,
    default: () => true,
  },
  options: {
    type: Array,
    default: () => [],
  },
  query: {
    type: Object,
    default: () => ({}),
  },
  selectCount: {
    type: Number,
    default: () => 1,
  },
  type: {
    type: String,
    default: () => 'primary',
  },
  noButton: {
    type: Boolean,
    default: () => false,
  },
  isRead: {
    type: Boolean,
    default: () => false,
  },
  btn: {
    type: Array,
    default: () => ['reset', 'search'],
  },
  size: {
    type: String,
    default: () => 'medium',
  },

})

function onBeforeOptions(arr){
  return arr.map(v=>({
    ...v,
    props:{
      ...v.props,
    ...((!v.way ||v.way==='input')? {
      onUpdateValue: (...v) => {
        v.props?.onUpdateValue?.(...v)
        debouncedSubmit()
      }
    }: {}),
    ...(v?.way === 'select' ? {
      onUpdateValue: (...v) => {
        v.props?.onUpdateValue?.(...v)
        debouncedSubmit()
      }
    }: {})
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
    const arr = []
    for (let i = 0; i < props.options.length; i++) {
      const v = props.options[i]
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
        v.formItemProps = {
          ...defaultFormItemProps,
          ...v.formItemProps,
          style: { ...defaultFormItemProps.style, ...v.formItemProps.style },
        }
      }

      const key = v?.key || v?.value
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

function clearQuery() {
  props.options.forEach((v) => {
    const key = v?.key || v?.value
    if (key) {
      if (v?.queryType)
        _query.value[v.queryType][key] = null
      else _query.value[key] = null
    }
  })
  emit('reset')
}

// 全局监听 Enter 键的方法
function handleGlobalEnter(event) {
  // 检查是否按下了 Enter 键
  if (event.key === 'Enter') {
    // 检查是否在输入框、选择框等表单元素中
    // const target = event.target
    // const isFormElement = target.tagName === 'INPUT' || 
    //                      target.tagName === 'SELECT' || 
    //                      target.tagName === 'TEXTAREA' ||
    //                      target.contentEditable === 'true'
    
    // if (isFormElement) {
    //   // 阻止默认行为（如换行）
    //   event.preventDefault()
    //   // 触发搜索
     
    // }
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
  <n-space
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
    <n-space v-if="!props.noButton" align="center" :wrap="false">
      <slot name="left-btn" />
      <template v-for="(itm, idx) in props.btn" :key="idx">
        <component :is="defaultBtn?.[itm]?.()" />
      </template>
      <slot name="right-btn" />
    </n-space>
  </n-space>
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
