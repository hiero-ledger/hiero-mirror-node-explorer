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
      <TableHeaderView>MEMO</TableHeaderView>

    </template>

    <template #tableCells="contract">

      <TableDataView>
        <ContractIOL class="contract_id" :contract-id="contract.contract_id"/>
      </TableDataView>

      <TableDataView>
        <ContractName :contract-id="contract.contract_id ?? ''"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="contract.created_timestamp"/>
      </TableDataView>

      <TableDataView>
        <div class="h-should-wrap">
          <BlobValue v-bind:blob-value="contract.memo" v-bind:base64="true" v-bind:show-none="true"/>
        </div>
      </TableDataView>

    </template>

  </TableViewV3>

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
import {ContractTableController} from "@/components/contract/ContractTableController";
import ContractName from "@/components/values/ContractName.vue";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

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

const dataSource = new DynamicDataSource(props.controller)

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const handleClick = (contract: Contract, event: MouseEvent) => {
  if (contract.contract_id) {
    routeManager.routeToContract(contract.contract_id, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.contract_id {
  font-weight: 600;
}

</style>
