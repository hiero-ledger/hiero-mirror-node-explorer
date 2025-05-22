// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <template v-if="tokenId">
    <template v-if="isFungibleToken">Fungible Token</template>
    <template v-if="isNftToken">NFT</template>
  </template>
  <template v-else-if="contractId">Contract</template>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {ERCTokenAnalyzer} from "@/utils/analyzer/ERCTokenAnalyzer.ts";
import {TokenType} from "@/schemas/MirrorNodeSchemas.ts";

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
const isFungibleToken = computed(() => analyzer.tokenInfo.value?.type == TokenType.FUNGIBLE_COMMON)
const isNftToken = computed(() => analyzer.tokenInfo.value?.type == TokenType.NON_FUNGIBLE_UNIQUE)
const contractId = analyzer.contractId

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
