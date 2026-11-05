// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <span :class="['health', healthClass]">{{ props.health }}</span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {ClprChannelHealth} from "@/components/clpr/ClprHealth.ts";

const props = defineProps({
  health: {
    type: String as PropType<ClprChannelHealth>,
    required: true
  }
})

const healthClass = computed(() => {
  switch (props.health) {
    case ClprChannelHealth.HEALTHY:
      return "success"
    case ClprChannelHealth.STALE:
    case ClprChannelHealth.CLOSING:
      return "warn"
    case ClprChannelHealth.PAUSED:
      return "error"
    default:
      return "neutral"
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.health.success {
  color: var(--text-success);
}

span.health.warn {
  color: #d98200;
}

span.health.error {
  color: var(--text-error);
}

span.health.neutral {
  color: var(--text-secondary);
}

</style>
