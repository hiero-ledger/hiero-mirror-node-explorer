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
            title="Paused channels"
            :value="pausedChannelCount.toLocaleString()"
        />
        <NetworkDashboardItemV2
            title="Outbound backlog"
            :value="totalBacklog.toLocaleString()"
            extra="messages not yet acknowledged"
        />
        <NetworkDashboardItemV2
            title="Pending channels"
            :value="pendingChannelCount.toLocaleString()"
            extra="registered, not completed"
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
import {CLPR_MOCK_COMPLETED_CHANNELS, getClprMockChannels} from "@/components/clpr/ClprMockData.ts";
import {getChannelBacklog} from "@/components/clpr/ClprHealth.ts";
import {ClprChannelStatus} from "@/schemas/MirrorNodeSchemas.ts";

// Static mockup data, to be replaced by GET /api/v1/clpr/channels (completed channels), and with
// status=eq:PENDING for the pending ones. Only channel-level data: nothing is queried per channel.
const channels = CLPR_MOCK_COMPLETED_CHANNELS
const pendingChannelCount = getClprMockChannels(ClprChannelStatus.PENDING).length

const activeChannelCount = computed(() => channels.filter(c => c.status === ClprChannelStatus.ACTIVE).length)
const pausedChannelCount = computed(() => channels.filter(c => c.status === ClprChannelStatus.PAUSED).length)
const totalBacklog = computed(() => channels.reduce((sum, c) => sum + (getChannelBacklog(c) ?? 0), 0))

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
