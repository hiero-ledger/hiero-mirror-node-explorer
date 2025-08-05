// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Metrics">

    <template #banner>
      <MetricsDashboard/>
    </template>

    <template #left-toolbar>
      <Tabs
          :tab-ids="tabIds"
          :tab-labels="tabLabels"
          :selected-tab="selectedTabId"
          @update:selected-tab="onUpdate($event)"
      />
    </template>

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {routeManager} from "@/utils/RouteManager.ts";
import MetricsDashboard from "@/components/home/MetricsDashboard.vue";
import Tabs from "@/components/Tabs.vue";
import {computed} from "vue";

defineProps({
  network: String
})

const tabIds = computed(() =>
    routeManager.currentNetwork.value === 'mainnet'
        ? routeManager.metricsOperator.tabIds
        : routeManager.metricsOperator.filterTabIds('Metrics_Nodes')
)
const tabLabels = computed(() =>
    routeManager.currentNetwork.value === 'mainnet'
        ? routeManager.metricsOperator.tabLabels
        : routeManager.metricsOperator.filterTabLabels('Metrics_Nodes')
)
const selectedTabId = routeManager.metricsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToMetrics(tabId, true)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
