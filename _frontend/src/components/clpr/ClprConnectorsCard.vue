// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Connectors
    </template>
    <template v-if="slots['channel-filter'] || props.stateFilter" #right-control>
      <div class="filters">
        <slot name="channel-filter"/>
        <SelectView v-if="props.stateFilter" v-model="selectedState" :small="true" data-cy="select-state">
          <option value="">STATES: ALL</option>
          <option v-for="st in Object.values(ClprConnectorState)" :key="st" :value="st">{{ st }}</option>
        </SelectView>
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

import {computed, ref, useSlots} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import SelectView from "@/elements/SelectView.vue";
import {ClprConnectorState, getConnectorState} from "@/components/clpr/ClprEconomics.ts";
import ClprConnectorTable from "@/components/clpr/ClprConnectorTable.vue";
import {getClprMockConnectorRows} from "@/components/clpr/ClprMockData.ts";

// Connectors of one channel. The channel selection, if any, is up to the parent (see channel-filter slot).
const props = defineProps({
  channelId: {
    type: String,
    required: true
  },
  stateFilter: {
    type: Boolean,
    default: false
  }
})

const slots = useSlots()

// Static mockup data, to be replaced by a call to GET /api/v1/clpr/channels/{channelId}/connectors, which returns
// the pending connectors as well as the completed ones
const selectedState = ref<string>("")
const connectors = computed(() => getClprMockConnectorRows(props.channelId)
    .filter(c => selectedState.value === "" || getConnectorState(c) === selectedState.value))

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
