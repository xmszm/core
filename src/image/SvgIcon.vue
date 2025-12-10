<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
})
const iconName = computed(() => `#svg-${props.name}`)
</script>

<template>
  <svg class="svg-icon" v-bind="$attrs" :style="{ color }" aria-hidden>
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<style scoped>
.svg-icon {
  width: inherit;
  height: inherit;
  fill: currentColor;
  vertical-align: middle;
}
</style>
