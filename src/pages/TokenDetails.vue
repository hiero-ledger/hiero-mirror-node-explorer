// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      Token
      <span style="white-space: nowrap; font-size: smaller">
        {{ tokenId }}
      </span>
    </template>

    <Tabs
        :tab-ids="tabIds"
        :tab-labels="tabLabels"
        :selected-tab="selectedTabId"
        @update:selected-tab="onUpdate($event)"
    />

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import NotificationBanner from "@/components/NotificationBanner.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import Tabs from "@/components/Tabs.vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {TOCLocParser} from "@/utils/parser/TOCLocParser.ts";

const tabIds = routeManager.tokenDetailsOperator.tabIds
const tabLabels = routeManager.tokenDetailsOperator.tabLabels
const selectedTabId = routeManager.tokenDetailsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToToken(props.tokenId, null, tabId, true)
  }
}

const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})

//
// Synthetic Token Analyzer
//
const tokenLoc = computed(() => props.tokenId)
const tocLocAnalyzer = new TOCLocParser(tokenLoc)
onMounted(() => tocLocAnalyzer.mount())
onBeforeUnmount(() => tocLocAnalyzer.unmount())

const tokenId = tocLocAnalyzer.entityId
const notification = tocLocAnalyzer.errorNotification

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
