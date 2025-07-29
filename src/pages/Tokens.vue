// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Tokens">

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
import Tabs from "@/components/Tabs.vue";
import {routeManager} from "@/utils/RouteManager.ts";

defineProps({
  network: String
})

const tabIds = routeManager.tokensOperator.tabIds
const tabLabels = routeManager.tokensOperator.tabLabels
const selectedTabId = routeManager.tokensOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToTokens(tabId, true)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
