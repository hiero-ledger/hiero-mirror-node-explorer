// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :current-page="currentPage"
      @update:current-page="currentPage = $event as number"
      :data="transactions"
      :hoverable="true"
      :loading="loading"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      :narrowed="true"
      :paginated="paginated"
      pagination-order="centered"
      :per-page="perPage"
      :striped="false"

      :total="total"
      backend-pagination
      row-key="consensus_timestamp"
      default-sort="consensus_timestamp"
      @page-change="onPageChange"
      @cell-click="handleClick"
  >

    <o-table-column v-slot="props" field="contract_id" label="ID">
      <div class="entity-id">
        {{ props.row.entity_id }}
      </div>
    </o-table-column>

    <o-table-column v-if="enableVerification" v-slot="props" field="contract_name" label="CONTRACT NAME">
      <ContractName :contract-id="props.row.entity_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="created" label="CREATED">
      <TimestampValue v-bind:timestamp="props.row.consensus_timestamp"/>
    </o-table-column>

    <template v-slot:bottomLeft>
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

  <EmptyTable v-if="!transactions.length" :loading="loading"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import ContractName from "@/components/values/ContractName.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TransactionTableController>,
    required: true
  }
})

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const handleClick = (t: Transaction, _c: unknown, _i: number, _ci: number, event: Event) => {
  routeManager.routeToContract(t.entity_id!, event)
}

const transactions = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize
const paginated = props.controller.paginated
const showPageSizeSelector = props.controller.showPageSizeSelector
const enableVerification = routeManager.enableVerification

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.entity-id {
  font-weight: 600;
}

</style>
