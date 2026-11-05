// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <span :class="['h-has-pill', 'clpr-pill', props.level !== 'network' ? 'h-chip-' + props.level : '']">{{ props.label }}</span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";

// Colored pill for status-like indicators. The success, error and default colors are the ones of the
// application pills (h-has-pill); the warn color does not exist there.
// The "network" level is the plain application pill, whose color depends on the selected network
// (as the TYPE of the transaction table).
export type ClprPillLevel = "success" | "warn" | "error" | "default" | "network"

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  level: {
    type: String as PropType<ClprPillLevel>,
    default: "default"
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.clpr-pill {
  display: inline-block;
}

span.clpr-pill.h-chip-warn {
  background-color: #d98200;
  color: #FFFFFF;
}

</style>
