// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 collapsible-key="topicMessages">

    <template #title>
      Topic Messages
    </template>

    <template #left-control>
      <PlayPauseButton :controller="messageTableController"/>
    </template>

    <template #content>
      <TopicMessageTable v-if="validEntityId" :controller="messageTableController"/>
    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {EntityID} from "@/utils/EntityID.ts";
import {TopicByIdCache} from "@/utils/cache/TopicByIdCache.ts";
import {TopicMessageTableController} from "@/components/topic/TopicMessageTableController.ts";
import {useRouter} from "vue-router";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import TopicMessageTable from "@/components/topic/TopicMessageTable.vue";


const props = defineProps({
  topicId: {
    type: String,
    required: true
  },
  network: String
})

const isMediumScreen = inject('isMediumScreen', ref(true))

const validEntityId = computed(() =>
    props.topicId ? EntityID.parse(props.topicId) != null : false
)
const normalizedTopicId = computed(() =>
    props.topicId ? EntityID.normalize(props.topicId) : props.topicId
)

//
// topic
//
const topicLookup = TopicByIdCache.instance.makeLookup(normalizedTopicId)
onMounted(() => topicLookup.mount())
onBeforeUnmount(() => topicLookup.unmount())
const topic = topicLookup.entity

//
// messageTableController
//
const defaultPageSize = isMediumScreen ? 15 : 5
const messageTableController = new TopicMessageTableController(useRouter(), normalizedTopicId, defaultPageSize)
onMounted(() => messageTableController.mount())
onBeforeUnmount(() => messageTableController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
