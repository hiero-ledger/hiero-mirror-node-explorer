// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <span v-if="props.value" :title="props.value" class="hex-label">{{ shortened }}</span>
  <span v-else class="h-is-low-contrast">None</span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";

const props = defineProps({
  value: {
    type: String as PropType<string | null>,
    default: null
  }
})

// Long hex ids are abbreviated (0x1a2b3c4d…0000); the full value is available as tooltip
const shortened = computed(() => {
  const v = props.value ?? ""
  return v.length > 14 ? v.slice(0, 10) + "…" + v.slice(-4) : v
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.hex-label {
  font-family: var(--font-family-monospace, monospace);
}

</style>
