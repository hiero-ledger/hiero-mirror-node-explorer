// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

    <template #title>
      Contract Bytecode
    </template>

    <template #content>
      <ContractByteCodeValue :byte-code="byteCode" :show-hexa-opcode="showHexaOpcode"/>
    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ContractByteCodeValue from "@/components/values/ContractByteCodeValue.vue";
import {AppStorage} from "@/AppStorage.ts";

const props = defineProps({
  contractId: String,
  network: String
})

const contractId = computed(() => props.contractId ?? null)
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const byteCode = contractAnalyzer.byteCode

const showHexaOpcode = ref(false)
onMounted(() => showHexaOpcode.value = AppStorage.getShowHexaOpcode())
watch(showHexaOpcode, () => AppStorage.setShowHexaOpcode(showHexaOpcode.value ? showHexaOpcode.value : null))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
