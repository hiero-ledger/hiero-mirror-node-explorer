// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Tokens">

    <Tabs
        :tab-ids="tabIds"
        :tab-labels="tabLabels"
        :selected-tab="selectedTab"
        @update:selected-tab="onUpdate($event)"
    />

    <DashboardCardV2 v-if="selectedTab === 'nft'">
      <template #title>
        <span>Recent NFTs</span>
      </template>
      <template #left-control>
        <PlayPauseButton :controller="nftTableController"/>
      </template>
      <template #content>
        <TokenTable :controller="nftTableController"/>
      </template>
    </DashboardCardV2>

    <DashboardCardV2 v-else-if="selectedTab === 'fungible'">
      <template #title>
        <span>Recent Fungible Tokens</span>
      </template>
      <template #left-control>
        <PlayPauseButton :controller="tokenTableController"/>
      </template>
      <template #content>
        <TokenTable :controller="tokenTableController"/>
      </template>
    </DashboardCardV2>

    <DashboardCardV2 v-else-if="selectedTab === 'erc'">
      <template #title>
        <span>Top ERC Tokens</span>
      </template>
      <template #content>
        <ERCTokenTable/>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import TokenTable from "@/components/token/TokenTable.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {TokenTableController} from "@/components/token/TokenTableController";
import {useRouter} from "vue-router";
import {TokenType} from "@/schemas/MirrorNodeSchemas";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import ERCTokenTable from "@/components/ercToken/ERCTokenTable.vue";
import {routeManager} from "@/router.ts";
import Tabs from "@/components/Tabs.vue";

defineProps({
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)
const blockscoutEnabled = computed(() => routeManager.currentNetworkEntry.value.blockscoutURL !== null)

const tabIds = blockscoutEnabled ? ['erc', 'fungible', 'nft'] :  ['fungible', 'nft']
const tabLabels = ['ERC Tokens', 'Hedera Fungible', 'Hedera NFT']
const selectedTab = ref<string | null>(tabIds[0])
const onUpdate = (tab: string | null) => {
  selectedTab.value = tab
}

//
// NFT and TOKEN TableController
//
const defaultPageSize = isMediumScreen ? 15 : 10
const nftTableController = new TokenTableController(useRouter(), defaultPageSize, ref(TokenType.NON_FUNGIBLE_UNIQUE), "p1", "k1")
const tokenTableController = new TokenTableController(useRouter(), defaultPageSize, ref(TokenType.FUNGIBLE_COMMON), "p2", "k2")
onMounted(() => {
  nftTableController.mount()
  tokenTableController.mount()
})
onBeforeUnmount(() => {
  nftTableController.unmount()
  tokenTableController.unmount()
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
