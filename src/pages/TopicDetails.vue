// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>


  <PageFrameV2 page-title="Topic Details">
    <template v-if="!initialLoading && notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2 collapsible-key="topicDetails">
      <template #title>
        {{ `Topic ${normalizedTopicId}` }}
        <div v-if="isHcs1Topic" class="h-has-pill" style="margin-top: 2px">
          HCS-1
        </div>
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
        <Property v-if="hasExemptList" id="fee-exempt-key-list" full-width>
          <template #name>Fee Exempt Key List</template>
          <template #value>
            <div class="exempt-list">
              <KeyValue
                  v-for="k in topic?.fee_exempt_key_list ?? []"
                  :key="k.key"
                  :key-bytes="k.key"
                  :key-type="k._type"
                  :show-none="true"
              />
            </div>
          </template>
        </Property>

      </template>
    </DashboardCardV2>

    <HCSContentSection v-if="isHcs1Topic" :topic-memo="hcs1Memo" :hcs1-asset="hcs1Asset"/>

    <TopicFeesSection v-if="customFees" :fees="customFees"/>

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

    <MirrorLink :network="network" entityUrl="topics" :loc="topicId"/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import {useRouter} from "vue-router";
import TopicMessageTable from "@/components/topic/TopicMessageTable.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import {EntityID} from "@/utils/EntityID";
import {TopicMessageTableController} from "@/components/topic/TopicMessageTableController";
import {TopicByIdCache} from "@/utils/cache/TopicByIdCache";
import AccountLink from "@/components/values/link/AccountLink.vue";
import Property from "@/components/Property.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {initialLoadingKey} from "@/AppKeys";
import MirrorLink from "@/components/MirrorLink.vue";
import {HCSTopicMemo} from "@/utils/HCSTopicMemo.ts";
import {HCSAssetCache} from "@/utils/cache/HCSAssetCache.ts";
import HCSContentSection from "@/components/topic/HCSContentSection.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import TopicFeesSection from "@/components/topic/TopicFeesSection.vue";

const props = defineProps({
  topicId: {
    type: String,
    required: true
  },
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)
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
const topic = topicLookup.entity

//
// messageTableController
//
const defaultPageSize = isMediumScreen ? 15 : 5
const messageTableController = new TopicMessageTableController(useRouter(), normalizedTopicId, defaultPageSize)
onMounted(() => messageTableController.mount())
onBeforeUnmount(() => messageTableController.unmount())

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
// Custom fees
//
const customFees = computed(() => topic.value?.custom_fees ?? null)
const hasExemptList = computed(() => topic.value?.fee_exempt_key_list && topic.value.fee_exempt_key_list.length > 0)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.exempt-list {
  display: flex;
  flex-direction: column;
  gap: 8px
}

</style>
