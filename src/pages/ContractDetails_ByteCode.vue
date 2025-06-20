// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ContractByteCodeSection :contract-analyzer="contractAnalyzer"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import ContractByteCodeSection from "@/components/contract/ContractByteCodeSection.vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";

const props = defineProps({
  contractId: String,
  network: String
})

const contractId = computed(() => props.contractId ?? null)
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
