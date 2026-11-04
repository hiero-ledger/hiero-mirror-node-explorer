// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Connectors
    </template>
    <template v-if="slots['channel-filter']" #right-control>
      <div class="filters">
        <slot name="channel-filter"/>
      </div>
    </template>
    <template #content>
      <ClprConnectorTable :connectors="connectors"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, useSlots} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ClprConnectorTable from "@/components/clpr/ClprConnectorTable.vue";
import {getClprMockConnectors} from "@/components/clpr/ClprMockData.ts";

// Connectors of one channel. The channel selection, if any, is up to the parent (see channel-filter slot).
const props = defineProps({
  channelId: {
    type: String,
    required: true
  }
})

const slots = useSlots()

// Static mockup data, to be replaced by a call to GET /api/v1/clpr/channels/{channelId}/connectors
const connectors = computed(() => getClprMockConnectors(props.channelId))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.filters {
  align-items: center;
  display: flex;
  gap: 8px;
}

</style>
