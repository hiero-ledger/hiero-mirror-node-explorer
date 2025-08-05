// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="contracts"
      :hoverable="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      :narrowed="true"
      :paginated="contracts.length > perPage"
      pagination-order="centered"

      :per-page="perPage"
      :striped="true"

      row-key="contract_id"
      @cell-click="handleClick"
  >

    <o-table-column v-slot="props" field="contract_id" label="ID">
      <ContractIOL class="entity-id" :contract-id="props.row.contract_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="contract_name" label="CONTRACT NAME">
      <ContractName :contract-id="props.row.contract_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="created" label="CREATED">
      <TimestampValue v-bind:timestamp="props.row.created_timestamp"/>
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

  <EmptyTable v-if="!contracts.length" :loading="!loaded" :no-data-message="noDataMessage"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Contract} from "@/schemas/MirrorNodeSchemas";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import ContractName from "@/components/values/ContractName.vue";
import {VerifiedContractsController} from "@/components/contract/VerifiedContractsController";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<VerifiedContractsController>,
    required: true
  },
  loaded: Boolean,
  overflow: Boolean
})

const noDataMessage = computed(() =>
    props.overflow
        ? 'No verified contract found in the last ' + props.controller.capacity + ' created contracts'
        : 'No data'
)

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const handleClick = (contract: Contract, c: unknown, i: number, ci: number, event: Event) => {
  routeManager.routeToContract(contract.contract_id!, event)
}

const contracts = props.controller.contracts
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
