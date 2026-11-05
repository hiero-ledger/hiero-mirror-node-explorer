// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

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
        row-key="ownership_commitment"
        @cell-click="handleClick"
    >
      <o-table-column v-slot="props" field="channel_id" label="CHANNEL ID">
        <ClprHexLabel :value="props.row.channel_id"/>
      </o-table-column>

      <o-table-column v-slot="props" field="chain_id" label="PEER CHAIN">
        <StringValue :string-value="props.row.chain_id"/>
      </o-table-column>

      <o-table-column v-slot="props" field="status" label="STATUS">
        {{ props.row.status }}
      </o-table-column>

      <o-table-column v-slot="props" field="verifier_contract_id" label="VERIFIER">
        <StringValue :string-value="props.row.verifier_contract_id"/>
      </o-table-column>

      <o-table-column v-slot="props" field="backlog" label="BACKLOG" position="right">
        <PlainAmount :amount="makeBacklog(props.row)"/>
      </o-table-column>

      <o-table-column v-slot="props" field="ownership_commitment" label="OWNERSHIP COMMITMENT">
        <ClprHexLabel :value="props.row.ownership_commitment"/>
      </o-table-column>

      <o-table-column v-slot="props" field="created_timestamp" label="CREATED">
        <TimestampValue :timestamp="props.row.created_timestamp"/>
      </o-table-column>

      <template v-slot:bottomLeft>
        <TablePageSize v-model:size="perPage"/>
      </template>
    </o-table>
  </ClprTableFrame>

  <EmptyTable v-if="!channels.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType, ref, watch} from "vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ClprChannel} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {routeManager} from "@/utils/RouteManager.ts";
import ClprTableFrame from "@/components/clpr/ClprTableFrame.vue";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";

const props = defineProps({
  channels: {
    type: Array as PropType<ClprChannel[]>,
    required: true
  }
})

// Pending channels have no channel id yet: there are no details to navigate to
const handleClick = (channel: ClprChannel, c: unknown, i: number, ci: number, event: Event) => {
  if (channel.channel_id !== null) {
    routeManager.routeToClprChannel(channel.channel_id, event)
  }
}

const isMediumScreen = inject('isMediumScreen', true)
const currentPage = ref(1)
const perPage = ref(isMediumScreen ? 15 : 5)

// Back to the first page whenever the list changes (status selection)
watch(() => props.channels, () => currentPage.value = 1)

// Messages sent by this ledger and not yet acknowledged by the peer. Not applicable to pending channels.
const makeBacklog = (channel: ClprChannel): number | undefined =>
    channel.next_message_id !== null && channel.acked_message_id !== null
        ? channel.next_message_id - 1 - channel.acked_message_id
        : undefined

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
