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
      :range-before="1"
      :range-after="1"
      :per-page="isMediumScreen ? pageSize : 5"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
      customRowKey="consensus_timestamp"
      @cell-click="handleClick"
  >
    <o-table-column v-if="isBatch" v-slot="props" field="transaction_id" label="ID">
      <TransactionLabel
          class="h-is-bold"
          :transaction-id="props.row.transaction_id"
          :result="props.row.result"
      />
    </o-table-column>

    <o-table-column v-if="!isBatch" v-slot="props" field="timestamp" label="TIME">
      <div style="display: flex; gap: 8px; line-height: 18px">
        <TimestampValue class="h-is-bold" v-bind:timestamp="props.row.consensus_timestamp"/>
        <TriangleAlert v-if="props.row.result !== 'SUCCESS'" :size="18" class="h-text-error"/>
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="name" label="TYPE">
      <div class="h-has-pill" style="display: inline-block">
        {{ makeTypeLabel(props.row.name) }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" label="CONTENT">
      <TransactionSummary v-bind:transaction="props.row"/>
    </o-table-column>

    <o-table-column v-if="isBatch" v-slot="props" field="consensus_timestamp" label="TIME">
      <div style="display: flex; gap: 8px; line-height: 18px">
        <TimestampValue class="h-is-bold" v-bind:timestamp="props.row.consensus_timestamp"/>
        <TriangleAlert v-if="props.row.result !== 'SUCCESS'" :size="18" class="h-text-error"/>
      </div>
    </o-table-column>

    <o-table-column v-if="showRelationship" v-slot="props" label="RELATIONSHIP">
      {{ makeRelationshipLabel(props.row) }}
    </o-table-column>

    <o-table-column v-if="showNonce" v-slot="props" label="NONCE">
      {{ props.row.nonce }}
    </o-table-column>

  </o-table>

  <EmptyTable v-if="!props.transactions.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType, ref} from 'vue';
import {Transaction, TransactionType} from '@/schemas/MirrorNodeSchemas.ts';
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
const showRelationship = computed(() => props.transactions.length > 1 && makeRelationshipLabel(props.transactions[0]))
const showNonce = computed(() =>
    !isBatch.value && props.transactions.length >= 2 && !props.transactions[1].scheduled
)

const handleClick = (t: Transaction, c: unknown, i: number, ci: number, event: MouseEvent) => {
  routeManager.routeToTransaction(t, event)
}

const currentPage = ref(1)

const isBatch = computed(() => {
  let result = false
  for (const tx of props.transactions) {
    if (tx.name === TransactionType.ATOMICBATCH) {
      result = true
      break
    }
  }
  return result
})

const hasChild = computed(() => {
  let result = false
  for (const tx of props.transactions) {
    if (tx.parent_consensus_timestamp) {
      result = true
      break
    }
  }
  return result
})

const makeRelationshipLabel = (row: Transaction): string => {
  let result: string
  if (row.name === TransactionType.ATOMICBATCH) {
    result = "Batch (outer)"
  } else if (row.batch_key) {
    result = "Inner"
  } else if (row.name === TransactionType.SCHEDULECREATE) {
    result = "Schedule Create"
  } else if (row.scheduled) {
    result = "Scheduled"
  } else if (hasChild.value) {
    if (row.nonce && row.nonce > 0) {
      result = "Child"
    } else {
      result = "Parent"
    }
  } else {
    result = ""
  }
  return result
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
