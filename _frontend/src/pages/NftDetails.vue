// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 :page-title="pageTitle">

    <template #page-title>NFT Details</template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <template #left-toolbar>
      <Tabs
          :tab-ids="tabIds"
          :tab-labels="tabLabels"
          :selected-tab="selectedTabId"
          @update:selected-tab="onUpdate($event)"
      />
    </template>

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted} from "vue"
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {EntityID} from "@/utils/EntityID"
import NotificationBanner from "@/components/NotificationBanner.vue"
import {NftBySerialCache} from "@/utils/cache/NftBySerialCache"
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer";
import {CoreConfig} from "@/config/CoreConfig";
import {routeManager} from "@/utils/RouteManager.ts";
import Tabs from "@/components/Tabs.vue";

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

const tabIds = routeManager.nftDetailsOperator.tabIds
const tabLabels = routeManager.nftDetailsOperator.tabLabels
const selectedTabId = routeManager.nftDetailsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null && props.serialNumber) {
    routeManager.routeToSerial(props.tokenId, Number(props.serialNumber), null, tabId, true)
  }
}

const normalizedTokenId = computed(() => {
  const network = routeManager.currentNetworkEntry.value
  const result =
      EntityID.parse(props.tokenId) ??
      EntityID.fromAddress(props.tokenId, network.baseShard, network.baseRealm)
  return result !== null ? result.toString() : null
})
const validEntityId = computed(() => normalizedTokenId.value != null)

const tokenLookup = TokenInfoCache.instance.makeLookup(normalizedTokenId)
onMounted(() => tokenLookup.mount())
onBeforeUnmount(() => tokenLookup.unmount())

const serialNumber = computed(() => props.serialNumber)
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

const notification = computed(() => {
  let result
  if (!validEntityId.value) {
    result = "Invalid token ID"
  } else if (nftLookup.entity.value == null) {
    if (nftLookup.isLoaded.value) {
      result =
          "Token with ID " + props.tokenId + " was not found"
    } else {
      result = null
    }
  } else if (nftLookup.entity.value?.deleted) {
    result = "Token is deleted"
  } else {
    result = null
  }
  return result
})

const pageTitle = computed(() =>
    normalizedTokenId.value !== null && serialNumber.value !== null
        ? "NFT " + normalizedTokenId.value + "/" + serialNumber.value
        : null
)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
