// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="metrics-content">
    <ChartView :controller="txOverTimeController" data-cy="chart-view"/>
  </div>
  <div class="metrics-content">
    <ChartView :controller="transactionCountController" data-cy="chart-view"/>
  </div>
  <div class="metrics-content">
    <ChartView :controller="tpsController" data-cy="chart-view"/>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import ChartView from "@/charts/core/ChartView.vue";
import {ThemeController} from "@/components/ThemeController.ts";
import {onBeforeUnmount, onMounted} from "vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {TxOverTimeController} from "@/charts/hgraph/TxOverTimeController.ts";
import {TransactionCountController} from "@/charts/hgraph/TransactionCountController.ts";
import {TPSController} from "@/charts/hgraph/TPSController.ts";

defineProps({
  network: String
})

const themeController = ThemeController.inject()

const txOverTimeController = new TxOverTimeController(themeController, routeManager)
onMounted(() => txOverTimeController.mount())
onBeforeUnmount(() => txOverTimeController.unmount())

const transactionCountController = new TransactionCountController(themeController, routeManager)
onMounted(() => transactionCountController.mount())
onBeforeUnmount(() => transactionCountController.unmount())

const tpsController = new TPSController(themeController, routeManager)
onMounted(() => tpsController.mount())
onBeforeUnmount(() => tpsController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

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
