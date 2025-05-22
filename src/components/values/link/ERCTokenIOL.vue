// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ContractIOL v-if="contractId" :contract-id="contractId"/>
  <TokenIOL v-else :token-id="tokenId"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {ERCTokenAnalyzer} from "@/utils/analyzer/ERCTokenAnalyzer.ts";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import TokenIOL from "@/components/values/link/TokenIOL.vue";

const props = defineProps({
  evmAddress: {
    type: String as PropType<string|null>,
    default: null
  },
})

const analyzer = new ERCTokenAnalyzer(computed(() => props.evmAddress))
onMounted(() => analyzer.mount())
onBeforeUnmount(() => analyzer.unmount())

const tokenId = analyzer.tokenId
const contractId = analyzer.contractId

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
