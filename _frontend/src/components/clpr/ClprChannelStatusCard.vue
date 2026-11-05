// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Channel Status
    </template>
    <template #content>
      <ClprTableFrame :row-count="channels.length" :page-size="perPage">
        <o-table
            :data="channels"
            :hoverable="true"
            :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
            paginated
            pagination-order="centered"
            :current-page="currentPage"
            @update:current-page="currentPage = $event as number"
            :per-page="perPage"
            row-key="channel_id"
            @cell-click="handleClick"
        >
          <o-table-column v-slot="props" field="channel_id" label="CHANNEL">
            <ClprHexLabel :value="props.row.channel_id"/>
          </o-table-column>

          <o-table-column v-slot="props" field="chain_id" label="PEER CHAIN">
            <StringValue :string-value="props.row.chain_id"/>
          </o-table-column>

          <o-table-column v-slot="props" field="status" label="STATUS">
            {{ props.row.status }}
          </o-table-column>

          <o-table-column v-slot="props" field="backlog" label="BACKLOG" position="right">
            <PlainAmount :amount="getChannelBacklog(props.row) ?? undefined"/>
          </o-table-column>

          <o-table-column v-slot="props" field="health" label="HEALTH">
            <ClprChannelHealthLabel :health="props.row.health"/>
          </o-table-column>

          <template v-slot:bottomLeft>
            <TablePageSize v-model:size="perPage"/>
          </template>
        </o-table>
      </ClprTableFrame>
    </template>
    <template #footer>
      <div class="note">
        <b>Backlog</b> is messages sent from this ledger that the peer has not yet acknowledged. An active channel
        is flagged <b>stale</b> when the oldest of them has been waiting for more than {{ CLPR_HEALTH.staleAfterHours }}
        hours. Health is an indicator derived by the Explorer, not protocol state.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, ref} from "vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import StringValue from "@/components/values/StringValue.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";
import ClprTableFrame from "@/components/clpr/ClprTableFrame.vue";
import ClprChannelHealthLabel from "@/components/clpr/ClprChannelHealthLabel.vue";
import {CLPR_HEALTH, ClprChannelHealth, getChannelBacklog, getChannelHealth} from "@/components/clpr/ClprHealth.ts";
import {
  CLPR_MOCK_COMPLETED_CHANNELS,
  CLPR_MOCK_NOW_SECONDS,
  getClprMockOldestUnackedTimestamp
} from "@/components/clpr/ClprMockData.ts";
import {ClprChannel} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {routeManager} from "@/utils/RouteManager.ts";

// Needing attention first
const HEALTH_ORDER = [
  ClprChannelHealth.PAUSED,
  ClprChannelHealth.STALE,
  ClprChannelHealth.HEALTHY,
  ClprChannelHealth.CLOSING,
  ClprChannelHealth.DRAINED,
  ClprChannelHealth.CLOSED
]

// Static mockup data, to be replaced by GET /api/v1/clpr/channels
// (and, for the channels with a backlog, GET /api/v1/clpr/channels/{channelId}/messages)
const channels = CLPR_MOCK_COMPLETED_CHANNELS
    .map(c => ({
      ...c,
      health: getChannelHealth(c, getClprMockOldestUnackedTimestamp(c), CLPR_MOCK_NOW_SECONDS)
    }))
    .sort((a, b) => HEALTH_ORDER.indexOf(a.health) - HEALTH_ORDER.indexOf(b.health))

const handleClick = (channel: ClprChannel, c: unknown, i: number, ci: number, event: Event) => {
  if (channel.channel_id !== null) {
    routeManager.routeToClprChannel(channel.channel_id, event)
  }
}

const isMediumScreen = inject('isMediumScreen', true)
const currentPage = ref(1)
const perPage = ref(isMediumScreen ? 15 : 5)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.note {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 8px;
}

</style>
