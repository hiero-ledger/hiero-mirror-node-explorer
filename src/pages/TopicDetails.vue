// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>


  <PageFrameV2>
    <template #page-title>
      Topic
      <span style="white-space: nowrap; font-size: smaller">
        {{ normalizedTopicId }}
      </span>
    </template>

    <Tabs
        :tab-ids="tabIds"
        :tab-labels="tabLabels"
        :selected-tab="selectedTabId"
        @update:selected-tab="onUpdate($event)"
    />

    <template v-if="!initialLoading && notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import {EntityID} from "@/utils/EntityID";
import {TopicByIdCache} from "@/utils/cache/TopicByIdCache";
import {initialLoadingKey} from "@/AppKeys";
import Tabs from "@/components/Tabs.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  topicId: {
    type: String,
    required: true
  },
  network: String
})

const tabIds = routeManager.topicDetailsOperator.tabIds
const tabLabels = routeManager.topicDetailsOperator.tabLabels
const selectedTabId = routeManager.topicDetailsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToTopic(props.topicId, null, tabId, true)
  }
}

const initialLoading = inject(initialLoadingKey, ref(false))

const validEntityId = computed(() =>
    props.topicId ? EntityID.parse(props.topicId) != null : false
)
const normalizedTopicId = computed(() =>
    props.topicId ? EntityID.normalize(props.topicId) : props.topicId
)

const notification = computed(() => {
  let result
  if (!validEntityId.value) {
    result = "Invalid topic ID: " + props.topicId
  } else if (topicLookup.entity.value === null) {
    if (topicLookup.isLoaded.value) {
      result = "Topic with ID " + props.topicId + " was not found"
    } else {
      result = null
    }
  } else if (topicLookup.entity.value.deleted) {
    result = "Topic is deleted"
  } else {
    result = null
  }
  return result
})

//
// topic
//
const topicLookup = TopicByIdCache.instance.makeLookup(normalizedTopicId)
onMounted(() => topicLookup.mount())
onBeforeUnmount(() => topicLookup.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
