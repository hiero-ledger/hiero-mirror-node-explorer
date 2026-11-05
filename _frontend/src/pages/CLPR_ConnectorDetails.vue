// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <NotificationBanner v-if="notification" :message="notification"/>

  <template v-if="connector">
    <div class="connector-header">
      <h2 class="connector-title">
        Connector {{ shortenHex(connector.connector_id) }}
      </h2>
      <ClprConnectorStateLabel class="connector-status" :connector="connector"/>
    </div>
    <Tabs
        :selected-tab="selectedTab"
        :tab-ids="tabIds"
        :tab-labels="tabLabels"
        :sub-tabs="true"
        @update:selected-tab="selectedTab = $event"
    />
  </template>

  <template v-if="connector">
    <ClprConnectorSummary v-if="selectedTab === 'summary'" :connector="connector"/>
    <ClprMessagesCard
        v-else-if="selectedTab === 'messages'"
        :channel-id="connector.channel_id"
        :connector-id="connector.connector_id"
    />
    <DashboardCardV2 v-else>
      <template #title>
        {{ tabLabels[tabIds.indexOf(selectedTab ?? '')] }}
      </template>
      <template #content>
        <span class="h-is-secondary-text">Coming soon</span>
      </template>
    </DashboardCardV2>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ref} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Tabs from "@/components/Tabs.vue";
import ClprMessagesCard from "@/components/clpr/ClprMessagesCard.vue";
import ClprConnectorStateLabel from "@/components/clpr/ClprConnectorStateLabel.vue";
import ClprConnectorSummary from "@/components/clpr/ClprConnectorSummary.vue";
import {getClprMockConnector} from "@/components/clpr/ClprMockData.ts";
import {shortenHex} from "@/components/clpr/ClprUtils.ts";

const props = defineProps({
  channelId: {
    type: String,
    required: true
  },
  connectorId: {
    type: String,
    required: true
  },
  network: String
})

// Static mockup data, to be replaced by a call to
// GET /api/v1/clpr/channels/{channelId}/connectors?connector.id=eq:{connectorId}
const connector = computed(() => getClprMockConnector(props.channelId, props.connectorId))
const notification = computed(() =>
    connector.value === null ? "CLPR connector " + props.connectorId + " not found in channel " + props.channelId : null)

// No History sub-tab: the API only gives the state of a connector as of a given time, not its history
const tabIds = ['summary', 'messages']
const tabLabels = ['Summary', 'Messages']
const selectedTab = ref<string | null>(tabIds[0])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.connector-header {
  align-items: baseline;
  display: flex;
  gap: 12px;
  margin: 8px 0 12px 0;
}

h2.connector-title {
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.connector-status {
  font-size: 12px;
}

</style>
