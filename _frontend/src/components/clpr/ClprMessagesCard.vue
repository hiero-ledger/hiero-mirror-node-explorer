// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Messages
    </template>
    <template v-if="hasFilters" #right-control>
      <div class="filters">
        <slot name="channel-filter"/>
        <SelectView v-if="!props.connectorId" v-model="selectedConnectorId" :small="true" data-cy="select-connector">
          <option value="">CONNECTORS: ALL</option>
          <option v-for="c in connectors" :key="c.connector_id" :value="c.connector_id">
            {{ shortenHex(c.connector_id) }}
          </option>
        </SelectView>
        <SelectView v-if="!props.connectorId" v-model="selectedType" :small="true" data-cy="select-type">
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

import {computed, PropType, ref, useSlots, watch} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import SelectView from "@/elements/SelectView.vue";
import {shortenHex} from "@/components/clpr/ClprUtils.ts";
import ClprMessageTable from "@/components/clpr/ClprMessageTable.vue";
import {getClprMockConnectors, getClprMockMessages} from "@/components/clpr/ClprMockData.ts";
import {ClprMessageType} from "@/schemas/MirrorNodeSchemas.ts";

// Messages of one channel, with connector and type filters.
// The channel selection, if any, is up to the parent (see channel-filter slot).
// When a connector is imposed by the context (connectorId), neither the connector selector nor the type selector
// are displayed: only DATA messages are associated with a connector, so the type filter would be pointless.
const props = defineProps({
  channelId: {
    type: String,
    required: true
  },
  connectorId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const slots = useSlots()
const hasFilters = computed(() => !props.connectorId || !!slots['channel-filter'])

const selectedConnectorId = ref<string>("")
// Only the completed connectors can be filtered on: pending ones have no connector id yet
const connectors = computed(() => getClprMockConnectors(props.channelId))
// Connectors belong to a channel: the connector filter is reset whenever the channel changes
watch(() => props.channelId, () => selectedConnectorId.value = "")

const selectedType = ref<string>("")
const messages = computed(() => getClprMockMessages(
    props.channelId,
    selectedType.value === "" ? null : selectedType.value as ClprMessageType,
    props.connectorId ?? (selectedConnectorId.value === "" ? null : selectedConnectorId.value)))

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
