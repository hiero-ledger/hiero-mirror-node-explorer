// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="header" :class="{'full-page': props.fullPage}">

    <!--  First line of header-->
    <div class="header-top">
      <template v-if="isLargeScreen">
        <div class="top-side">
          <ProductLogo/>
          <AxiosStatus/>
          <TabBar/>
        </div>
        <div class="top-side">
          <NetworkSelector/>
          <template v-if="enableWallet">
            <ConnectWalletButton v-if="!connected"/>
            <WalletStatusButton v-else/>
          </template>
          <ThemeSwitch/>
        </div>
      </template>
      <template v-else>
        <div class="top-side">
          <MobileMenuButton/>
          <ProductLogo/>
          <AxiosStatus/>
        </div>
        <div v-if="enableWallet" class="top-side">
          <ConnectWalletButton v-if="!connected"/>
          <WalletStatusButton v-else/>
        </div>
      </template>
    </div>

    <!--  Central part of header-->
    <div class="title" :class="{'full-page': props.fullPage}">
      Explore Hedera Blockchain
    </div>
    <SearchBar :size="90" class="search-bar"/>

    <!--  Market dashboard part of header-->
    <div v-if="enableMarketData" class="market-dashboard">
      <MarketDashboard/>
    </div>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import ProductLogo from "@/components/page/header/ProductLogo.vue";
import NetworkSelector from "@/components/page/header/NetworkSelector.vue";
import ThemeSwitch from "@/components/ThemeSwitch.vue";
import AxiosStatus from "@/components/AxiosStatus.vue";
import TabBar from "@/components/page/header/TabBar.vue";
import SearchBar from "@/components/search/SearchBar.vue";
import ConnectWalletButton from "@/components/page/header/wallet/ConnectWalletButton.vue";
import {computed, inject} from "vue";
import {routeManager, walletManager} from "@/router.ts";
import {WalletManagerStatus} from "@/utils/wallet/WalletManagerV4.ts";
import WalletStatusButton from "@/components/page/header/wallet/WalletStatusButton.vue";
import MobileMenuButton from "@/components/page/header/MobileMenuButton.vue";
import MarketDashboard from "@/components/dashboard/MarketDashboard.vue";

const props = defineProps({
  fullPage: {
    type: Boolean,
    default: false
  }
})

const enableMarketData = routeManager.enableMarket
const isLargeScreen = inject('isLargeScreen', true)
const enableWallet = routeManager.enableWallet

const connected = computed(() => walletManager.status.value == WalletManagerStatus.connected)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.header {
  align-items: center;
  background: url('@/assets/main-header-background-mobile.svg') top 114px left no-repeat, var(--background-secondary);
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
  display: flex;
  flex-direction: column;
  padding: 0 16px 24px 16px;
}

div.header.full-page {
  background: url('@/assets/main-header-background-mobile.svg') top max(calc(100vh - 526px), 114px) left no-repeat, var(--background-secondary);
  height: max(calc(100vh - 90px), 400px);
}

@media (min-width: 390px) {
  div.header {
    background: url('@/assets/main-header-background.svg') top 114px left no-repeat, var(--background-secondary);
  }

  div.header.full-page {
    background: url('@/assets/main-header-background.svg') top max(calc(100vh - 526px), 114px) left no-repeat, var(--background-secondary);
  }
}

@media (min-width: 1080px) {
  div.header {
    padding: 0 32px 32px 32px;
  }
}

div.header-top {
  align-items: center;
  column-gap: 16px;
  display: flex;
  height: 72px;
  justify-content: space-between;
  width: 100%;
}

div.top-side {
  align-items: center;
  column-gap: 16px;
  display: flex;
  justify-content: space-between;
}

div.title {
  color: var(--text-primary);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 32px;
  font-weight: 400;
  line-height: 42px;
  margin-top: 34px;
  text-align: center;
}

div.title.full-page {
  margin-top: max(calc(50vh - 240px), 80px);
}

@media (min-width: 1080px) {
  div.title {
    font-size: 56px;
    font-weight: 500;
    line-height: 74px;
    margin-top: 48px;
  }

  div.title.full-page {
    margin-top: max(calc(50vh - 250px), 80px);
  }
}

@media (min-width: 1280px) {
  div.title {
    margin-top: 80px;
  }
}

.search-bar {
  margin-top: 38px;
  margin-bottom: 6px;
  max-width: 912px;
  width: 100%;
}

@media (min-width: 768px) {
  .search-bar {
    margin-bottom: 64px;
  }
}

@media (min-width: 1080px) {
  .search-bar {
    margin-top: 16px;
  }
}

@media (min-width: 1280px) {
  .search-bar {
    margin-bottom: 90px;
  }
}

.market-dashboard {
  margin-top: 30px;
  width: 100%;
}

</style>
