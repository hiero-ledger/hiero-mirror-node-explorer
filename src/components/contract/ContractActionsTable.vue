// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->


<template>

  <TableViewV3
      id="contractActionsTable"
      :data-source="dataSource"
  >

    <template #tableHeaders>

      <TableHeaderView>CALL TYPE</TableHeaderView>
      <TableHeaderView>FROM</TableHeaderView>
      <TableHeaderView>AMOUNT</TableHeaderView>
      <TableHeaderView>TO</TableHeaderView>
      <TableHeaderView :align-right="true">GAS LIMIT</TableHeaderView>

    </template>

    <template #tableCells="actionWithPath">

      <TableDataView>
        <div class="call-type">
          {{ actionWithPath.depthPath }}
          <span v-if="isSuccessful(actionWithPath.action)" class="h-has-pill h-chip-success">
            {{ makeOperationType(actionWithPath.action) }}
          </span>
          <span v-else class="h-has-pill h-chip-error">
            {{ '! ' + makeOperationType(actionWithPath.action) }}
          </span>
        </div>
      </TableDataView>

      <TableDataView>
        <EVMAddress :address="actionWithPath.action.from"
                    :id="actionWithPath.action.caller"
                    :entity-type="actionWithPath.action.caller_type"
                    compact/>
      </TableDataView>

      <TableDataView>
        <div class="hbar-amount h-is-numeric">
          <span style="font-size: 13px; margin-right: 2px">&#8594;</span>
          <HbarAmount :amount="actionWithPath.action.value" :timestamp="actionWithPath.action.timestamp" :show-extra="true"/>
          <span style="font-size: 13px; margin-left: 2px; margin-right: 2px">&#8594;</span>
        </div>
      </TableDataView>

      <TableDataView >
        <EVMAddress :address="actionWithPath.action.to"
                    :id="actionWithPath.action.recipient??''"
                    :entity-type="actionWithPath.action.recipient_type"
                    compact/>
      </TableDataView>

      <TableDataView>
        <div class="h-is-numeric">
          {{ actionWithPath.action.gas }}
        </div>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import {ContractAction} from "@/schemas/MirrorNodeSchemas";
import HbarAmount from "@/components/values/HbarAmount.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractActionWithPath} from "@/components/contract/ContractActionsLoader";
import {FunctionCallAnalyzer} from "@/utils/analyzer/FunctionCallAnalyzer";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";

const NB_ACTIONS_PER_PAGE = 10

const props = defineProps({
  actions: Array as PropType<Array<ContractActionWithPath> | undefined>,
  analyzer: {
    type: Object as PropType<FunctionCallAnalyzer>,
    required: true
  }
})

const dataSource = new StaticDataSource(
    computed(() => props.actions ?? []),
    null,
    (a: ContractActionWithPath) => a.action.timestamp ?? "?",
    NB_ACTIONS_PER_PAGE)

const isSuccessful = (action: ContractAction) => action.result_data_type == "OUTPUT"

const makeOperationType = (action: ContractAction) => action.call_operation_type ?? action.call_type

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.hbar-amount {
  align-content: end;
  align-items: end;
  display: flex;
}

div.call-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

</style>
