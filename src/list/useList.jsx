import { computed, ref, unref, watch } from 'vue'

export function useList(source = [], filterOptions = []) {
  const loading = ref(false)
  const data = ref([])
  const sourceList = computed(() => unref(source))

  const model = ref({
    andQuery: {},
    likeQuery: {},
  })

  function onSearch() {
    loading.value = true
    console.log(unref(model))

    data.value = handleFilterOption(
      handleFilterValue(unref(filterOptions), unref(model)),
      unref(source),
    )
    console.log(data.value)

    loading.value = false
  }

  function initData() {
    data.value = sourceList.value
  }

  watch(
    () => sourceList.value.length,
    () => {
      initData()
      console.log('data')
    },
    {
      once: true,
    },
  )

  return {
    loading,
    data,
    model,
    initData,
    onSearch,
    onClear: () => {
      model.value = {}
      onSearch()
    },
  }
}

export const matchMethod = {
  andQuery: (data, value) =>
    Array.isArray(value) ? value.includes(data) : data === value,
  likeQuery: (data, value) => data?.indexOf(value) > -1,
}

export function handleFilterValue(runOptions, model) {
  console.log('handleFilterValue', runOptions)

  return runOptions
    .map((v) => {
      const filedValue = v?.key || v?.value
      const value = v?.queryType
        ? model?.[v?.queryType]?.[filedValue]
        : model?.[filedValue]
      return typeof value === 'number' || value
        ? {
            ...v,
            key: filedValue,
            type: v?.queryType,
            value,
          }
        : undefined
    })
    .filter(v => v)
}

export function handleFilterOption(runOption, options) {
  console.log('runOption', runOption)

  if (runOption.length) {
    return options?.filter(item =>
      runOption.length === 1
        ? matchMethod?.[runOption?.[0].type](
          item?.[runOption?.[0]?.key],
          runOption?.[0]?.value,
        )
        : runOption?.every(v =>
          matchMethod?.[v.type](item?.[v.key], v.value),
        ),
    )
  }
  else {
    return options
  }
}
