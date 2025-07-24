// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TokenKeysSection :token-info="tokenInfo" :collapsible="hasCustomFees"/>

  <TokenFeesSection v-if="hasCustomFees" :analyzer="tokenAnalyzer"/>

<!--
  <ContractResultsSection :contract-id="tokenId ?? undefined"/>
-->

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import TokenFeesSection from "@/components/token/TokenFeesSection.vue";
import TokenKeysSection from "@/components/token/TokenKeysSection.vue";
import {computed, onBeforeUnmount, onMounted} from "vue";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";

const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})

const tokenId = computed(() => props.tokenId ?? null)
const networkConfig = NetworkConfig.inject()
const tokenAnalyzer = new TokenInfoAnalyzer(tokenId, networkConfig)
onMounted(() => tokenAnalyzer.mount())
onBeforeUnmount(() => tokenAnalyzer.unmount())
const tokenInfo = tokenAnalyzer.tokenInfo
const hasCustomFees = tokenAnalyzer.hasCustomFees

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
