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
      <Property id="solcVersion" :full-width="true">
        <template v-slot:name>Solidity Compiler Version</template>
        <template v-slot:value>
          <StringValue :string-value="solcVersion ?? undefined"/>
        </template>
      </Property>
      <Property v-if="isVerified" id="contractName" :full-width="true">
        <template v-slot:name>EVM Version</template>
        <template v-slot:value>
          <StringValue :string-value="evmVersion"/>
        </template>
      </Property>
      <hr class="horizontal-line">
      <ContractByteCodeValue :byte-code="byteCode" :show-hexa-opcode="showHexaOpcode"/>
    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import ContractByteCodeValue from "@/components/values/ContractByteCodeValue.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import Property from "@/components/Property.vue";
import StringValue from "@/components/values/StringValue.vue";
import {AppStorage} from "@/AppStorage.ts";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";

const props = defineProps({
  contractId: String,
  network: String
})

const contractId = computed(() => props.contractId ?? null)
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const byteCode = contractAnalyzer.byteCode
const isVerified = contractAnalyzer.isVerified
const solcVersion = contractAnalyzer.solcVersion
const evmVersion = contractAnalyzer.evmVersion

const showHexaOpcode = ref(false)
onMounted(() => showHexaOpcode.value = AppStorage.getShowHexaOpcode())
watch(showHexaOpcode, () => AppStorage.setShowHexaOpcode(showHexaOpcode.value ? showHexaOpcode.value : null))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

hr.horizontal-line {
  margin: 8px 0;
}

</style>
