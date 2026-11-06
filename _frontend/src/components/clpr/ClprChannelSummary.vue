// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Overview
    </template>
    <template #content>
      <Property id="channelId" full-width>
        <template #name>Channel ID</template>
        <template #value>
          <HexaValue :byte-string="channel.channel_id" :show-none="true"/>
        </template>
      </Property>
      <Property id="chainId" full-width>
        <template #name>Peer Chain ID</template>
        <template #value>
          <StringValue :string-value="channel.chain_id"/>
        </template>
      </Property>
      <Property id="status" full-width>
        <template #name>Status</template>
        <template #value>
          <ClprChannelStatusLabel :status="channel.status"/>
        </template>
      </Property>
      <Property id="lastUpdated" full-width>
        <template #name>Last Status or Anchor Change</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="channel.timestamp?.from"/>
        </template>
      </Property>
      <Property id="verifier" full-width>
        <template #name>Verifier</template>
        <template #value>
          <StringValue :string-value="channel.verifier_contract_id"/>
        </template>
      </Property>
      <Property id="verifierFingerprint" full-width>
        <template #name>Verifier Fingerprint</template>
        <template #value>
          <HexaValue :byte-string="channel.verifier_fingerprint" :show-none="true"/>
        </template>
      </Property>
      <Property id="trustAnchor" full-width>
        <template #name>Trust Anchor</template>
        <template #value>
          <HexaValue :byte-string="channel.trust_anchor_id" :show-none="true"/>
        </template>
      </Property>
      <Property id="ownershipCommitment" full-width>
        <template #name>Ownership Commitment</template>
        <template #value>
          <HexaValue :byte-string="channel.ownership_commitment" :show-none="true"/>
        </template>
      </Property>
      <Property id="created" full-width>
        <template #name>Created</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="channel.created_timestamp"/>
        </template>
      </Property>
    </template>
  </DashboardCardV2>

  <DashboardCardV2>
    <template #title>
      Queues
    </template>
    <template #content>
      <Property id="nextMessageId" full-width>
        <template #name>Next Message ID</template>
        <template #value>
          <PlainAmount :amount="channel.next_message_id ?? undefined"/>
        </template>
      </Property>
      <Property id="ackedMessageId" full-width>
        <template #name>Acknowledged Through</template>
        <template #value>
          <PlainAmount :amount="channel.acked_message_id ?? undefined"/>
        </template>
      </Property>
      <Property id="backlog" full-width>
        <template #name>Outbound Backlog</template>
        <template #value>
          <PlainAmount :amount="backlog"/>
        </template>
      </Property>
      <Property id="receivedMessageId" full-width>
        <template #name>Received Through</template>
        <template #value>
          <PlainAmount :amount="channel.received_message_id ?? undefined"/>
          <span v-if="channel.received_message_id !== null" class="h-is-secondary-text"> (peer message ID)</span>
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        Backlog = next message ID − 1 − acknowledged through. A backlog that keeps growing while the channel is ACTIVE
        means the peer has stopped acknowledging.
      </div>
    </template>
  </DashboardCardV2>

  <DashboardCardV2>
    <template #title>
      Peer
    </template>
    <template #content>
      <Property id="manifest" full-width>
        <template #name>Peer Endpoint Manifest</template>
        <template #value>
          <template v-if="channel.endpoint_manifest">
            <div>
              v{{ channel.endpoint_manifest.version }}
              <span class="h-is-secondary-text">({{ channel.endpoint_manifest.endpoints.length }} endpoint(s))</span>
            </div>
            <div v-for="(e, i) in channel.endpoint_manifest.endpoints" :key="i">
              {{ e.service_endpoint.ip_address }}:{{ e.service_endpoint.port }}
            </div>
          </template>
          <span v-else class="h-is-low-contrast">None</span>
        </template>
      </Property>
      <Property id="throttles" full-width>
        <template #name>Peer Throttles</template>
        <template #value>
          <template v-if="throttleLines.length">
            <div v-for="line in throttleLines" :key="line">{{ line }}</div>
          </template>
          <span v-else class="h-is-low-contrast">None</span>
        </template>
      </Property>
      <Property id="lastConfig" full-width>
        <template #name>Last Config Update</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="channel.last_config_timestamp"/>
        </template>
      </Property>
      <Property id="peerConfig" full-width>
        <template #name>Config Acknowledged by Peer</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="channel.peer_config_timestamp"/>
        </template>
      </Property>
    </template>
  </DashboardCardV2>

  <DashboardCardV2 v-if="isClosing">
    <template #title>
      Closing Progress
    </template>
    <template #content>
      <Property id="outboundLeft" full-width>
        <template #name>Outbound Messages Left</template>
        <template #value>
          <PlainAmount :amount="backlog"/>
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        A closing channel accepts no new messages and waits for every outstanding message and response to be
        delivered. It becomes DRAINED when both sides are empty, then CLOSED.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import Property from "@/components/Property.vue";
import ClprChannelStatusLabel from "@/components/clpr/ClprChannelStatusLabel.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {ClprChannel, ClprChannelStatus} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  channel: {
    type: Object as PropType<ClprChannel>,
    required: true
  }
})

// Messages sent by this ledger and not yet acknowledged by the peer
const backlog = computed(() =>
    props.channel.next_message_id !== null && props.channel.acked_message_id !== null
        ? props.channel.next_message_id - 1 - props.channel.acked_message_id
        : undefined)

const isClosing = computed(() =>
    props.channel.status === ClprChannelStatus.CLOSING || props.channel.status === ClprChannelStatus.DRAINED)

const throttleLines = computed(() => {
  const t = props.channel.peer_throttles
  const result: string[] = []
  if (t !== null) {
    if (t.max_messages_per_bundle !== null) result.push(t.max_messages_per_bundle.toLocaleString() + " messages per bundle")
    if (t.max_message_payload_bytes !== null) result.push(t.max_message_payload_bytes.toLocaleString() + " bytes per payload")
    if (t.max_gas_per_message !== null) result.push(t.max_gas_per_message.toLocaleString() + " gas per message")
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.note {
  color: var(--text-secondary);
  font-size: 12px;
}

</style>
