// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 collapsible-key="topicDetails">
    <template #title>
      Topic
      <div v-if="isHcs1Topic" class="h-has-pill" style="margin-top: 2px">
        HCS-1
      </div>
      <span class="mr-1"/>
      <PublicLabel v-if="label" :label-definition="label"/>
    </template>

    <template #content>
      <Property id="memo" full-width>
        <template #name>Memo</template>
        <template #value>
          <BlobValue :blob-value="topic?.memo" :show-none="true" :base64="true" :show-base64-as-extra="true"/>
        </template>
      </Property>
      <Property id="valid-from" full-width>
        <template #name>Valid from</template>
        <template #value>
          <TimestampValue :timestamp="topic?.timestamp?.from" :show-none="true"/>
        </template>
      </Property>
      <Property v-if="topic?.timestamp?.to" id="valid-until" full-width>
        <template #name>Valid until</template>
        <template #value>
          <TimestampValue :timestamp="topic?.timestamp?.to" :show-none="true"/>
        </template>
      </Property>
      <Property v-if="topic?.created_timestamp" id="creation-date" full-width>
        <template #name>
          <span>Created</span>
        </template>
        <template #value>
          <TimestampValue :timestamp="topic?.created_timestamp" :show-none="true"/>
        </template>
      </Property>
      <Property v-if="topic?.auto_renew_period" id="auto-renew-period" full-width>
        <template #name>
          <span>Auto Renew Period</span>
        </template>
        <template #value>
          <DurationValue :number-value="topic?.auto_renew_period ?? undefined" :show-none="true"/>
        </template>
      </Property>
      <Property v-if="topic?.auto_renew_account" id="auto-renew-account" full-width>
        <template #name>
          <span>Auto Renew Account</span>
        </template>
        <template #value>
          <AccountLink :account-id="topic?.auto_renew_account"/>
        </template>
      </Property>
      <Property v-if="topic?.admin_key" id="admin-key" full-width>
        <template #name>Admin Key</template>
        <template #value>
          <KeyValue :key-bytes="topic?.admin_key?.key" :key-type="topic?.admin_key?._type" :show-none="true"/>
        </template>
      </Property>
      <Property v-if="topic?.submit_key" id="submit-key" full-width>
        <template #name>Submit Key</template>
        <template #value>
          <KeyValue :key-bytes="topic?.submit_key?.key" :key-type="topic?.submit_key?._type" :show-none="true"/>
        </template>
      </Property>
      <Property v-if="topic?.fee_schedule_key" id="fee-schedule-key" full-width>
        <template #name>Fee Schedule Key</template>
        <template #value>
          <KeyValue :key-bytes="topic?.fee_schedule_key?.key" :key-type="topic?.fee_schedule_key?._type"
                    :show-none="true"/>
        </template>
      </Property>

    </template>

    <template #footer>
      <MirrorLink :network="network" entityUrl="topics" :loc="topicId"/>
    </template>
  </DashboardCardV2>

  <HCSContentSection v-if="isHcs1Topic" :topic-memo="hcs1Memo" :hcs1-asset="hcs1Asset"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import Property from "@/components/Property.vue";
import PublicLabel from "@/components/values/PublicLabel.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";
import MirrorLink from "@/components/MirrorLink.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import HCSContentSection from "@/components/topic/HCSContentSection.vue";
import {EntityID} from "@/utils/EntityID.ts";
import {TopicByIdCache} from "@/utils/cache/TopicByIdCache.ts";
import {HCSTopicMemo} from "@/utils/HCSTopicMemo.ts";
import {HCSAssetCache} from "@/utils/cache/HCSAssetCache.ts";


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
// HCS-1 support
//
const isHcs1Topic = computed(() =>
    topic.value !== null
    && (topic.value.admin_key?.key ?? "") === ""
    && (topic.value.submit_key?.key ?? "") !== ""
    && hcs1Memo.value !== null
)

const hcs1Memo = computed(() =>
    (topic.value !== null) ? HCSTopicMemo.parse(topic.value.memo) : null
)

const assetLookup = HCSAssetCache.instance.makeLookup(normalizedTopicId)
onMounted(() => assetLookup.mount())
onBeforeUnmount(() => assetLookup.unmount())
const hcs1Asset = assetLookup.entity

//
// Public Label
//
const indexLookup = PublicLabelsCache.instance.makeLookup()
onMounted(() => indexLookup.mount())
onBeforeUnmount(() => indexLookup.unmount())
const index = indexLookup.entity
const label = computed(() => normalizedTopicId.value ? index.value?.lookup(normalizedTopicId.value) ?? null : null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
