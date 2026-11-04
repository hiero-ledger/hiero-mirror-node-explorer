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

// Details pages are displayed in place of the content of their parent tab, which stays the selected tab
const DETAILS_PARENT_TABS: Record<string, string> = {
  CLPR_MessageDetails: "CLPR_Messages",
  CLPR_ChannelDetails: "CLPR_Channels",
}

const selectedTabId = computed(() => {
  const id = routeManager.clprOperator.selectedTabId.value
  return id !== null ? (DETAILS_PARENT_TABS[id] ?? id) : null
})

// Tabs does not notify a click on the already selected tab, but from a details page
// a click on the parent tab must go back to its table
const onTabsClick = (event: MouseEvent) => {
  const tabId = (event.target as HTMLElement).closest("li")?.id?.replace("tab-", "")
  const current = routeManager.clprOperator.selectedTabId.value
  if (tabId && current !== null && current in DETAILS_PARENT_TABS && DETAILS_PARENT_TABS[current] === tabId) {
    routeManager.routeToClpr(tabId, true)
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
