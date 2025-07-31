// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Recent Contract Calls
    </template>

    <template v-if="hasContractResults" #left-control>
      <PlayPauseButton :controller="resultTableController"/>
    </template>

    <template #content>
      <template v-if="hasContractResults">
        <div id="contract-results-table">
          <ContractResultTable v-if="props.contractId" :controller="resultTableController"/>
        </div>
      </template>

      <template v-else>
        <DocSnippet
            doc-hint="See how to call a smart contract function"
            doc-url="https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts/call-a-smart-contract-function"
        >
          <p>The contract has not been called yet.</p>
        </DocSnippet>
      </template>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted} from 'vue';
import {ContractResultTableController} from "@/components/contract/ContractResultTableController";
import ContractResultTable from "@/components/contract/ContractResultTable.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import router from "@/utils/RouteManager.ts";
import DocSnippet from "@/components/DocSnippet.vue";

const props = defineProps({
  contractId: String,
})

const isMediumScreen = inject('isMediumScreen', true)

const computedContractId = computed(() => props.contractId ?? null)
const defaultPageSize = isMediumScreen ? 10 : 5

const hasContractResults = computed(() => resultTableController.rows.value.length)

//
// resultTableController
//

const resultTableController = new ContractResultTableController(router, computedContractId, defaultPageSize)
onMounted(() => resultTableController.mount())
onBeforeUnmount(() => resultTableController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
