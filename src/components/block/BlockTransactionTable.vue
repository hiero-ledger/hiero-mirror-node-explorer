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
      <TableHeaderView>CONTENT</TableHeaderView>
      <TableHeaderView>TIME</TableHeaderView>

    </template>

    <template #tableCells="transaction">

      <TableDataView>
        <TransactionLabel
            class="transaction-label"
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

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import {Transaction} from '@/schemas/MirrorNodeSchemas.ts';
import {makeTypeLabel} from "@/utils/TransactionTools";
import {routeManager} from "@/router";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TransactionLabel from "@/components/values/TransactionLabel.vue";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import {AppStorage} from "@/AppStorage";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";
import TableViewV3 from "@/tables/TableViewV3.vue";

const props = defineProps({
  transactions: {
    type: Array as PropType<Array<Transaction>>,
    default: () => []
  }
})

const dataSource = new StaticDataSource(
    computed(() => props.transactions),
    AppStorage.BLOCK_TRANSACTION_TABLE_PAGE_SIZE_KEY,
    (t: Transaction) => t.consensus_timestamp)

const handleClick = (t: Transaction, event: MouseEvent) => {
  routeManager.routeToTransaction(t, event)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.transaction-label {
  font-weight: 600;
}

</style>
