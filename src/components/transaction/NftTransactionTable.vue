// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
      :clickable="true"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>ID</TableHeaderView>
      <TableHeaderView>TYPE</TableHeaderView>
      <TableHeaderView v-if="showingEthereumTransactions">SENDER</TableHeaderView>
      <TableHeaderView>CONTENT</TableHeaderView>
      <TableHeaderView>TIME</TableHeaderView>

    </template>

    <template #tableCells="transactionTransfer">

      <TableDataView>
        <!-- Original logic does not compile because transactionTransfer has no "result" field -->
        <!--
        <TransactionLabel
            :transaction-id="transaction.transaction_id"
            :result="transactionTransfer.result"
        -->
        <TransactionLabel
            :transaction-id="transactionTransfer.transaction_id"
            result="SUCCESS"
        />
      </TableDataView>

      <TableDataView>
        <div class="h-has-pill" style="display: inline-block">
          {{ makeTypeLabel(transactionTransfer.type) }}
        </div>
      </TableDataView>

      <TableDataView v-if="showingEthereumTransactions">
        <InnerSenderEVMAddress :transaction-id="transactionTransfer.transaction_id"/>
      </TableDataView>

      <TableDataView>
        <NftTransactionSummary :transaction="transactionTransfer"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue :timestamp="transactionTransfer.consensus_timestamp"/>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {computed, PropType,} from "vue"
import {Transaction, TransactionType,} from "@/schemas/MirrorNodeSchemas"
import NftTransactionSummary from "@/components/transaction/NftTransactionSummary.vue"
import TimestampValue from "@/components/values/TimestampValue.vue"
import TransactionLabel from "@/components/values/TransactionLabel.vue"
import {makeTypeLabel} from "@/utils/TransactionTools"
import {routeManager} from "@/router"
import InnerSenderEVMAddress from "@/components/values/InnerSenderEVMAddress.vue"
import {NftTransactionTableController} from "./NftTransactionTableController"
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<NftTransactionTableController>,
    required: true,
  },
})

const dataSource = new DynamicDataSource(props.controller)

const showingEthereumTransactions = computed(() => {
  return (
      props.controller.transactionType.value ===
      TransactionType.ETHEREUMTRANSACTION
  )
})

const handleClick = (t: Transaction, event: MouseEvent,) => {
  routeManager.routeToTransaction(t, event)
}

</script>
