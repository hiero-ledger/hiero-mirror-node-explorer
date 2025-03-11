// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TableView
      :controller="props.controller"
      :clickable="true"
      :page-size-storage-key="AppStorage.BLOCK_TABLE_PAGE_SIZE_KEY"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>NUMBER</TableHeaderView>
      <TableHeaderView>START TIME</TableHeaderView>
      <TableHeaderView>NO. TRANSACTIONS</TableHeaderView>
      <TableHeaderView>GAS USED</TableHeaderView>

    </template>

    <template #tableCells="block">

      <TableDataView>
        <p class="block_number">{{ block.number }}</p>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="block.timestamp?.from"/>
      </TableDataView>

      <TableDataView>
        <PlainAmount v-bind:amount="block.count"/>
      </TableDataView>

      <TableDataView>
        <PlainAmount v-bind:amount="block.gas_used"/>
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {Block} from '@/schemas/MirrorNodeSchemas.ts';
import {routeManager} from "@/router";
import TimestampValue from "@/components/values/TimestampValue.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import {BlockTableController} from "@/components/block/BlockTableController";
import {AppStorage} from "@/AppStorage";
import TableView from "@/tables/TableView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<BlockTableController>,
    required: true
  }
})

const handleClick = (block: Block, c: unknown, i: number, ci: number, event: MouseEvent) => {
  if (block.number) {
    routeManager.routeToBlock(block.number, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

p.block_number {
  font-weight: 600;
}

</style>
