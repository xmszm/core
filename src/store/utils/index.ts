import { computed, ref, unref } from 'vue'

export function useStoreUtils(e) {
  const value = ref(e)
  return [value, computed(() => unref(value)), v => (value.value = v)]
}
