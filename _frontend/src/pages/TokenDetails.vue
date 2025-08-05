// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 :page-title="pageTitle">
    <template #page-title>
      Token
      <span style="white-space: nowrap; font-size: smaller">
        {{ normalizedTokenId }}
      </span>
    </template>

    <template #left-toolbar>
      <Tabs
          :tab-ids="tabIds"
          :tab-labels="tabLabels"
          :selected-tab="selectedTabId"
          @update:selected-tab="onUpdate($event)"
      />
    </template>

    <template #right-toolbar>
      <TokenActions
          v-if="isWalletConnected"
          :analyzer="tokenAnalyzer"
          @completed="onActionCompleted"
      />
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import NotificationBanner from "@/components/NotificationBanner.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import Tabs from "@/components/Tabs.vue";
import TokenActions from "@/components/token/TokenActions.vue";
import {EntityID} from "@/utils/EntityID.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {WalletManagerStatus} from "@/utils/wallet/WalletManagerV4.ts";
import {routeManager, walletManager} from "@/utils/RouteManager.ts";

const tabIds = routeManager.tokenDetailsOperator.tabIds
const tabLabels = routeManager.tokenDetailsOperator.tabLabels
const selectedTabId = routeManager.tokenDetailsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToToken(props.tokenId, null, tabId, true)
  }
}

const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})

const normalizedTokenId = computed(() => {
  const network = routeManager.currentNetworkEntry.value
  const result =
      EntityID.parse(props.tokenId)
      ?? EntityID.fromAddress(props.tokenId, network.baseShard, network.baseRealm)
  return result !== null ? result.toString() : null
})
const pageTitle = computed(() => normalizedTokenId.value !== null ? "Token " + normalizedTokenId.value : null)

const validEntityId = computed(() => normalizedTokenId.value != null)

const tokenLookup = TokenInfoCache.instance.makeLookup(normalizedTokenId)
onMounted(() => tokenLookup.mount())
onBeforeUnmount(() => tokenLookup.unmount())

const notification = computed(() => {
  let result
  if (!validEntityId.value) {
    result = "Invalid token ID: " + props.tokenId
  } else if (tokenLookup.entity.value == null) {
    if (tokenLookup.isLoaded.value) {
      result = "Token with ID " + props.tokenId + " was not found"
    } else {
      result = null
    }
  } else if (tokenLookup.entity.value?.deleted) {
    result = "Token is deleted"
  } else {
    result = null
  }
  return result
})

const isWalletConnected = computed(() => walletManager.status.value == WalletManagerStatus.connected)

const onActionCompleted = () => {
  // if (tokenAnalyzer.isNft.value) {
  //   nftHolderTableController.refresh()
  // } else {
  //   tokenBalanceTableController.refresh()
  // }
}

const tokenId = computed(() => props.tokenId ?? null)
const networkConfig = NetworkConfig.inject()
const tokenAnalyzer = new TokenInfoAnalyzer(tokenId, networkConfig)
onMounted(() => tokenAnalyzer.mount())
onBeforeUnmount(() => tokenAnalyzer.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
