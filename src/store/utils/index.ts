import { computed, ref, unref, type ComputedRef, type Ref } from 'vue'

export function useStoreUtils<T = any>(
  e: T,
): [Ref<T>, ComputedRef<T>, (v: T) => void] {
  const value = ref(e)
  return [value, computed(() => unref(value)), (v: T) => (value.value = v)]
}
