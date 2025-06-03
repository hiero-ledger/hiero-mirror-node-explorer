// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      Token
      <span style="white-space: nowrap; font-size: smaller">
        {{ normalizedTokenId }}
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
import {EntityID} from "@/utils/EntityID.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {routeManager} from "@/utils/RouteManager.ts";

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

const normalizedTokenId = computed(() => {
  const network = routeManager.currentNetworkEntry.value
  const result =
      EntityID.parse(props.tokenId)
      ?? EntityID.fromAddress(props.tokenId, network.baseShard, network.baseRealm)
  return result !== null ? result.toString() : null
})

const validEntityId = computed(() => normalizedTokenId.value != null)

const tokenLookup = TokenInfoCache.instance.makeLookup(normalizedTokenId)
onMounted(() => tokenLookup.mount())
onBeforeUnmount(() => tokenLookup.unmount())

const notification = computed(() => {
  let result
  if (!validEntityId.value) {
    result = "Invalid token ID: " + props.tokenId
  } else if (tokenLookup.entity.value == null) {
    if (tokenLookup.isLoaded.value) {
      result = "Token with ID " + props.tokenId + " was not found"
    } else {
      result = null
    }
  } else if (tokenLookup.entity.value?.deleted) {
    result = "Token is deleted"
  } else {
    result = null
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
