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
          <ClprConnectorStateLabel v-if="props.row.connector" :connector="props.row.connector"/>
          <ClprPill v-else :label="props.row.what" :level="props.row.level"/>
        </o-table-column>

        <o-table-column v-slot="props" field="where" label="WHERE">
          <ClprHexLabel :value="props.row.where"/>
        </o-table-column>

        <o-table-column v-slot="props" field="detail" label="DETAIL">
          <div class="h-should-wrap">{{ props.row.detail }}</div>
        </o-table-column>

        <o-table-column v-slot="props" field="since" label="SINCE">
          <TimestampValue v-if="props.row.since" :timestamp="props.row.since"/>
        </o-table-column>
      </o-table>
      <div v-if="!items.length" class="h-is-secondary-text">Nothing needs attention.</div>
    </template>
    <template #footer>
      <div class="note">
        Computed by the Explorer from the channels, connectors and pending registrations it already shows: paused or
        stale channels, connectors one slash from the ban threshold or below the minimum stake, and registrations
        committed more than a day ago and still pending. The mirror node does not tell since when a connector is in
        its current state.
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
import ClprConnectorStateLabel from "@/components/clpr/ClprConnectorStateLabel.vue";
import ClprPill, {ClprPillLevel} from "@/components/clpr/ClprPill.vue";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";
import {CLPR_ECONOMICS, ClprConnectorState, getConnectorState} from "@/components/clpr/ClprEconomics.ts";
import {
  ClprChannelHealth,
  getChannelBacklog,
  getChannelHealth,
  getChannelWaitingHours
} from "@/components/clpr/ClprHealth.ts";
import {
  CLPR_MOCK_CONNECTORS,
  CLPR_MOCK_NOW_SECONDS,
  getClprMockChannels,
  getClprMockOldestUnackedTimestamp
} from "@/components/clpr/ClprMockData.ts";
import {shortenHex} from "@/components/clpr/ClprUtils.ts";
import {ClprChannelStatus, ClprConnector} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {routeManager} from "@/utils/RouteManager.ts";

interface AttentionItem {
  key: string
  what: string
  level?: ClprPillLevel // color of the "what" pill (not used for connectors, which display their state)
  connector?: ClprConnector // when set, the connector state is displayed instead of "what"
  where: string // hex id displayed in the WHERE column
  channelId?: string // target of a click on the row, if any
  connectorId?: string
  detail: string
  since: string | null // not displayed when unknown
}

const formatHbar = (tinybars: number): string => (tinybars / 100_000_000).toLocaleString() + " ℏ"
const ONE_DAY_SECONDS = 24 * 3600

// Static mockup data, to be replaced by the corresponding API calls (see ClprOverviewStatsCard)
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

  for (const c of getClprMockChannels().filter(c => c.channel_id !== null)) {
    const oldestUnacked = getClprMockOldestUnackedTimestamp(c)
    if (getChannelHealth(c, oldestUnacked, CLPR_MOCK_NOW_SECONDS) === ClprChannelHealth.STALE) {
      const waiting = getChannelWaitingHours(oldestUnacked, CLPR_MOCK_NOW_SECONDS)
      result.push({
        key: "stale-" + c.channel_id,
        what: "Stale",
        level: "warn",
        where: c.channel_id!,
        channelId: c.channel_id!,
        detail: "Backlog of " + getChannelBacklog(c) + ", oldest message unacknowledged for " +
            (waiting !== null ? Math.round(waiting) + " h" : "a long time"),
        since: oldestUnacked
      })
    }
  }

  for (const cn of CLPR_MOCK_CONNECTORS) {
    const state = getConnectorState(cn)
    if (state === ClprConnectorState.NEAR_BAN) {
      result.push({
        key: "near-ban-" + cn.connector_id,
        what: state,
        connector: cn,
        where: cn.connector_id,
        channelId: cn.channel_id,
        connectorId: cn.connector_id,
        detail: cn.slash_count + " of " + CLPR_ECONOMICS.slashBanThreshold + " slashes on channel " + shortenHex(cn.channel_id),
        since: null
      })
    } else if (state === ClprConnectorState.LOW_STAKE) {
      result.push({
        key: "low-stake-" + cn.connector_id,
        what: state,
        connector: cn,
        where: cn.connector_id,
        channelId: cn.channel_id,
        connectorId: cn.connector_id,
        detail: formatHbar(Number(cn.locked_stake)) + " locked, minimum " + formatHbar(CLPR_ECONOMICS.minLockedStake),
        since: null
      })
    }
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

  return result.sort((a, b) => Number(b.since ?? 0) - Number(a.since ?? 0))
}

const items = buildItems()

const handleClick = (item: AttentionItem, c: unknown, i: number, ci: number, event: Event) => {
  if (item.connectorId && item.channelId) {
    routeManager.routeToClprConnector(item.channelId, item.connectorId, event)
  } else if (item.channelId) {
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
