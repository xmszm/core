import { computed, ref, unref, watch, type Ref, type ComputedRef } from 'vue'
import type { FormOption } from '../../types/components'

interface QueryModel {
  andQuery?: Record<string, any>
  likeQuery?: Record<string, any>
  [key: string]: any
}

interface FilterOption extends FormOption {
  queryType?: string
  value?: any
  type?: string
}

interface UseListReturn {
  loading: Ref<boolean>
  data: Ref<any[]>
  model: Ref<QueryModel>
  initData: () => void
  onSearch: () => void
  onClear: () => void
}

export function useList(
  source: any[] = [],
  filterOptions: FormOption[] = [],
): UseListReturn {
  const loading = ref(false)
  const data = ref<any[]>([])
  const sourceList = computed(() => unref(source))

  const model = ref<QueryModel>({
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
  andQuery: (data: any, value: any): boolean =>
    Array.isArray(value) ? value.includes(data) : data === value,
  likeQuery: (data: string | undefined, value: string): boolean =>
    data?.indexOf(value) > -1 || false,
}

export function handleFilterValue(
  runOptions: FormOption[],
  model: QueryModel,
): FilterOption[] {
  console.log('handleFilterValue', runOptions)

  return runOptions
    .map((v) => {
      const filedValue = (v?.key as string) || (v as any)?.value
      const value = v?.queryType
        ? model?.[v?.queryType]?.[filedValue]
        : model?.[filedValue]
      return typeof value === 'number' || value
        ? {
            ...v,
            key: filedValue,
            type: v?.queryType,
            value,
          } as FilterOption
        : undefined
    })
    .filter((v): v is FilterOption => v !== undefined)
}

export function handleFilterOption(
  runOption: FilterOption[],
  options: any[],
): any[] {
  console.log('runOption', runOption)

  if (runOption.length) {
    return options?.filter(item =>
      runOption.length === 1
        ? matchMethod?.[runOption?.[0].type as keyof typeof matchMethod]?.(
          item?.[runOption?.[0]?.key as string],
          runOption?.[0]?.value,
        )
        : runOption?.every(v =>
          matchMethod?.[v.type as keyof typeof matchMethod]?.(
            item?.[v.key as string],
            v.value,
          ),
        ),
    )
  }
  else {
    return options
  }
}
