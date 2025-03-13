// SPDX-License-Identifier: Apache-2.0


<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableView
      :controller="props.controller"
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

    <template #tableCells="transaction">

      <TableDataView>
        <TransactionLabel
            class="h-is-bold"
            :transaction-id="transaction.transaction_id"
            :result="transaction.result"
        />
      </TableDataView>

      <TableDataView>
        <div class="h-has-pill" style="display: inline-block">
          {{ makeTypeLabel(transaction.name) }}
        </div>
      </TableDataView>

      <TableDataView v-if="showingEthereumTransactions">
        <InnerSenderEVMAddress :transaction-id="transaction.transaction_id"/>
      </TableDataView>

      <TableDataView>
        <TransactionSummary v-bind:transaction="transaction"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="transaction.consensus_timestamp"/>
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {Transaction, TransactionType} from "@/schemas/MirrorNodeSchemas";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TransactionLabel from "@/components/values/TransactionLabel.vue";
import {makeTypeLabel} from "@/utils/TransactionTools";
import {routeManager} from "@/router";
import {TransactionTableControllerXL} from "@/components/transaction/TransactionTableControllerXL";
import InnerSenderEVMAddress from "@/components/values/InnerSenderEVMAddress.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableView from "@/tables/TableView.vue";

const props = defineProps({
  narrowed: Boolean,
  controller: {
    type: Object as PropType<TransactionTableControllerXL>,
    required: true
  }
})

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const showingEthereumTransactions = computed(() => {
  return props.controller.transactionType.value === TransactionType.ETHEREUMTRANSACTION
})

const handleClick = (t: Transaction, event: MouseEvent) => {
  routeManager.routeToTransaction(t, event)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
