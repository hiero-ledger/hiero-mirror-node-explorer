// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
      :clickable="true"
      :pagination-disabled="isTouchDevice"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>TIME</TableHeaderView>
      <TableHeaderView>TYPE</TableHeaderView>
      <TableHeaderView>CONTENT</TableHeaderView>
      <TableHeaderView v-if="showRelationship">RELATIONSHIP</TableHeaderView>
      <TableHeaderView v-if="showNonce" :align-right="true">NONCE</TableHeaderView>

    </template>

    <template #tableCells="transaction">

      <TableDataView>
        <div style="display: flex; gap: 8px; line-height: 18px">
          <TimestampValue class="h-is-bold" v-bind:timestamp="transaction.consensus_timestamp"/>
          <TriangleAlert v-if="transaction.result !== 'SUCCESS'" :size="18" class="h-text-error"/>
        </div>
      </TableDataView>

      <TableDataView>
        <div class="h-has-pill" style="display: inline-block">
          {{ makeTypeLabel(transaction.name) }}
        </div>
      </TableDataView>

      <TableDataView>
        <TransactionSummary v-bind:transaction="transaction"/>
      </TableDataView>

      <TableDataView v-if="showRelationship">
        {{ makeRelationshipLabel(transaction) }}
      </TableDataView>

      <TableDataView v-if="showNonce">
        <div class="w400">
          {{ transaction.nonce }}
        </div>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType} from 'vue';
import {Transaction, TransactionType} from '@/schemas/MirrorNodeSchemas.ts';
import {makeTypeLabel} from "@/utils/TransactionTools";
import {routeManager} from "@/router";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import {TriangleAlert} from "lucide-vue-next";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";

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

const DEFAULT_PAGE_SIZE = isMediumScreen ? 15 : 5

const showRelationship = computed(() => props.transactions.length >= 1 && makeRelationshipLabel(props.transactions[0]))
const showNonce = computed(() => props.transactions.length >= 2 && !props.transactions[1].scheduled)

const dataSource = new StaticDataSource(
    computed(() => props.transactions),
    null,
    (t: Transaction) => t.consensus_timestamp,
    DEFAULT_PAGE_SIZE)

const handleClick = (t: Transaction, event: MouseEvent) => {
  routeManager.routeToTransaction(t, event)
}

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
