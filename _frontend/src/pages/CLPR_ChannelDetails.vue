// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <NotificationBanner v-if="notification" :message="notification"/>

  <template v-if="channel">
    <div class="channel-header">
      <h2 class="channel-title">
        Channel {{ shortenHex(channel.channel_id ?? props.channelId) }}
      </h2>
      <span class="channel-status">{{ channel.status }}</span>
    </div>
    <Tabs
        :selected-tab="selectedTab"
        :tab-ids="tabIds"
        :tab-labels="tabLabels"
        :sub-tabs="true"
        @update:selected-tab="selectedTab = $event"
    />
  </template>

  <template v-if="channel">
    <ClprChannelSummary v-if="selectedTab === 'summary'" :channel="channel"/>
    <ClprMessagesCard v-else-if="selectedTab === 'messages'" :channel-id="channel.channel_id!"/>
    <ClprConnectorsCard v-else-if="selectedTab === 'connectors'" :channel-id="channel.channel_id!"/>
    <DashboardCardV2 v-else>
      <template #title>
        {{ tabLabels[tabIds.indexOf(selectedTab ?? '')] }}
      </template>
      <template #content>
        <span class="h-is-secondary-text">Coming soon</span>
      </template>
    </DashboardCardV2>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ref} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Tabs from "@/components/Tabs.vue";
import ClprMessagesCard from "@/components/clpr/ClprMessagesCard.vue";
import ClprConnectorsCard from "@/components/clpr/ClprConnectorsCard.vue";
import ClprChannelSummary from "@/components/clpr/ClprChannelSummary.vue";
import {getClprMockChannel} from "@/components/clpr/ClprMockData.ts";
import {shortenHex} from "@/components/clpr/ClprUtils.ts";

const props = defineProps({
  channelId: {
    type: String,
    required: true
  },
  network: String
})

// Static mockup data, to be replaced by a call to GET /api/v1/clpr/channels?channel.id=eq:{channelId}
const channel = computed(() => getClprMockChannel(props.channelId))
const notification = computed(() =>
    channel.value === null ? "CLPR channel " + props.channelId + " not found" : null)

const tabIds = ['summary', 'messages', 'connectors', 'trust']
const tabLabels = ['Summary', 'Messages', 'Connectors', 'Verifier & Trust']
const selectedTab = ref<string | null>(tabIds[0])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.channel-header {
  align-items: baseline;
  display: flex;
  gap: 12px;
  margin: 8px 0 12px 0;
}

h2.channel-title {
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

span.channel-status {
  color: var(--text-secondary);
  font-size: 12px;
}

</style>
