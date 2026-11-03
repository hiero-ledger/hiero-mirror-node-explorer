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
import {shortenHex} from "@/components/clpr/ClprUtils.ts";

const props = defineProps({
  value: {
    type: String as PropType<string | null>,
    default: null
  }
})

const shortened = computed(() => shortenHex(props.value ?? ""))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.hex-label {
  font-family: var(--font-family-monospace, monospace);
}

</style>
