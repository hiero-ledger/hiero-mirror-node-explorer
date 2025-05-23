// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <o-table
      :data="transactions"
      :loading="loading"
      paginated
      backend-pagination
      pagination-order="centered"
      :total="total"
      v-model:current-page="currentPage"
      :per-page="perPage"
      @page-change="onPageChange"
      @cell-click="handleClick"
      :hoverable="true"
      :narrowed="narrowed"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
      customRowKey="consensus_timestamp"
  >
    <o-table-column v-slot="props" field="timestamp" label="ID">
      <TransactionLabel
          :transaction-id="props.row.transaction_id"
          :result="props.row.result"
      />
    </o-table-column>

    <o-table-column v-slot="props" field="type" label="TYPE">
      <div class="h-has-pill" style="display: inline-block">
        {{ makeTypeLabel(props.row.type) }}
      </div>
    </o-table-column>

    <o-table-column v-if="showingEthereumTransactions" v-slot="props" field="sender" label="SENDER">
      <InnerSenderEVMAddress :transaction-id="props.row.transaction_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="content" label="CONTENT">
      <NftTransactionSummary :transaction="props.row"/>
    </o-table-column>

    <o-table-column v-slot="props" field="consensus_timestamp" label="TIME">
      <TimestampValue :timestamp="props.row.consensus_timestamp"/>
    </o-table-column>
  </o-table>

  <EmptyTable v-if="transactions.length === 0"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {computed, PropType,} from "vue"
import {NftTransactionTransfer, TransactionType,} from "@/schemas/MirrorNodeSchemas"
import NftTransactionSummary from "@/components/transaction/NftTransactionSummary.vue"
import TimestampValue from "@/components/values/TimestampValue.vue"
import TransactionLabel from "@/components/values/TransactionLabel.vue"
import {makeTypeLabel} from "@/utils/TransactionTools"
import {routeManager} from "@/router"
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue"
import InnerSenderEVMAddress from "@/components/values/InnerSenderEVMAddress.vue"
import {NftTransactionTableController} from "./NftTransactionTableController"

const props = defineProps({
  narrowed: Boolean,
  controller: {
    type: Object as PropType<NftTransactionTableController>,
    required: true,
  },
})

const showingEthereumTransactions = computed(() => {
  return (
      props.controller.transactionType.value ===
      TransactionType.ETHEREUMTRANSACTION
  )
})

const handleClick = (t: NftTransactionTransfer, c: unknown, i: number, ci: number, event: Event,) => {
  routeManager.routeToTransactionByTs(t.consensus_timestamp, event)
}

const transactions = computed(() => {
  return props.controller.rows.value.filter(el =>
      !props.controller.transactionType.value || el.type === props.controller.transactionType.value
  )
})

const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize

</script>
