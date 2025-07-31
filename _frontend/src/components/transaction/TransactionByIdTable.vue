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
      row-key="consensus_timestamp"
      @cell-click="handleClick"
  >
    <o-table-column v-slot="props" field="timestamp" label="TIME">
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
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Transaction, TransactionType} from '@/schemas/MirrorNodeSchemas.ts';
import {makeTypeLabel} from "@/utils/TransactionTools";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {TriangleAlert} from "lucide-vue-next";
import {routeManager} from "@/utils/RouteManager.ts";

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
const showRelationship = computed(() => props.transactions.length >= 2 && makeRelationshipLabel(props.transactions[0]))
const showNonce = computed(() => props.transactions.length >= 2 && !props.transactions[1].scheduled)

const handleClick = (t: Transaction, c: unknown, i: number, ci: number, event: Event) => {
  routeManager.routeToTransaction(t, event)
}

const currentPage = ref(1)

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
  if (row.name === TransactionType.SCHEDULECREATE) {
    result = "Schedule Create"
  } else if (row.scheduled) {
    result = "Scheduled"
  } else if (hasChild.value) {
    if (row.nonce !== null && row.nonce > 0 && row.parent_consensus_timestamp) {
      result = "Child"
    } else if (row.nonce !== null && row.nonce === 0) {
      result = "Parent"
    } else {
      result = "n/a"
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
