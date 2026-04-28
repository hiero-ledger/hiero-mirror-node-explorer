// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="records"
      :loading="loading"
      :paginated="paginated"
      backend-pagination
      pagination-order="centered"
      :total="total"
      :current-page="currentPage"
      :per-page="perPage"
      @page-change="onPageChange"
      @cell-click="handleClick"

      :hoverable="true"
      :narrowed="true"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      row-key="matchId"
  >

    <o-table-column v-slot="props" field="contract_id" label="ID">
      <AddressResolver :evm-address="props.row.address">
        <template #default="{ contractId }">
          <ContractIOL class="entity-id" :contract-id="contractId"/>
        </template>
      </AddressResolver>
    </o-table-column>

    <o-table-column v-slot="props" field="contract_name" label="CONTRACT NAME">
      <AddressResolver :evm-address="props.row.address">
        <template #default="{ contractId }">
          <ContractName :contract-id="contractId"/>
        </template>
      </AddressResolver>
    </o-table-column>

    <o-table-column v-slot="props" field="created" label="CREATED">
      <VerifiedContractDate :verified-date="props.row.verifiedAt"/>
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

  <EmptyTable v-if="!records.length" :loading="loading" no-data-message="No data"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints.ts";
import {routeManager} from "@/utils/RouteManager.ts";
import EmptyTable from "@/components/EmptyTable.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import AddressResolver from "@/components/contract/verified/AddressResolver.vue";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import ContractName from "@/components/values/ContractName.vue";
import {VerifiedContractTableController} from "@/components/contract/verified/VerifiedContractTableController.ts";
import {SourcifyStatusRecord} from "@/utils/cache/SourcifyCache.ts";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import VerifiedContractDate from "@/components/contract/verified/VerifiedContractDate.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<VerifiedContractTableController>,
    required: true
  },
})

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const handleClick = async (record: SourcifyStatusRecord, c: unknown, i: number, ci: number, event: Event) => {
  const contract = await ContractByAddressCache.instance.lookup(record.address)
  if (contract?.contract_id) {
    await routeManager.routeToContract(contract.contract_id, event)
  }
}

const records = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.moveToPage
const perPage = props.controller.pageSize
const paginated = props.controller.paginated
const showPageSizeSelector = props.controller.showPageSizeSelector

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.entity-id {
  font-weight: 600;
}

</style>
