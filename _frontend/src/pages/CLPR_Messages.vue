// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Messages
    </template>
    <template #right-control>
      <div class="filters">
        <span class="filter-label">CHANNEL:</span>
        <SelectView v-model="selectedChannelId" :small="true" data-cy="select-channel">
          <option v-for="c in CLPR_MOCK_COMPLETED_CHANNELS" :key="c.channel_id!" :value="c.channel_id!">
            {{ makeChannelLabel(c) }}
          </option>
        </SelectView>
        <SelectView v-model="selectedConnectorId" :small="true" data-cy="select-connector">
          <option value="">CONNECTORS: ALL</option>
          <option v-for="c in connectors" :key="c.connector_id" :value="c.connector_id">
            {{ shortenHex(c.connector_id) }}
          </option>
        </SelectView>
        <SelectView v-model="selectedType" :small="true" data-cy="select-type">
          <option value="">TYPES: ALL</option>
          <option v-for="t in Object.values(ClprMessageType)" :key="t" :value="t">{{ t }}</option>
        </SelectView>
      </div>
    </template>
    <template #content>
      <ClprMessageTable :messages="messages"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ref, watch} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import SelectView from "@/elements/SelectView.vue";
import {shortenHex} from "@/components/clpr/ClprUtils.ts";
import ClprMessageTable from "@/components/clpr/ClprMessageTable.vue";
import {
  CLPR_MOCK_COMPLETED_CHANNELS,
  getClprMockConnectors,
  getClprMockMessages
} from "@/components/clpr/ClprMockData.ts";
import {ClprChannel, ClprMessageType} from "@/schemas/MirrorNodeSchemas.ts";

defineProps({
  network: String
})

const selectedChannelId = ref<string>(CLPR_MOCK_COMPLETED_CHANNELS[0].channel_id!)
const selectedConnectorId = ref<string>("")
const connectors = computed(() => getClprMockConnectors(selectedChannelId.value))
// Connectors belong to a channel: the connector filter is reset whenever the channel changes
watch(selectedChannelId, () => selectedConnectorId.value = "")

const selectedType = ref<string>("")
const messages = computed(() => getClprMockMessages(
    selectedChannelId.value,
    selectedType.value === "" ? null : selectedType.value as ClprMessageType,
    selectedConnectorId.value === "" ? null : selectedConnectorId.value))

const makeChannelLabel = (c: ClprChannel): string => c.chain_id + " · " + shortenHex(c.channel_id!)

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

span.filter-label {
  color: var(--text-secondary);
  font-size: 10px;
}

</style>
