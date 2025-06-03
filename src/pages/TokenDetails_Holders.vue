// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="tokenInfo" collapsible-key="nftHolders">

    <template #title>
      {{ tokenInfo.type === 'NON_FUNGIBLE_UNIQUE' ? 'NFTs' : 'Balances' }}
    </template>

    <template #left-control>
      <PlayPauseButton :controller="isNft ? nftHolderTableController : tokenBalanceTableController"/>
    </template>

    <template #content>
      <NftHolderTable v-if="isNft" :controller="nftHolderTableController"/>
      <TokenBalanceTable v-else :controller="tokenBalanceTableController"/>
    </template>

  </DashboardCardV2>

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
import {routeManager} from "@/router.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";

const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})

//
// Token analyzer
//
const tokenId = computed(() => props.tokenId ?? null)
const networkConfig = NetworkConfig.inject()
const tokenAnalyzer = new TokenInfoAnalyzer(tokenId, networkConfig)
onMounted(() => tokenAnalyzer.mount())
onBeforeUnmount(() => tokenAnalyzer.unmount())
const tokenInfo = tokenAnalyzer.tokenInfo
const isNft = tokenAnalyzer.isNft

//
// TokenBalanceTableController
//
const isMediumScreen = inject('isMediumScreen', true)
const defaultPageSize = isMediumScreen ? 10 : 5
const fungibleTokenId = computed(() => tokenAnalyzer.isFungible.value ? tokenId.value : null)
const tokenBalanceTableController = new TokenBalanceTableController(routeManager.router, fungibleTokenId, defaultPageSize);
onMounted(() => tokenBalanceTableController.mount())
onBeforeUnmount(() => tokenBalanceTableController.unmount())

//
// NftHolderTableController
//
const nftTokenId = computed(() => tokenAnalyzer.isNft.value ? tokenId.value : null)
const nftHolderTableController = new NftHolderTableController(routeManager.router, nftTokenId, defaultPageSize)
onMounted(() => nftHolderTableController.mount())
onBeforeUnmount(() => nftHolderTableController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
