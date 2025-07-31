// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <MetadataSection :metadata-analyzer="metadataAnalyzer"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import MetadataSection from "@/components/token/MetadataSection.vue";
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";

const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})

const coreConfig = CoreConfig.inject()
const ipfsGatewayPrefix = coreConfig.ipfsGatewayURL
const arweaveServerURL = coreConfig.arweaveServerURL

const tokenId = computed(() => props.tokenId ?? null)
const tokenLookup = TokenInfoCache.instance.makeLookup(tokenId)
onMounted(() => tokenLookup.mount())
onBeforeUnmount(() => tokenLookup.unmount())
const metadata = computed(() => tokenLookup.entity.value?.metadata ?? '')
const metadataAnalyzer = new TokenMetadataAnalyzer(metadata, ipfsGatewayPrefix, arweaveServerURL)
onMounted(() => metadataAnalyzer.mount())
onBeforeUnmount(() => metadataAnalyzer.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
