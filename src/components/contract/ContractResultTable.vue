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

      <TableHeaderView>TIME</TableHeaderView>
      <TableHeaderView>FROM</TableHeaderView>
      <TableHeaderView>MESSAGE</TableHeaderView>
      <TableHeaderView :align-right="true">TRANSFER AMOUNT</TableHeaderView>

    </template>

    <template #tableCells="result">

      <TableDataView>
        <div style="display: flex; gap: 8px;">
          <TimestampValue class="h-is-bold" :timestamp="result.timestamp"/>
          <TriangleAlert v-if="result.error_message" :size="18" class="h-text-error"/>
        </div>
      </TableDataView>

      <TableDataView>
        <EVMAddress :address="result.from" :compact="!isLargeScreen" :enable-copy="false"/>
      </TableDataView>

      <TableDataView>
        <StringValue :string-value="makeErrorMessage(result)"/>
      </TableDataView>

      <TableDataView>
        <HbarAmount :amount="result.amount"/>
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType} from 'vue';
import {ContractResult} from "@/schemas/MirrorNodeSchemas";
import {ContractResultTableController} from "@/components/contract/ContractResultTableController";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {routeManager} from "@/router";
import StringValue from "@/components/values/StringValue.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {decodeSolidityErrorMessage} from "@/schemas/MirrorNodeUtils.ts";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {TriangleAlert} from 'lucide-vue-next';
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableView from "@/tables/TableView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<ContractResultTableController>,
    required: true
  }
})

const isLargeScreen = inject('isLargeScreen', true)

const handleClick = (result: ContractResult, event: MouseEvent) => {
  routeManager.routeToTransactionByTs(result.timestamp, event)
}

const makeErrorMessage = (result: ContractResult) => {
  return decodeSolidityErrorMessage(result.error_message ?? null)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
