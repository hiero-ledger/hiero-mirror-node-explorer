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
      <TableHeaderView>CREATE</TableHeaderView>

    </template>

    <template #tableCells="transaction">

      <TableDataView>
        <div class="entity-id">
          {{ transaction.entity_id }}
        </div>
      </TableDataView>

      <TableDataView>
        <ContractName :contract-id="transaction.entity_id ?? ''"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="transaction.consensus_timestamp"/>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, PropType} from 'vue';
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {routeManager} from "@/router";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import ContractName from "@/components/values/ContractName.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TransactionTableController>,
    required: true
  }
})

const dataSource = new DynamicDataSource(props.controller)

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const handleClick = (t: Transaction, event: MouseEvent) => {
  routeManager.routeToContract(t.entity_id!, event)
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
