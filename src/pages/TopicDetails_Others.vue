// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TopicFeesSection v-if="customFees" :fees="customFees" :exempt-key-list="exemptKeyList"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import {EntityID} from "@/utils/EntityID.ts";
import {TopicByIdCache} from "@/utils/cache/TopicByIdCache.ts";
import TopicFeesSection from "@/components/topic/TopicFeesSection.vue";

const props = defineProps({
  topicId: {
    type: String,
    required: true
  },
  network: String
})

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
// Custom fees
//
const customFees = computed(() => topic.value?.custom_fees ?? null)
const exemptKeyList = computed(() => topic.value?.fee_exempt_key_list ?? [])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
