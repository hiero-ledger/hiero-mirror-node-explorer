// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Message {{ props.messageId }}
    </template>

    <template v-if="notification" #notification>
      <NotificationBanner :message="notification"/>
    </template>

    <template #content>
      <Property id="channelId" full-width>
        <template #name>Channel</template>
        <template #value>
          <HexaValue :byte-string="message?.channel_id ?? null" :show-none="true"/>
        </template>
      </Property>
      <Property id="messageId" full-width>
        <template #name>Message ID</template>
        <template #value>
          <PlainAmount :amount="message?.message_id"/>
        </template>
      </Property>
      <Property id="type" full-width>
        <template #name>Type</template>
        <template #value>
          <StringValue :string-value="message?.type"/>
        </template>
      </Property>
      <Property id="sender" full-width>
        <template #name>Sender</template>
        <template #value>
          <HexaValue :byte-string="message?.sender ?? null" :show-none="true"/>
        </template>
      </Property>
      <Property id="targetApplication" full-width>
        <template #name>Target Application</template>
        <template #value>
          <HexaValue :byte-string="message?.target_application ?? null" :show-none="true"/>
        </template>
      </Property>
      <Property id="connectorId" full-width>
        <template #name>Connector</template>
        <template #value>
          <HexaValue :byte-string="message?.connector_id ?? null" :show-none="true"/>
        </template>
      </Property>
      <Property id="acknowledged" full-width>
        <template #name>Acknowledged</template>
        <template #value>
          <StringValue :string-value="message ? (message.acknowledged ? 'Yes' : 'No') : null"/>
        </template>
      </Property>
      <Property id="replyStatus" full-width>
        <template #name>Response Status</template>
        <template #value>
          <StringValue :string-value="message?.reply_status ?? null"/>
        </template>
      </Property>
      <Property v-if="message?.reply_to_message_id != null" id="replyTo" full-width>
        <template #name>In Reply To</template>
        <template #value>
          <router-link v-if="replyToExists" :to="routeManager.makeRouteToClprMessage(message.channel_id, message.reply_to_message_id)">
            Message {{ message.reply_to_message_id }}
          </router-link>
          <span v-else>Peer message {{ message.reply_to_message_id }}</span>
        </template>
      </Property>
      <Property id="size" full-width>
        <template #name>Size</template>
        <template #value>
          <StringValue :string-value="size !== null ? size + ' bytes' : null"/>
        </template>
      </Property>
      <Property id="timestamp" full-width>
        <template #name>Enqueued</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="message?.timestamp"/>
        </template>
      </Property>
    </template>
  </DashboardCardV2>

  <DashboardCardV2 v-if="message">
    <template #title>
      Lifecycle
    </template>
    <template #content>
      <ol class="timeline">
        <li v-for="(step, i) in steps" :key="i" :class="{pending: step.pending}">
          <div class="t-title">{{ step.title }}</div>
          <div class="t-meta">
            <TimestampValue v-if="step.timestamp" :timestamp="step.timestamp"/>
            <span v-else>{{ step.meta }}</span>
          </div>
        </li>
      </ol>
    </template>
  </DashboardCardV2>

  <DashboardCardV2 v-if="message">
    <template #title>
      Payload
    </template>
    <template #right-control>
      <span v-if="size !== null" class="h-is-secondary-text">{{ size }} bytes</span>
    </template>
    <template #content>
      <HexaDumpValue :byte-string="message.message_data" :show-none="true" :word-wrap-medium="64" :word-wrap-small="32"/>
    </template>
  </DashboardCardV2>

  <DashboardCardV2 v-if="message">
    <template #title>
      Running Hashes
    </template>
    <template #content>
      <Property id="previousRunningHash" full-width>
        <template #name>Previous Running Hash</template>
        <template #value>
          <HexaValue :byte-string="previousRunningHash" :show-none="true"/>
        </template>
      </Property>
      <Property id="runningHash" full-width>
        <template #name>Running Hash After</template>
        <template #value>
          <HexaValue :byte-string="message.running_hash" :show-none="true"/>
        </template>
      </Property>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Property from "@/components/Property.vue";
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {ClprMessageType} from "@/schemas/MirrorNodeSchemas.ts";
import {getClprMockMessage, getClprMockPreviousRunningHash} from "@/components/clpr/ClprMockData.ts";

const props = defineProps({
  channelId: {
    type: String,
    required: true
  },
  messageId: {
    type: String,
    required: true
  },
  network: String
})

// Static mockup data, to be replaced by a call to GET /api/v1/clpr/channels/{channelId}/messages
const message = computed(() => getClprMockMessage(props.channelId, Number(props.messageId)))
const notification = computed(() =>
    message.value === null ? "CLPR message " + props.messageId + " not found in channel " + props.channelId : null)

const replyToExists = computed(() =>
    message.value?.reply_to_message_id != null
    && getClprMockMessage(message.value.channel_id, message.value.reply_to_message_id) !== null)

// Number of bytes of the 0x-prefixed hex message_data
const size = computed(() => {
  const data = message.value?.message_data ?? null
  return data !== null ? Math.max(data.length - 2, 0) / 2 : null
})

const previousRunningHash = computed(() =>
    message.value !== null ? getClprMockPreviousRunningHash(message.value) : null)

interface Step {
  title: string
  timestamp?: string
  meta?: string
  pending?: boolean
}

// Lifecycle limited to what the API tells (no bundle or transaction evidence available yet)
const steps = computed<Step[]>(() => {
  const m = message.value
  const result: Step[] = []
  if (m !== null) {
    if (m.type === ClprMessageType.RESPONSE) {
      result.push({
        title: "In reply to peer message " + m.reply_to_message_id,
        meta: "Dispatched here with result " + (m.reply_status ?? "unknown")
      })
    }
    result.push({title: m.type === ClprMessageType.CONTROL ? "Enqueued by administrator" : "Enqueued on this ledger", timestamp: m.timestamp})
    result.push(m.acknowledged
        ? {title: "Acknowledged by peer", meta: "Reported in a bundle received from the peer"}
        : {title: "Acknowledged by peer", meta: "Not yet: the peer's next bundle will carry the acknowledgement", pending: true})
    if (m.type === ClprMessageType.DATA) {
      result.push(m.reply_status !== null
          ? {title: "Response received: " + m.reply_status, meta: "Carried in a bundle received from the peer"}
          : {title: "Response received", meta: "Not yet", pending: true})
    }
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

ol.timeline {
  list-style: none;
  margin: 0;
  padding: 0;
}

ol.timeline li {
  border-left: 2px solid var(--text-secondary);
  padding: 0 0 16px 16px;
}

ol.timeline li.pending {
  border-left-style: dashed;
  opacity: 0.7;
}

ol.timeline li:last-child {
  padding-bottom: 0;
}

div.t-title {
  font-weight: 600;
}

div.t-meta {
  color: var(--text-secondary);
  font-size: 12px;
}

</style>
