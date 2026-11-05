// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Summary
    </template>
    <template #content>
      <div class="clpr-dashboard">
        <NetworkDashboardItemV2
            title="Channels"
            :value="activeChannelCount + ' / ' + channels.length"
            extra="active / total"
        />
        <NetworkDashboardItemV2
            title="Paused or stale"
            :value="(pausedChannelCount + staleChannelCount).toLocaleString()"
            :extra="pausedChannelCount + ' paused · ' + staleChannelCount + ' stale'"
        />
        <NetworkDashboardItemV2
            title="Outbound backlog"
            :value="totalBacklog.toLocaleString()"
            extra="messages not yet acknowledged"
        />
        <NetworkDashboardItemV2
            title="Connectors at risk"
            :value="riskyConnectorCount.toLocaleString()"
            :extra="'of ' + connectors.length + ' registered'"
        />
        <NetworkDashboardItemV2
            title="Pending registrations"
            :value="(pendingChannelCount + pendingConnectors.length).toLocaleString()"
            :extra="pendingChannelCount + ' channels · ' + pendingConnectors.length + ' connectors'"
        />
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NetworkDashboardItemV2 from "@/components/node/NetworkDashboardItemV2.vue";
import {ClprChannelHealth, getChannelHealth} from "@/components/clpr/ClprHealth.ts";
import {ClprConnectorState, getConnectorState} from "@/components/clpr/ClprEconomics.ts";
import {
  CLPR_MOCK_COMPLETED_CHANNELS,
  CLPR_MOCK_CONNECTORS,
  CLPR_MOCK_NOW_SECONDS,
  CLPR_MOCK_PENDING_CONNECTORS,
  getClprMockChannels,
  getClprMockOldestUnackedTimestamp
} from "@/components/clpr/ClprMockData.ts";
import {ClprChannelStatus} from "@/schemas/MirrorNodeSchemas.ts";

// Static mockup data, to be replaced by GET /api/v1/clpr/channels (completed and PENDING channels),
// GET /api/v1/clpr/channels/{channelId}/connectors (one call per channel) and GET /api/v1/clpr/connectors/pending
const channels = CLPR_MOCK_COMPLETED_CHANNELS
const connectors = CLPR_MOCK_CONNECTORS
const pendingConnectors = CLPR_MOCK_PENDING_CONNECTORS
const pendingChannelCount = getClprMockChannels(ClprChannelStatus.PENDING).length

const activeChannelCount = computed(() => channels.filter(c => c.status === ClprChannelStatus.ACTIVE).length)
const healths = channels.map(c => getChannelHealth(c, getClprMockOldestUnackedTimestamp(c), CLPR_MOCK_NOW_SECONDS))
const pausedChannelCount = computed(() => healths.filter(h => h === ClprChannelHealth.PAUSED).length)
const staleChannelCount = computed(() => healths.filter(h => h === ClprChannelHealth.STALE).length)
const totalBacklog = computed(() => channels.reduce(
    (sum, c) => sum + (c.next_message_id !== null && c.acked_message_id !== null ? c.next_message_id - 1 - c.acked_message_id : 0), 0))

const AT_RISK_STATES = [ClprConnectorState.NEAR_BAN, ClprConnectorState.BANNED, ClprConnectorState.LOW_STAKE]
const riskyConnectorCount = computed(() => connectors.filter(c => AT_RISK_STATES.includes(getConnectorState(c))).length)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.clpr-dashboard {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 768px) {
  div.clpr-dashboard {
    grid-template-columns: repeat(5, 1fr);
  }
}

</style>
