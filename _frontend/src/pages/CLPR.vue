// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="CLPR">

    <template #left-toolbar>
      <div @click="onTabsClick">
        <Tabs
            :tab-ids="tabIds"
            :tab-labels="tabLabels"
            :selected-tab="selectedTabId"
            @update:selected-tab="onUpdate($event)"
        />
      </div>
    </template>

    <router-view/>


  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import Tabs from "@/components/Tabs.vue";
import {routeManager} from "@/utils/RouteManager.ts";

defineProps({
  network: String
})

const tabIds = routeManager.clprOperator.tabIds
const tabLabels = routeManager.clprOperator.tabLabels

// The message details are displayed in place of the Messages tab content: Messages stays the selected tab
const selectedTabId = computed(() => {
  const id = routeManager.clprOperator.selectedTabId.value
  return id === "CLPR_MessageDetails" ? "CLPR_Messages" : id
})

// Tabs does not notify a click on the already selected tab, but from the message details
// a click on the Messages tab must go back to the Messages table
const onTabsClick = (event: MouseEvent) => {
  const tabId = (event.target as HTMLElement).closest("li")?.id
  if (tabId === "tab-CLPR_Messages" && routeManager.clprOperator.selectedTabId.value === "CLPR_MessageDetails") {
    routeManager.routeToClpr("CLPR_Messages", true)
  }
}

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToClpr(tabId, true)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
