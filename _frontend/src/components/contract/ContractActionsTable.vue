// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->


<template>

  <div id="contractActionsTable">
    <o-table
        :data="props.actions ?? []"
        :paginated="isPaginated"
        pagination-order="centered"
        :per-page="NB_ACTIONS_PER_PAGE"

        :detailed="isMediumScreen"
        custom-detail-row
        v-model:detailed-rows="expandedActions"

        :hoverable="false"
        :narrowed="true"
        :striped="false"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

    >

      <o-table-column v-slot="props" field="call_type" label="CALL TYPE">
        <div class="call-type">
          {{ props.row.depthPath }}
          <span v-if="isSuccessful(props.row.action)" class="h-has-pill h-chip-success">
            {{ makeOperationType(props.row.action) }}
          </span>
          <span v-else class="h-has-pill h-chip-error">
            {{ '! ' + makeOperationType(props.row.action) }}
          </span>
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="from" label="FROM">
        <EVMAddress :address="props.row.action.from"
                    :id="props.row.action.caller"
                    :entity-type="props.row.action.caller_type"
                    compact/>
      </o-table-column>

      <o-table-column v-slot="props" field="amount" label="AMOUNT">
        <div class="hbar-amount h-is-numeric">
          <span style="font-size: 13px; margin-right: 2px">&#8594;</span>
          <HbarAmount :amount="props.row.action.value" :timestamp="props.row.action.timestamp" :show-extra="true"/>
          <span style="font-size: 13px; margin-left: 2px; margin-right: 2px">&#8594;</span>
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="to" label="TO">
        <EthPrecompileAddress v-if="props.row.action.call_type === 'PRECOMPILE'"
            :evm-address="props.row.action.to"
            :show-none="false"/>
        <EVMAddress v-else
            :address="props.row.action.to"
            :id="props.row.action.recipient??''"
            :entity-type="props.row.action.recipient_type"
            compact/>
      </o-table-column>

      <o-table-column v-slot="props" field="gas_limit" label="GAS LIMIT">
        <div class="h-is-numeric">
          {{ props.row.action.gas }}
        </div>
      </o-table-column>

      <template v-slot:detail="props">
        <tr>
          <td/>
          <td colspan="4">
            <ContractActionDetails :action="props.row.action"/>
          </td>
        </tr>
      </template>

    </o-table>
  </div>

  <EmptyTable v-if="!props.actions?.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ContractAction} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import ContractActionDetails from "@/components/contract/ContractActionDetails.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractActionWithPath} from "@/components/contract/ContractActionsLoader";
import {FunctionCallAnalyzer} from "@/utils/analyzer/FunctionCallAnalyzer";
import EthPrecompileAddress from "@/components/contract/EthPrecompileAddress.vue";

const NB_ACTIONS_PER_PAGE = 10

const props = defineProps({
  actions: Array as PropType<Array<ContractActionWithPath> | undefined>,
  analyzer: {
    type: Object as PropType<FunctionCallAnalyzer>,
    required: true
  }
})

const expandedActions = defineModel('expandedActions', {
  type: Array as PropType<Array<ContractActionWithPath>>,
  default: () => []
})

const isMediumScreen = inject('isMediumScreen', true)

const isPaginated = computed(() => (props.actions?.length ?? 0) > NB_ACTIONS_PER_PAGE)

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
