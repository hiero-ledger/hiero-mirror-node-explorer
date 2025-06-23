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

    <template #right-toolbar>
      <div class="block-navigation-container">
        <ButtonView
            id="prev-block-button"
            :enabled="!disablePreviousButton"
            :size="ButtonSize.small"
            :for-toolbar="true"
            @action="handlePreviousBlock"
        >
          <ArrowLeft :size="18" class="block-navigation-button"/>
          <span class="block-navigation-button">{{ isSmallScreen ? 'PREV. BLOCK' : 'PREV.' }}</span>
        </ButtonView>
        <ButtonView
            id="next-block-button"
            :enabled="!disableNextButton"
            :size="ButtonSize.small"
            :for-toolbar="true"
            @action="handleNextBlock"
        >
          <span class="block-navigation-button">{{ isSmallScreen ? 'NEXT BLOCK' : 'NEXT' }}</span>
          <ArrowRight :size="18" class="block-navigation-button"/>
        </ButtonView>
      </div>
    </template>

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted} from 'vue';
import NotificationBanner from "@/components/NotificationBanner.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import Tabs from "@/components/Tabs.vue";
import {BlockLocParser} from "@/utils/parser/BlockLocParser";
import {routeManager} from "@/utils/RouteManager.ts";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import ButtonView from "@/elements/ButtonView.vue";
import {ArrowLeft, ArrowRight} from "lucide-vue-next";

const props = defineProps({
  blockHon: String,
  network: String
})

const isSmallScreen = inject('isSmallScreen', true)

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

const disablePreviousButton = computed(() => {
  return (blockLocParser.errorNotification.value != null) || (blockLocParser.block.value?.previous_hash === nullHash)
})
const disableNextButton = computed(() => {
  return blockLocParser.errorNotification.value != null
})

const nullHash = "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
const handlePreviousBlock = () => {
  const currentBlockNumber = blockLocParser.blockNumber.value ?? 0
  const selectedTabId = routeManager.blockDetailsOperator.selectedTabId.value
  routeManager.routeToBlock(currentBlockNumber - 1, null, selectedTabId)
}
const handleNextBlock = () => {
  const currentBlockNumber = blockLocParser.blockNumber.value ?? 0
  const selectedTabId = routeManager.blockDetailsOperator.selectedTabId.value
  routeManager.routeToBlock(currentBlockNumber + 1, null, selectedTabId)
}


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.block-navigation-button {
  color: var(--text-primary);
}

.block-navigation-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

</style>
