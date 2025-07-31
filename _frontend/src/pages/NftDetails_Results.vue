// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ContractResultsSection :contract-id="normalizedTokenId ?? undefined"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue"
import {EntityID} from "@/utils/EntityID"
import {NftBySerialCache} from "@/utils/cache/NftBySerialCache"
import ContractResultsSection from "@/components/contract/ContractResultsSection.vue"
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

const serialNumber = ref(props.serialNumber)
const nftLookup = NftBySerialCache.instance.makeNftLookup(
    normalizedTokenId,
    serialNumber,
)
onMounted(() => nftLookup.mount())
onBeforeUnmount(() => nftLookup.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
