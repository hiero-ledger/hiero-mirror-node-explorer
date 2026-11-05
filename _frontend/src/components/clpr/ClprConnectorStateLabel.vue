// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ClprPill :label="state" :level="level"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import ClprPill, {ClprPillLevel} from "@/components/clpr/ClprPill.vue";
import {ClprConnector} from "@/schemas/MirrorNodeSchemas.ts";
import {ClprConnectorState, getConnectorState} from "@/components/clpr/ClprEconomics.ts";

const props = defineProps({
  connector: {
    type: Object as PropType<ClprConnector>,
    required: true
  }
})

const state = computed(() => getConnectorState(props.connector))

const level = computed<ClprPillLevel>(() => {
  switch (state.value) {
    case ClprConnectorState.HEALTHY:
      return "success"
    case ClprConnectorState.LOW_STAKE:
      return "warn"
    case ClprConnectorState.NEAR_BAN:
    case ClprConnectorState.BANNED:
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
