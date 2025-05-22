// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="contracts"
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
      :narrowed="props.narrowed"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
      customRowKey="contract_id"
  >
    <o-table-column v-slot="props" field="contract_id" label="ID">
      <ContractIOL class="contract_id" :contract-id="props.row.contract_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="contract_name" label="CONTRACT NAME">
      <ContractName :contract-id="props.row.contract_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="created" label="CREATED">
      <TimestampValue v-bind:timestamp="props.row.created_timestamp"/>
    </o-table-column>

    <o-table-column v-slot="props" field="memo" label="MEMO">
      <div class="h-should-wrap">
        <BlobValue v-bind:blob-value="props.row.memo" v-bind:base64="true" v-bind:show-none="true"/>
      </div>
    </o-table-column>

    <template v-slot:bottom-left>
      <TablePageSize
          v-model:size="perPage"
      />
    </template>
  </o-table>

  <EmptyTable v-if="!contracts.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, PropType} from 'vue';
import {Contract} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import BlobValue from "@/components/values/BlobValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {ContractTableController} from "@/components/contract/ContractTableController";
import ContractName from "@/components/values/ContractName.vue";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {AppStorage} from "@/AppStorage";

const props = defineProps({
  controller: {
    type: Object as PropType<ContractTableController>,
    required: true
  },
  narrowed: {
    type: Boolean,
    default: false
  }
})

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const handleClick = (contract: Contract, c: unknown, i: number, ci: number, event: Event) => {
  if (contract.contract_id) {
    routeManager.routeToContract(contract.contract_id, event)
  }
}

const contracts = props.controller.rows
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

.contract_id {
  font-weight: 600;
}

</style>
