// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ClprPill :label="props.health" :level="level"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import ClprPill, {ClprPillLevel} from "@/components/clpr/ClprPill.vue";
import {ClprChannelHealth} from "@/components/clpr/ClprHealth.ts";

const props = defineProps({
  health: {
    type: String as PropType<ClprChannelHealth>,
    required: true
  }
})

const level = computed<ClprPillLevel>(() => {
  switch (props.health) {
    case ClprChannelHealth.HEALTHY:
      return "success"
    case ClprChannelHealth.STALE:
    case ClprChannelHealth.CLOSING:
      return "warn"
    case ClprChannelHealth.PAUSED:
      return "error"
    default:
      return "default"
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
