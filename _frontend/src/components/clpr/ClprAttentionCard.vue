// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Needs Attention
    </template>
    <template v-if="items.length" #right-control>
      <span class="h-is-secondary-text">{{ items.length }} items</span>
    </template>
    <template #content>
      <o-table
          :data="items"
          :hoverable="true"
          :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
          :paginated="false"
          :striped="false"
          row-key="key"
          @cell-click="handleClick"
      >
        <o-table-column v-slot="props" field="what" label="WHAT">
          <ClprPill :label="props.row.what" :level="props.row.level"/>
        </o-table-column>

        <o-table-column v-slot="props" field="where" label="WHERE">
          <ClprHexLabel :value="props.row.where"/>
        </o-table-column>

        <o-table-column v-slot="props" field="detail" label="DETAIL">
          <div class="h-should-wrap">{{ props.row.detail }}</div>
        </o-table-column>

        <o-table-column v-slot="props" field="since" label="SINCE">
          <TimestampValue :timestamp="props.row.since"/>
        </o-table-column>
      </o-table>
      <div v-if="!items.length" class="h-is-secondary-text">Nothing needs attention.</div>
    </template>
    <template #footer>
      <div class="note">
        Computed by the Explorer from the channels and pending registrations it already shows: paused channels, and
        channel registrations committed more than a day ago and still pending. Nothing is queried channel by channel,
        so connector states, pending connectors and stale channels are not part of this list.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import ClprPill, {ClprPillLevel} from "@/components/clpr/ClprPill.vue";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";
import {CLPR_MOCK_NOW_SECONDS, getClprMockChannels} from "@/components/clpr/ClprMockData.ts";
import {ClprChannelStatus} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {routeManager} from "@/utils/RouteManager.ts";

interface AttentionItem {
  key: string
  what: string
  level: ClprPillLevel // color of the "what" pill
  where: string // hex id displayed in the WHERE column
  channelId?: string // target of a click on the row, if any
  detail: string
  since: string
}

const ONE_DAY_SECONDS = 24 * 3600

// Static mockup data, to be replaced by GET /api/v1/clpr/channels?status=eq:PAUSED and ?status=eq:PENDING
const buildItems = (): AttentionItem[] => {
  const result: AttentionItem[] = []

  for (const c of getClprMockChannels(ClprChannelStatus.PAUSED)) {
    result.push({
      key: "paused-" + c.channel_id,
      what: "Paused",
      level: "error",
      where: c.channel_id!,
      channelId: c.channel_id!,
      detail: "Channel is paused on " + c.chain_id,
      since: c.timestamp?.from ?? c.created_timestamp
    })
  }

  const dayAgo = CLPR_MOCK_NOW_SECONDS - ONE_DAY_SECONDS
  for (const p of getClprMockChannels(ClprChannelStatus.PENDING)) {
    if (Number(p.created_timestamp) < dayAgo) {
      result.push({
        key: "pending-" + p.ownership_commitment,
        what: "Pending",
        level: "default",
        where: p.ownership_commitment,
        detail: "Channel registration committed but not completed",
        since: p.created_timestamp
      })
    }
  }

  return result.sort((a, b) => Number(b.since) - Number(a.since))
}

const items = buildItems()

// Pending registrations have no details to route to
const handleClick = (item: AttentionItem, c: unknown, i: number, ci: number, event: Event) => {
  if (item.channelId) {
    routeManager.routeToClprChannel(item.channelId, event)
  }
}

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
