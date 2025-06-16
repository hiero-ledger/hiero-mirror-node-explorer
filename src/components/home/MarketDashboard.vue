// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="dashboard-root">
    <div class="dashboard-content">
      <MarketDashboardItem
          data-cy="market-dashboard-item"
          :title="hbarPriceLabel"
          :value="hbarPrice"
      >
        <img id="crypto-logo" alt="Crypto Logo" :src="cryptoLogoURL ?? ''">
      </MarketDashboardItem>

      <div class="line"/>

      <MarketDashboardItem
          data-cy="market-dashboard-item"
          :title="hbarMarketCapLabel"
          :value="hbarMarketCap"
      >
        <Globe :size="32"/>
      </MarketDashboardItem>

      <div v-if="isLargeScreen || !isSmallScreen" class="line"/>

      <MarketDashboardItem
          data-cy="market-dashboard-item"
          :title="hbarReleasedLabel"
          :value="hbarReleased"
      >
        <ArrowBigUpDash :size="32"/>
      </MarketDashboardItem>

      <div class="line"/>

      <MarketDashboardItem
          data-cy="market-dashboard-item"
          :title="hbarTotalLabel"
          :value="hbarTotal"
      >
        <Coins :size="32"/>
      </MarketDashboardItem>
    </div>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import MarketDashboardItem from "@/components/home/MarketDashboardItem.vue";
import {NetworkMetricsLoader} from "@/components/home/metrics/NetworkMetricsLoader";
import {CoreConfig} from "@/config/CoreConfig.ts";
import {ThemeController} from "@/components/ThemeController.ts";
import {ArrowBigUpDash, Coins, Globe} from 'lucide-vue-next';

const isSmallScreen = inject('isSmallScreen', ref(true))
const isLargeScreen = inject('isLargeScreen', ref(true))
const darkSelected = ThemeController.inject().darkSelected
const cryptoName = CoreConfig.inject().cryptoName

const hbarPriceLabel = `${cryptoName} PRICE`
const hbarMarketCapLabel = `${cryptoName} MARKET CAP`
const hbarReleasedLabel = `${cryptoName} RELEASED`
const hbarTotalLabel = `${cryptoName} TOTAL`

const coreConfig = CoreConfig.inject()
const cryptoLogoURL = computed(() =>
    darkSelected.value ? coreConfig.cryptoLogoDarkURL : coreConfig.cryptoLogoLightURL
)

// Hedera Metrics
const networkMetricsLoader = new NetworkMetricsLoader()
onMounted(() => networkMetricsLoader.mount())
onBeforeUnmount(() => networkMetricsLoader.unmount())

const hbarReleased = networkMetricsLoader.hbarReleasedText
// const hbarReleasedPercentage = networkMetricsLoader.hbarReleasedPercentageText
const hbarTotal = networkMetricsLoader.hbarTotalText
const hbarPrice = networkMetricsLoader.hbarPriceText
// const hbarPriceVariation = networkMetricsLoader.hbarPriceVariationText
const hbarMarketCap = networkMetricsLoader.hbarMarketCapText
// const hbarMarketCapVariation = networkMetricsLoader.hbarMarketCapVariationText

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.dashboard-root {
  background-color: var(--background-primary-transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-secondary);
  border-radius: 16px;
  display: flex;
  justify-content: center;
}

div.dashboard-content {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 32px;
  height: fit-content;
  padding: 26px 32px 26px 32px;
  width: fit-content;
}

@media (min-width: 768px) {
  div.dashboard-content {
    align-items: center;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr auto 1fr;
    justify-items: flex-start;
  }
}

@media (min-width: 1280px) {
  div.dashboard-content {
    grid-template-columns:  repeat(7, auto);
    justify-items: center;
  }
}

div.line {
  border: 1px solid var(--border-secondary);
  rotate: 0deg;
  width: 100%;
}

@media (min-width: 768px) {
  div.line {
    border: 1px solid var(--border-secondary);
    rotate: -90deg;
    width: 32px;
  }
}

</style>
