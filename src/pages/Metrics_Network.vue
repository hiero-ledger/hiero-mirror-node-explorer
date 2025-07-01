// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="metrics-content">
    <ChartView :controller="networkFeeController" data-cy="chart-view"/>
  </div>
  <div v-if="routeManager.currentNetwork.value === 'mainnet'" class="metrics-content">
    <ChartView :controller="avgTimeToConsensusController" data-cy="chart-view"/>
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
import {NetworkFeeController} from "@/charts/hgraph/NetworkFeeController.ts";
import {AvgTimeToConsensusController} from "@/charts/hgraph/AvgTimeToConsensusController.ts";

defineProps({
  network: String
})

const themeController = ThemeController.inject()

const networkFeeController = new NetworkFeeController(themeController, routeManager)
onMounted(() => networkFeeController.mount())
onBeforeUnmount(() => networkFeeController.unmount())

const avgTimeToConsensusController = new AvgTimeToConsensusController(themeController, routeManager)
onMounted(() => avgTimeToConsensusController.mount())
onBeforeUnmount(() => avgTimeToConsensusController.unmount())

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
