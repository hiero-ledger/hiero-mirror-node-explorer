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
            <ClprChannelStatusLabel :status="props.row.status"/>
          </o-table-column>

          <o-table-column v-slot="props" field="backlog" label="BACKLOG" position="right">
            <PlainAmount :amount="getChannelBacklog(props.row) ?? undefined"/>
          </o-table-column>

          <template v-slot:bottomLeft>
            <TablePageSize v-model:size="perPage"/>
          </template>
        </o-table>
      </ClprTableFrame>
    </template>
    <template #footer>
      <div class="note">
        <b>Backlog</b> is messages sent from this ledger that the peer has not yet acknowledged. Paused channels come
        first.
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
import ClprChannelStatusLabel from "@/components/clpr/ClprChannelStatusLabel.vue";
import {getChannelBacklog} from "@/components/clpr/ClprHealth.ts";
import {CLPR_MOCK_COMPLETED_CHANNELS} from "@/components/clpr/ClprMockData.ts";
import {ClprChannel, ClprChannelStatus} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {routeManager} from "@/utils/RouteManager.ts";

// Paused channels first, as they are the ones needing attention
const STATUS_ORDER = [
  ClprChannelStatus.PAUSED,
  ClprChannelStatus.ACTIVE,
  ClprChannelStatus.CLOSING,
  ClprChannelStatus.DRAINED,
  ClprChannelStatus.CLOSED
]

// Static mockup data, to be replaced by GET /api/v1/clpr/channels
const channels = CLPR_MOCK_COMPLETED_CHANNELS.slice()
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))

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
