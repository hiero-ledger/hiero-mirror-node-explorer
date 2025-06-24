// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ContractResultLogs :logs="logs" :contract-id="props.contractId"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import ContractResultLogs from "@/components/contract/ContractResultLogs.vue";
import {ContractResultsLogsAnalyzer} from "@/utils/analyzer/ContractResultsLogsAnalyzer.ts";

const props = defineProps({
  contractId: String,
  network: String
})


//
// contract results logs - event logs at contract level
//
const contractId = computed(() => props.contractId ?? null)
const contractResultsLogsAnalyzer = new ContractResultsLogsAnalyzer(contractId)
onMounted(() => contractResultsLogsAnalyzer.mount())
onBeforeUnmount(() => contractResultsLogsAnalyzer.unmount())
const logs = contractResultsLogsAnalyzer.logs

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>
