// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <span :class="['state', stateClass]">{{ state }}</span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {ClprConnector} from "@/schemas/MirrorNodeSchemas.ts";
import {ClprConnectorState, getConnectorState} from "@/components/clpr/ClprEconomics.ts";

const props = defineProps({
  connector: {
    type: Object as PropType<ClprConnector>,
    required: true
  }
})

const state = computed(() => getConnectorState(props.connector))

const stateClass = computed(() => {
  switch (state.value) {
    case ClprConnectorState.HEALTHY:
      return "success"
    case ClprConnectorState.LOW_STAKE:
      return "warn"
    case ClprConnectorState.NEAR_BAN:
    case ClprConnectorState.BANNED:
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

span.state.success {
  color: var(--text-success);
}

span.state.warn {
  color: #d98200;
}

span.state.error {
  color: var(--text-error);
}

span.state.neutral {
  color: var(--text-secondary);
}

</style>
