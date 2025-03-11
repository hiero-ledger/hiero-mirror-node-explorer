// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TableView :controller="props.controller"
             :clickable="true" @cell-click="handleClick"
             :page-size-storage-key="props.controller.storageKey">

    <template #tableHeaders>

      <TableHeaderView>ID</TableHeaderView>
      <TableHeaderView>TYPE</TableHeaderView>
      <TableHeaderView>CONTENT</TableHeaderView>
      <TableHeaderView>TIME</TableHeaderView>

    </template>

    <template #tableCells="transaction">

      <!-- Bof -->
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

import {PropType} from "vue";
import TableView from "@/tables/TableView.vue";
import {TransactionTableControllerXL} from "@/components/transaction/TransactionTableControllerXL.ts";
import TransactionLabel from "@/components/values/TransactionLabel.vue";
import {makeTypeLabel} from "@/utils/TransactionTools.ts";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import {routeManager} from "@/router.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TransactionTableControllerXL>,
    required: true
  }
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
