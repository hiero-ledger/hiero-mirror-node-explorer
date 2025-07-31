// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Nodes">

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

import {computed} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import Tabs from "@/components/Tabs.vue";
import {routeManager} from "@/utils/RouteManager.ts";

defineProps({
  network: String
})

const excludedTabIds = computed(() =>
    (routeManager.enableStaking.value || routeManager.currentNetwork.value === 'mainnet')
        ? []
        : ["Nodes_Network"]
)

const tabIds = computed(() =>
    {
      return routeManager.nodesOperator.filterTabIds(excludedTabIds.value)
    }
)

const tabLabels = computed(() =>
    routeManager.nodesOperator.filterTabLabels(excludedTabIds.value)
)
const selectedTabId = routeManager.nodesOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToNodes(tabId, true)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
