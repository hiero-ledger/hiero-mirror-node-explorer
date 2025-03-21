// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="showCharts">
    <div class="h-page-frame">
      <HomeHeader/>

      <div class="h-page-content">
        <div class="home-title">
          Network
        </div>

        <div class="home-separator"/>

        <div class="home-content">
          <ChartView :controller="txOverTimeController" data-cy="chart-view"/>
        </div>

        <div class="home-content">
          <ChartView :controller="networkFeeController" data-cy="chart-view"/>
        </div>

        <div class="home-title">
          Accounts
        </div>

        <div class="home-separator"/>

        <div class="home-content">
          <ChartView :controller="activeAccountsController" data-cy="chart-view"/>
        </div>

        <div class="dashboard-title">
          Other Charts
        </div>

        <div class="dashboard-separator"/>

        <div class="dashboard-content">
          <ChartView :controller="accountGrowthController" data-cy="chart-view"/>
        </div>

        <div class="dashboard-content">
          <ChartView :controller="transactionCountController" data-cy="chart-view"/>
        </div>

        <div class="dashboard-content">
          <ChartView :controller="avgTimeToConsensusController" data-cy="chart-view"/>
        </div>

        <div class="dashboard-content">
          <ChartView :controller="tpsController" data-cy="chart-view"/>
        </div>

      </div>

      <Footer/>
    </div>
  </template>

  <template v-else>
    <div class="h-page-frame">
      <HomeHeader full-page/>
      <Footer/>
    </div>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import Footer from "@/components/page/Footer.vue";
import HomeHeader from "@/components/page/header/HomeHeader.vue";
import {TxOverTimeController} from "@/charts/hgraph/TxOverTimeController.ts";
import ChartView from "@/charts/core/ChartView.vue";
import {NetworkFeeController} from "@/charts/hgraph/NetworkFeeController.ts";
import {ActiveAccountController} from "@/charts/hgraph/ActiveAccountController.ts";
import {AccountGrowthController} from "@/charts/hgraph/AccountGrowthController.ts";
import {TransactionCountController} from "@/charts/hgraph/TransactionCountController.ts";
import {AvgTimeToConsensusController} from "@/charts/hgraph/AvgTimeToConsensusController.ts";
import {ThemeController} from "@/components/ThemeController.ts";

import {routeManager} from "@/utils/RouteManager.ts";
import {TPSController} from "@/charts/hgraph/TPSController.ts";

defineProps({
  network: String
})

const themeController = ThemeController.inject()

const showCharts = computed(() => routeManager.hgraphURL.value !== null)

const txOverTimeController = new TxOverTimeController(themeController, routeManager)
onMounted(() => txOverTimeController.mount())
onBeforeUnmount(() => txOverTimeController.unmount())

const networkFeeController = new NetworkFeeController(themeController, routeManager)
onMounted(() => networkFeeController.mount())
onBeforeUnmount(() => networkFeeController.unmount())

const activeAccountsController = new ActiveAccountController(themeController, routeManager)
onMounted(() => activeAccountsController.mount())
onBeforeUnmount(() => activeAccountsController.unmount())

const accountGrowthController = new AccountGrowthController(themeController, routeManager)
onMounted(() => accountGrowthController.mount())
onBeforeUnmount(() => accountGrowthController.unmount())

const transactionCountController = new TransactionCountController(themeController, routeManager)
onMounted(() => transactionCountController.mount())
onBeforeUnmount(() => transactionCountController.unmount())

const avgTimeToConsensusController = new AvgTimeToConsensusController(themeController, routeManager)
onMounted(() => avgTimeToConsensusController.mount())
onBeforeUnmount(() => avgTimeToConsensusController.unmount())

const tpsController = new TPSController(themeController, routeManager)
onMounted(() => tpsController.mount())
onBeforeUnmount(() => tpsController.unmount())


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.home-title {
  color: var(--text-primary);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 26px;
  margin-top: 12px;
}

@media (min-width: 1080px) {
  div.home-title {
    font-size: 32px;
    font-weight: 400;
    line-height: 42px;
    margin-top: 8px;
  }
}

div.home-separator {
  background-color: var(--network-button-color);
  height: 2px;
  width: 100%;
}

div.home-content {
  background-color: var(--background-tertiary);
  border: 1px solid var(--table-border);
  border-radius: 16px;
  padding: 16px;
}

@media (min-width: 1080px) {
  div.home-content {
    padding: 32px;
  }
}

</style>
