// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>


  <TableViewV3
      :data-source="dataSource"
      :clickable="true"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>ID</TableHeaderView>
      <TableHeaderView>CONTRACT NAME</TableHeaderView>
      <TableHeaderView>CREATED</TableHeaderView>

    </template>

    <template #tableCells="contract">


      <TableDataView>
        <ContractIOL class="entity-id" :contract-id="contract.contract_id"/>
      </TableDataView>

      <TableDataView>
        <ContractName :contract-id="contract.contract_id ?? '?'"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="contract.created_timestamp"/>
      </TableDataView>

    </template>

    <template #noDataMessage>{{ noDataMessage }}</template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import {Contract} from "@/schemas/MirrorNodeSchemas";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {routeManager} from "@/router";
import ContractName from "@/components/values/ContractName.vue";
import {VerifiedContractsController} from "@/components/contract/VerifiedContractsController";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<VerifiedContractsController>,
    required: true
  },
  loaded: Boolean,
  overflow: Boolean
})

const contracts = computed(() => props.controller.loaded.value ? props.controller.contracts.value : null)

const dataSource = new StaticDataSource(
    contracts,
    props.controller.storageKey,
    (contract: Contract) => contract.contract_id ?? "null")


const noDataMessage = computed(() =>
    props.overflow
        ? 'No verified contract found in the last ' + props.controller.capacity + ' created contracts'
        : 'No data'
)

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const handleClick = (contract: Contract, c: unknown, i: number, ci: number, event: MouseEvent) => {
  routeManager.routeToContract(contract.contract_id!, event)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.entity-id {
  font-weight: 600;
}

</style>
