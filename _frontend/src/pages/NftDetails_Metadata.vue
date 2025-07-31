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
import {computed, onBeforeUnmount, onMounted, ref} from "vue"
import {EntityID} from "@/utils/EntityID"
import {NftBySerialCache} from "@/utils/cache/NftBySerialCache"
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import MetadataSection from "@/components/token/MetadataSection.vue";
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer";
import {CoreConfig} from "@/config/CoreConfig";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  tokenId: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  network: String,
})

const normalizedTokenId = computed(() => {
  const network = routeManager.currentNetworkEntry.value
  const result =
      EntityID.parse(props.tokenId) ??
      EntityID.fromAddress(props.tokenId, network.baseShard, network.baseRealm)
  return result !== null ? result.toString() : null
})

const tokenLookup = TokenInfoCache.instance.makeLookup(normalizedTokenId)
onMounted(() => tokenLookup.mount())
onBeforeUnmount(() => tokenLookup.unmount())

const serialNumber = ref(props.serialNumber)
const nftLookup = NftBySerialCache.instance.makeNftLookup(
    normalizedTokenId,
    serialNumber,
)
onMounted(() => nftLookup.mount())
onBeforeUnmount(() => nftLookup.unmount())

const coreConfig = CoreConfig.inject()
const ipfsGatewayPrefix = coreConfig.ipfsGatewayURL
const arweaveServerURL = coreConfig.arweaveServerURL

const metadata = computed(() => nftLookup.entity.value?.metadata ?? '')
const metadataAnalyzer = new TokenMetadataAnalyzer(metadata, ipfsGatewayPrefix, arweaveServerURL)
onMounted(() => metadataAnalyzer.mount())
onBeforeUnmount(() => metadataAnalyzer.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
