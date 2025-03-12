// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Tokens">

    <div class="h-side-by-side-content">

      <DashboardCardV2>
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

      <DashboardCardV2>
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

    </div>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import TokenTable from "@/components/token/TokenTable.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {TokenTableController} from "@/components/token/TokenTableController";
import {useRouter} from "vue-router";
import {TokenType} from "@/schemas/MirrorNodeSchemas";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";

defineProps({
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)

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

//
// Page size of both nft/token tables must be synchronized
//
watch(nftTableController.pageSize, (newValue: number) => tokenTableController.pageSize.value = newValue)
watch(tokenTableController.pageSize, (newValue: number) => nftTableController.pageSize.value = newValue)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
