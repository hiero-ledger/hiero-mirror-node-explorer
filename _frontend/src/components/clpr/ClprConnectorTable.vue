// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ClprTableFrame :row-count="connectors.length" :page-size="perPage">
    <o-table
        :data="connectors"
        :hoverable="true"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
        paginated
        pagination-order="centered"
        :current-page="currentPage"
        @update:current-page="currentPage = $event as number"
        :per-page="perPage"
        row-key="commitment"
        :row-class="(row: ClprConnectorRow) => clprRowClass(row.connector_id !== null)"
        @cell-click="handleClick"
    >
      <o-table-column v-slot="props" field="connector_id" label="CONNECTOR ID">
        <ClprHexLabel :value="props.row.connector_id"/>
      </o-table-column>

      <o-table-column v-slot="props" field="connector_contract_id" label="CONTRACT">
        <StringValue :string-value="props.row.connector_contract_id"/>
      </o-table-column>

      <o-table-column v-slot="props" field="locked_stake" label="LOCKED STAKE" position="right">
        <template v-if="!isPending(props.row)">
          <HbarAmount :amount="Number(props.row.locked_stake)" :decimals="2"/>
          <span class="h-is-secondary-text"> / {{ minStakeLabel }} min</span>
          <ClprBar
              :value="Number(props.row.locked_stake)"
              :max="CLPR_ECONOMICS.minLockedStake * 2"
              :level="Number(props.row.locked_stake) < CLPR_ECONOMICS.minLockedStake ? 'bad' : ''"
          />
        </template>
      </o-table-column>

      <o-table-column v-slot="props" field="in_flight_message_count" label="IN-FLIGHT" position="right">
        <template v-if="!isPending(props.row)">
          <PlainAmount :amount="props.row.in_flight_message_count"/>
          <span class="h-is-secondary-text"> / {{ quota.toLocaleString() }}</span>
          <ClprBar :value="props.row.in_flight_message_count" :max="quota" level="info"/>
        </template>
      </o-table-column>

      <o-table-column v-slot="props" field="slash_count" label="SLASHES" position="right">
        <template v-if="!isPending(props.row)">
          <PlainAmount :amount="props.row.slash_count"/>
          <span class="h-is-secondary-text"> / {{ CLPR_ECONOMICS.slashBanThreshold }}</span>
          <ClprBar
              :value="props.row.slash_count"
              :max="CLPR_ECONOMICS.slashBanThreshold"
              :level="props.row.slash_count >= CLPR_ECONOMICS.slashBanThreshold - 1 ? 'bad' : props.row.slash_count ? 'warn' : ''"
          />
        </template>
      </o-table-column>

      <o-table-column v-slot="props" field="state" label="STATE">
        <ClprConnectorStateLabel :connector="props.row"/>
      </o-table-column>

      <o-table-column v-slot="props" field="commitment" label="COMMITMENT">
        <ClprHexLabel :value="props.row.commitment"/>
      </o-table-column>

      <o-table-column v-slot="props" field="created_timestamp" label="CREATED">
        <TimestampValue :timestamp="props.row.created_timestamp"/>
      </o-table-column>

      <template v-slot:bottomLeft>
        <TablePageSize v-model:size="perPage"/>
      </template>
    </o-table>
  </ClprTableFrame>

  <EmptyTable v-if="!connectors.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType, ref, watch} from "vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ClprConnectorRow, ClprConnectorStatus} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import StringValue from "@/components/values/StringValue.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {clprRowClass} from "@/components/clpr/ClprUtils.ts";
import ClprTableFrame from "@/components/clpr/ClprTableFrame.vue";
import ClprBar from "@/components/clpr/ClprBar.vue";
import ClprConnectorStateLabel from "@/components/clpr/ClprConnectorStateLabel.vue";
import {CLPR_ECONOMICS, getConnectorQuota} from "@/components/clpr/ClprEconomics.ts";
import {CLPR_MOCK_LEDGER_CONFIGURATION} from "@/components/clpr/ClprMockData.ts";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";

const props = defineProps({
  connectors: {
    type: Array as PropType<ClprConnectorRow[]>,
    required: true
  }
})

// A pending connector has no connector id yet: there are no details to navigate to
const handleClick = (connector: ClprConnectorRow, c: unknown, i: number, ci: number, event: Event) => {
  if (connector.connector_id !== null) {
    routeManager.routeToClprConnector(connector.channel_id, connector.connector_id, event)
  }
}

// The limits only make sense for completed connectors
const isPending = (connector: ClprConnectorRow): boolean => connector.status === ClprConnectorStatus.PENDING

// The quota is a share of the max queue depth of the ledger configuration
// (mock for now, to be replaced by GET /api/v1/clpr/configuration)
const quota = getConnectorQuota(CLPR_MOCK_LEDGER_CONFIGURATION.throttles.max_queue_depth ?? 0)
const minStakeLabel = (CLPR_ECONOMICS.minLockedStake / 100_000_000).toLocaleString() + " ℏ"

const isMediumScreen = inject('isMediumScreen', true)
const currentPage = ref(1)
const perPage = ref(isMediumScreen ? 15 : 5)

// Back to the first page whenever the list changes (channel selection)
watch(() => props.connectors, () => currentPage.value = 1)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
