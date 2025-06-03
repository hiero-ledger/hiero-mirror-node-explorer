// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      v-model:current-page="currentPage"
      :data="results"
      :hoverable="true"
      :loading="loading"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      :narrowed="true"
      :paginated="paginated"
      pagination-order="centered"
      :per-page="perPage"
      :striped="true"

      :total="total"
      backend-pagination
      row-key="consensus_timestamp"
      default-sort="consensus_timestamp"
      @cell-click="handleClick"
      @page-change="onPageChange">

    <o-table-column v-slot="props" field="timestamp" label="TIME">
      <div style="display: flex; gap: 8px;">
        <TimestampValue class="h-is-bold" :timestamp="props.row.timestamp"/>
        <TriangleAlert v-if="props.row.error_message" :size="18" class="h-text-error"/>
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="from" label="FROM">
      <EVMAddress :address="props.row.from" :compact="!isLargeScreen" :enable-copy="false"/>
    </o-table-column>

    <o-table-column v-slot="props" field="message" label="MESSAGE" position="left">
      <StringValue :string-value="makeErrorMessage(props.row)"/>
    </o-table-column>

    <o-table-column v-slot="props" field="amount" label="TRANSFER AMOUNT" position="right">
      <HbarAmount :amount="props.row.amount"/>
    </o-table-column>

    <template v-slot:bottom-left>
      <TablePageSize
          v-model:size="perPage"
      />
    </template>

  </o-table>

  <TablePageSize
      v-if="!paginated && showPageSizeSelector"
      v-model:size="perPage"
      style="width: 116px; margin-left: 4px"
  />

  <EmptyTable v-if="!results.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ContractResult} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {ContractResultTableController} from "@/components/contract/ContractResultTableController";
import TimestampValue from "@/components/values/TimestampValue.vue";
import EmptyTable from "@/components/EmptyTable.vue";
import StringValue from "@/components/values/StringValue.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {decodeSolidityErrorMessage} from "@/schemas/MirrorNodeUtils.ts";
import HbarAmount from "@/components/values/HbarAmount.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {TriangleAlert} from 'lucide-vue-next';
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<ContractResultTableController>,
    required: true
  }
})

const isLargeScreen = inject('isLargeScreen', true)

const handleClick = (result: ContractResult, c: unknown, i: number, ci: number, event: Event) => {
  routeManager.routeToTransactionByTs(result.timestamp, event)
}

const makeErrorMessage = (result: ContractResult) => {
  return decodeSolidityErrorMessage(result.error_message ?? null)
}

const results = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize
const paginated = props.controller.paginated
const showPageSizeSelector = props.controller.showPageSizeSelector

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
