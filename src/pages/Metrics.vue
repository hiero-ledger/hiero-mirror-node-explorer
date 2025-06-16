// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Metrics">

    <div class="metrics-title">
      Network
    </div>

    <div class="metrics-separator"/>

    <div class="metrics-content">
      <ChartView :controller="txOverTimeController" data-cy="chart-view"/>
    </div>

    <div class="metrics-content">
      <ChartView :controller="networkFeeController" data-cy="chart-view"/>
    </div>

    <div class="metrics-title">
      Accounts
    </div>

    <div class="metrics-separator"/>

    <div class="metrics-content">
      <ChartView :controller="activeAccountsController" data-cy="chart-view"/>
    </div>

    <div class="metrics-title">
      Other Charts
    </div>

    <div style="display: flex">
      <CounterView :controller="contractCounterController"/>
    </div>

    <div class="metrics-separator"/>

    <div class="metrics-content">
      <ChartView :controller="accountGrowthController" data-cy="chart-view"/>
    </div>

    <div class="metrics-content">
      <ChartView :controller="transactionCountController" data-cy="chart-view"/>
    </div>

    <div class="metrics-content">
      <ChartView :controller="avgTimeToConsensusController" data-cy="chart-view"/>
    </div>

    <div class="metrics-content">
      <ChartView :controller="tpsController" data-cy="chart-view"/>
    </div>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import ChartView from "@/charts/core/ChartView.vue";
import CounterView from "@/charts/core/CounterView.vue";
import {ThemeController} from "@/components/ThemeController.ts";
import {onBeforeUnmount, onMounted} from "vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {TxOverTimeController} from "@/charts/hgraph/TxOverTimeController.ts";
import {NetworkFeeController} from "@/charts/hgraph/NetworkFeeController.ts";
import {ActiveAccountController} from "@/charts/hgraph/ActiveAccountController.ts";
import {AccountGrowthController} from "@/charts/hgraph/AccountGrowthController.ts";
import {TransactionCountController} from "@/charts/hgraph/TransactionCountController.ts";
import {AvgTimeToConsensusController} from "@/charts/hgraph/AvgTimeToConsensusController.ts";
import {TPSController} from "@/charts/hgraph/TPSController.ts";
import {TransactionCounterController} from "@/charts/core/CounterController.ts";

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

const contractCounterController = new TransactionCounterController(11, "Account Created", "", routeManager)
onMounted(() => contractCounterController.mount())
onBeforeUnmount(() => contractCounterController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.metrics-title {
  color: var(--text-primary);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 26px;
  margin-top: 12px;
}

@media (min-width: 1080px) {
  div.metrics-title {
    font-size: 32px;
    font-weight: 400;
    line-height: 42px;
    margin-top: 8px;
  }
}

div.metrics-separator {
  background-color: var(--network-button-color);
  height: 2px;
  width: 100%;
}

div.metrics-content {
  background-color: var(--background-tertiary);
  border: 1px solid var(--table-border);
  border-radius: 16px;
  padding: 16px;
}

@media (min-width: 1080px) {
  div.metrics-content {
    padding: 32px;
  }
}

</style>
