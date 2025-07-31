// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <template v-if="contractId != null">

    <template v-if="fullMatch || partialMatch">
      <div class="h-has-pill h-chip-success">
        <CheckCheck v-if="fullMatch" :size="12" style="margin-top: 2px"/>
        <Check v-else :size="12" style="margin-top: 2px"/>
        <span class="contract-name">{{ name }}</span>
      </div>
    </template>

    <template v-else>
      <div class="h-has-pill h-chip-default">
        NOT VERIFIED
      </div>
    </template>

  </template>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import {ContractAnalyzer, GlobalState} from "@/utils/analyzer/ContractAnalyzer";
import {Check, CheckCheck} from 'lucide-vue-next';

const props = defineProps({
  contractId: {
    type: String,
    required: true
  }
})

const contractAnalyzer = new ContractAnalyzer(computed(() => props.contractId ?? null))
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())

const name = computed(() => contractAnalyzer.contractName.value)
const partialMatch = computed(() => contractAnalyzer.globalState.value === GlobalState.PartialMatch)
const fullMatch = computed(() => contractAnalyzer.globalState.value === GlobalState.FullMatch)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.contract-name {
  vertical-align: top;
  margin-left: 4px;
}

</style>

