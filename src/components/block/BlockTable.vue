// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="blocks"
      :loading="loading"
      paginated
      backend-pagination
      pagination-order="centered"
      :range-before="1"
      :range-after="1"
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
      customRowKey="number"
  >
    <o-table-column v-slot="props" field="number" label="NUMBER">
      <p class="block_number">{{ props.row.number }}</p>
    </o-table-column>

    <o-table-column v-slot="props" field="timestamp" label="START TIME">
      <TimestampValue v-bind:timestamp="props.row.timestamp.from"/>
    </o-table-column>

    <o-table-column v-slot="props" field="count" label="NO. TRANSACTIONS" position="right">
      <PlainAmount v-bind:amount="props.row.count"/>
    </o-table-column>

    <o-table-column v-slot="props" field="gas_used" label="GAS USED" position="right">
      <PlainAmount v-bind:amount="props.row.gas_used"/>
    </o-table-column>

    <template v-slot:bottom-left>
      <TablePageSize
          v-model:size="perPage"
          :storage-key="AppStorage.BLOCK_TABLE_PAGE_SIZE_KEY"
      />
    </template>
  </o-table>

  <EmptyTable v-if="!blocks.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {Block} from '@/schemas/MirrorNodeSchemas.ts';
import {routeManager} from "@/router";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import {BlockTableController} from "@/components/block/BlockTableController";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {AppStorage} from "@/AppStorage";

const props = defineProps({
  controller: {
    type: Object as PropType<BlockTableController>,
    required: true
  },
  narrowed: {
    type: Boolean,
    default: false
  }
})

const handleClick = (block: Block, c: unknown, i: number, ci: number, event: MouseEvent) => {
  if (block.number) {
    routeManager.routeToBlock(block.number, event)
  }
}

const blocks = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

p.block_number {
  font-weight: 600;
}

</style>
