// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="isHts && isErc20">
    <DashboardCardV2 collapsible-key="tokenHolders">
      <template #title>
        Fungible Token Balances
      </template>
      <template #left-control>
        <PlayPauseButton :controller="tokenBalanceTableController"/>
      </template>
      <template #content>
        <TokenBalanceTable :controller="tokenBalanceTableController"/>
      </template>
    </DashboardCardV2>
  </template>

  <template v-else-if="isHts && isErc721">
    <DashboardCardV2 collapsible-key="tokenHolders">
      <template #title>
        NFT Collection Items
      </template>
      <template #left-control>
        <PlayPauseButton :controller="nftHolderTableController"/>
      </template>
      <template #content>
        <NftHolderTable :controller="nftHolderTableController"/>
      </template>
    </DashboardCardV2>
  </template>

  <template v-else>
    <DashboardCardV2 collapsible-key="tokenHolders">
      <template #title>
        Token Top Holders
      </template>
      <template #content>
        <ERCTokenHolderTable :token-address="tokenAddress"/>
      </template>

    </DashboardCardV2>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NftHolderTable from "@/components/token/NftHolderTable.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import TokenBalanceTable from "@/components/token/TokenBalanceTable.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {TokenBalanceTableController} from "@/components/token/TokenBalanceTableController.ts";
import {NftHolderTableController} from "@/components/token/NftHolderTableController.ts";
import {routeManager} from "@/utils/RouteManager.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {SyntheticTokenAnalyzer} from "@/utils/analyzer/SyntheticTokenAnalyzer.ts";
import ERCTokenHolderTable from "@/components/ercToken/ERCTokenHolderTable.vue";

const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})

//
// Synthetic Token Analyzer
//
const tokenLoc = computed(() => props.tokenId)
const tokenAnalyzer = new SyntheticTokenAnalyzer(tokenLoc)
onMounted(() => tokenAnalyzer.mount())
onBeforeUnmount(() => tokenAnalyzer.unmount())

const tokenId = tokenAnalyzer.tokenId
const tokenAddress = tokenAnalyzer.tokenAddress

const isHts = tokenAnalyzer.isHts
const isErc20 = tokenAnalyzer.isErc20
const isErc721 = tokenAnalyzer.isErc721

//
// Token analyzer
//
const networkConfig = NetworkConfig.inject()
const tokenInfoAnalyzer = new TokenInfoAnalyzer(tokenId, networkConfig)
onMounted(() => tokenInfoAnalyzer.mount())
onBeforeUnmount(() => tokenInfoAnalyzer.unmount())

//
// TokenBalanceTableController
//
const isMediumScreen = inject('isMediumScreen', true)
const defaultPageSize = isMediumScreen ? 10 : 5
const fungibleTokenId = computed(() => tokenInfoAnalyzer.isFungible.value ? tokenId.value : null)
const tokenBalanceTableController = new TokenBalanceTableController(routeManager.router, fungibleTokenId, defaultPageSize);
onMounted(() => tokenBalanceTableController.mount())
onBeforeUnmount(() => tokenBalanceTableController.unmount())

//
// NftHolderTableController
//
const nftTokenId = computed(() => tokenInfoAnalyzer.isNft.value ? tokenId.value : null)
const nftHolderTableController = new NftHolderTableController(routeManager.router, nftTokenId, defaultPageSize)
onMounted(() => nftHolderTableController.mount())
onBeforeUnmount(() => nftHolderTableController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
