// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      v-model:current-page="currentPage"
      :data="props.transactions"
      :hoverable="true"
      :narrowed="props.narrowed"
      :paginated="!isTouchDevice && paginationNeeded"
      pagination-order="centered"
      :per-page="isMediumScreen ? pageSize : 5"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
      customRowKey="transaction_id"
      @cell-click="handleClick"
  >
    <o-table-column v-slot="props" field="transaction_id" label="ID">
      <TransactionLabel
          class="h-is-bold"
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
      <div style="display: flex; gap: 8px; line-height: 18px">
        <TimestampValue class="h-is-bold" v-bind:timestamp="props.row.consensus_timestamp"/>
        <TriangleAlert v-if="props.row.result !== 'SUCCESS'" :size="18" class="h-text-error"/>
      </div>
    </o-table-column>

    <o-table-column v-slot="props" label="RELATIONSHIP">
      {{ props.row.batch_key ? 'Inner' : 'Outer' }}
    </o-table-column>

  </o-table>

  <EmptyTable v-if="!props.transactions.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType, ref} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Transaction} from '@/schemas/MirrorNodeSchemas.ts';
import {makeTypeLabel} from "@/utils/TransactionTools";
import {routeManager} from "@/router";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {TriangleAlert} from "lucide-vue-next";
import TransactionLabel from "@/components/values/TransactionLabel.vue";

const props = defineProps({
  narrowed: Boolean,
  nbItems: Number,
  transactions: {
    type: Array as PropType<Array<Transaction>>,
    default: () => []
  }
})

const isTouchDevice = inject('isTouchDevice', false)
const isMediumScreen = inject('isMediumScreen', true)

const DEFAULT_PAGE_SIZE = 15
const pageSize = props.nbItems ?? DEFAULT_PAGE_SIZE
const paginationNeeded = computed(() => {
      return props.transactions.length > 5
    }
)

const handleClick = (t: Transaction, c: unknown, i: number, ci: number, event: Event) => {
  routeManager.routeToTransaction(t, event)
}

const currentPage = ref(1)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
