// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ContractResultsSection :contract-id="props.contractId"/>

  <ContractResultLogs :logs="logs"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import ContractResultLogs from "@/components/contract/ContractResultLogs.vue";
import ContractResultsSection from "@/components/contract/ContractResultsSection.vue";
import {ContractResultsLogsAnalyzer} from "@/utils/analyzer/ContractResultsLogsAnalyzer.ts";

const props = defineProps({
  contractId: String,
  network: String
})

const contractId = computed(() => props.contractId ?? null)

//
// contract results logs - event logs at contract level
//
const contractResultsLogsAnalyzer = new ContractResultsLogsAnalyzer(contractId)
onMounted(() => contractResultsLogsAnalyzer.mount())
onBeforeUnmount(() => contractResultsLogsAnalyzer.unmount())
const logs = contractResultsLogsAnalyzer.logs

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
