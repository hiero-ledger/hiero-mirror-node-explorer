// SPDX-License-Identifier: Apache-2.0


<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      v-model:current-page="currentPage"
      :data="transactions"
      :hoverable="true"
      :narrowed="narrowed"
      :paginated="paginated"
      pagination-order="centered"
      :per-page="perPage"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      customRowKey="consensus_timestamp"
      @cell-click="handleClick"
  >
    <o-table-column v-slot="props" field="transaction_id" label="ID">
      <TransactionLabel
          class="transaction-label"
          :transaction-id="props.row.transaction_id"
          :result="props.row.result"
      />
    </o-table-column>

    <o-table-column v-slot="props" field="name" label="TYPE">
      <div class="h-has-pill" style="display: inline-block">
        {{ makeTypeLabel(props.row.name) }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" label="CONTENT">
      <TransactionSummary v-bind:transaction="props.row"/>
    </o-table-column>

    <o-table-column v-slot="props" field="consensus_timestamp" label="TIME">
      <TimestampValue v-bind:timestamp="props.row.consensus_timestamp"/>
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

  <EmptyTable v-if="!transactions.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, ref} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Transaction} from '@/schemas/MirrorNodeSchemas.ts';
import {makeTypeLabel} from "@/utils/TransactionTools";
import {routeManager} from "@/router";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TransactionLabel from "@/components/values/TransactionLabel.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";

const props = defineProps({
  narrowed: Boolean,
  nbItems: Number,
  transactions: {
    type: Array as PropType<Array<Transaction>>,
    default: () => []
  },
  accountId: String
},)

const DEFAULT_PAGE_SIZE = 15
const perPage = ref(props.nbItems ?? DEFAULT_PAGE_SIZE)

const handleClick = (t: Transaction, c: unknown, i: number, ci: number, event: Event) => {
  routeManager.routeToTransaction(t, event)
}

const currentPage = ref(1)

const paginated = computed(() => props.transactions.length > perPage.value)
const showPageSizeSelector = computed(() => props.transactions.length > 5)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.transaction-label {
  font-weight: 600;
}

</style>
