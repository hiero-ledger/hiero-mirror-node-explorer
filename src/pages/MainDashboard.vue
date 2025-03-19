// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <MainDashboardHeader/>

  <div class="h-page-content">
    <div class="dashboard-title">
      Network
    </div>

    <div class="dashboard-separator"/>

    <div class="dashboard-content">
      <ChartView :controller="txOverTimeController" data-cy="chart-view"/>
    </div>

    <div class="dashboard-content">
      <ChartView :controller="networkFeeController" data-cy="chart-view"/>
    </div>

    <div class="dashboard-title">
      Accounts
    </div>

    <div class="dashboard-separator"/>

    <div class="dashboard-content">
      <ChartView :controller="activeAccountsController" data-cy="chart-view"/>
    </div>

    <div class="dashboard-title">
      Added Charts
    </div>

    <div class="dashboard-separator"/>

    <div class="dashboard-content">
      <ChartView :controller="tpsController" data-cy="chart-view"/>
    </div>

    <div class="dashboard-content">
      <ChartView :controller="accountGrowthController" data-cy="chart-view"/>
    </div>

    <div class="dashboard-content">
      <ChartView :controller="transactionCountController" data-cy="chart-view"/>
    </div>

    <div class="dashboard-content">
      <ChartView :controller="avgTimeToConsensusController" data-cy="chart-view"/>
    </div>

  </div>

  <Footer/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted} from 'vue';
import Footer from "@/components/page/Footer.vue";
import MainDashboardHeader from "@/components/page/header/MainDashboardHeader.vue";
import {TxOverTimeController} from "@/charts/hgraph/TxOverTimeController.ts";
import ChartView from "@/charts/core/ChartView.vue";
import {NetworkFeeController} from "@/charts/hgraph/NetworkFeeController.ts";
import {ActiveAccountController} from "@/charts/hgraph/ActiveAccountController.ts";
import {AccountGrowthController} from "@/charts/hgraph/AccountGrowthController.ts";
import {TransactionCountController} from "@/charts/hgraph/TransactionCountController.ts";
import {AvgTimeToConsensusController} from "@/charts/hgraph/AvgTimeToConsensusController.ts";
import {ThemeController} from "@/components/ThemeController.ts";
import {routeManager} from "@/router.ts";
import {TPSController} from "@/charts/hgraph/TPSController.ts";

defineProps({
  network: String
})

const themeController = ThemeController.inject()

const txOverTimeController = new TxOverTimeController(themeController, routeManager)
onMounted(() => txOverTimeController.mount())
onBeforeUnmount(() => txOverTimeController.unmount())

const networkFeeController = new NetworkFeeController(themeController, routeManager)
onMounted(() => networkFeeController.mount())
onBeforeUnmount(() => networkFeeController.unmount())

const activeAccountsController = new ActiveAccountController(themeController, routeManager)
onMounted(() => activeAccountsController.mount())
onBeforeUnmount(() => activeAccountsController.unmount())

const tpsController = new TPSController(themeController, routeManager)
onMounted(() => tpsController.mount())
onBeforeUnmount(() => tpsController.unmount())

const accountGrowthController = new AccountGrowthController(themeController, routeManager)
onMounted(() => accountGrowthController.mount())
onBeforeUnmount(() => accountGrowthController.unmount())

const transactionCountController = new TransactionCountController(themeController, routeManager)
onMounted(() => transactionCountController.mount())
onBeforeUnmount(() => transactionCountController.unmount())

const avgTimeToConsensusController = new AvgTimeToConsensusController(themeController, routeManager)
onMounted(() => avgTimeToConsensusController.mount())
onBeforeUnmount(() => avgTimeToConsensusController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.dashboard-title {
  color: var(--text-primary);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 26px;
  margin-top: 12px;
}

@media (min-width: 1080px) {
  div.dashboard-title {
    font-size: 32px;
    font-weight: 400;
    line-height: 42px;
    margin-top: 8px;
  }
}

div.dashboard-separator {
  background-color: var(--network-button-color);
  height: 2px;
  width: 100%;
}

div.dashboard-content {
  background-color: var(--background-tertiary);
  border: 1px solid var(--table-border);
  border-radius: 16px;
  padding: 16px;
}

@media (min-width: 1080px) {
  div.dashboard-content {
    padding: 32px;
  }
}

</style>
