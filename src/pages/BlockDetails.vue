// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      Block
      <span style="white-space: nowrap; font-size: smaller">
         {{ block?.number?.toString() ?? "" }}
      </span>
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
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

import {computed, onBeforeUnmount, onMounted} from 'vue';
import NotificationBanner from "@/components/NotificationBanner.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import Tabs from "@/components/Tabs.vue";
import {BlockLocParser} from "@/utils/parser/BlockLocParser";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  blockHon: String,
  network: String
})

const tabIds = routeManager.blockDetailsOperator.tabIds
const tabLabels = routeManager.blockDetailsOperator.tabLabels
const selectedTabId = routeManager.blockDetailsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (props.blockHon && tabId !== null) {
    routeManager.routeToBlock(props.blockHon, null, tabId, true)
  }
}

//
// block
//
const blockLocParser = new BlockLocParser(computed(() => props.blockHon ?? null))
onMounted(() => blockLocParser.mount())
onBeforeUnmount(() => blockLocParser.unmount())

const block = blockLocParser.block
const notification = blockLocParser.errorNotification

</script>

<style scoped>

</style>
