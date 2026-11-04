// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="connectors"
      :hoverable="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      paginated
      pagination-order="centered"
      :current-page="currentPage"
      @update:current-page="currentPage = $event as number"
      :per-page="perPage"
      row-key="connector_id"
  >
    <o-table-column v-slot="props" field="connector_id" label="CONNECTOR ID">
      <ClprHexLabel :value="props.row.connector_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="connector_contract_id" label="CONTRACT">
      <AccountLink :account-id="props.row.connector_contract_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="locked_stake" label="LOCKED STAKE" position="right">
      <HbarAmount :amount="Number(props.row.locked_stake)" :decimals="2"/>
    </o-table-column>

    <o-table-column v-slot="props" field="in_flight_message_count" label="IN-FLIGHT" position="right">
      <PlainAmount :amount="props.row.in_flight_message_count"/>
    </o-table-column>

    <o-table-column v-slot="props" field="slash_count" label="SLASHES" position="right">
      <PlainAmount :amount="props.row.slash_count"/>
    </o-table-column>

    <o-table-column v-slot="props" field="deleted" label="STATUS">
      {{ props.row.deleted ? "Deleted" : "Active" }}
    </o-table-column>

    <o-table-column v-slot="props" field="created_timestamp" label="CREATED">
      <TimestampValue :timestamp="props.row.created_timestamp"/>
    </o-table-column>

    <template v-slot:bottomLeft>
      <TablePageSize v-model:size="perPage"/>
    </template>
  </o-table>

  <EmptyTable v-if="!connectors.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType, ref, watch} from "vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ClprConnector} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";

const props = defineProps({
  connectors: {
    type: Array as PropType<ClprConnector[]>,
    required: true
  }
})

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
