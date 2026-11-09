// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Ledger Configuration
    </template>
    <template #content>
      <Property id="chainId" :full-width="!sideBySide">
        <template #name>Chain ID</template>
        <template #value>
          <StringValue :string-value="configuration.chain_id"/>
        </template>
      </Property>
      <Property id="serviceAddress" :full-width="!sideBySide">
        <template #name>CLPR Service Address</template>
        <template #value>
          <HexaValue :byte-string="configuration.service_address" :show-none="true"/>
        </template>
      </Property>
      <Property id="protocolVersion" :full-width="!sideBySide">
        <template #name>Protocol Version</template>
        <template #value>
          <PlainAmount :amount="configuration.protocol_version"/>
        </template>
      </Property>
      <Property id="maxMessagesPerBundle" :full-width="!sideBySide">
        <template #name>Max Messages per Bundle</template>
        <template #value>
          <PlainAmount :amount="throttles.max_messages_per_bundle ?? undefined"/>
        </template>
      </Property>
      <Property id="maxPayload" :full-width="!sideBySide">
        <template #name>Max Message Payload</template>
        <template #value>
          <StringValue :string-value="formatBytes(throttles.max_message_payload_bytes)"/>
        </template>
      </Property>
      <Property id="maxGas" :full-width="!sideBySide">
        <template #name>Max Gas per Message</template>
        <template #value>
          <PlainAmount :amount="throttles.max_gas_per_message ?? undefined"/>
        </template>
      </Property>
      <Property id="maxQueueDepth" :full-width="!sideBySide">
        <template #name>Max Queue Depth</template>
        <template #value>
          <PlainAmount :amount="throttles.max_queue_depth ?? undefined"/>
        </template>
      </Property>
      <Property id="maxSync" :full-width="!sideBySide">
        <template #name>Max Sync Size</template>
        <template #value>
          <StringValue :string-value="formatBytes(throttles.max_sync_bytes)"/>
        </template>
      </Property>
      <Property id="maxLocalEndpoints" :full-width="!sideBySide">
        <template #name>Max Local Endpoints</template>
        <template #value>
          <PlainAmount :amount="throttles.max_local_endpoints ?? undefined"/>
        </template>
      </Property>
      <Property id="maxPeerEndpoints" :full-width="!sideBySide">
        <template #name>Max Peer Endpoints</template>
        <template #value>
          <PlainAmount :amount="throttles.max_peer_endpoints ?? undefined"/>
        </template>
      </Property>
      <Property id="initialTrustAnchor" :full-width="!sideBySide">
        <template #name>Initial Trust Anchor</template>
        <template #value>
          <HexaValue :byte-string="configuration.initial_trust_anchor_id" :show-none="true"/>
        </template>
      </Property>
      <Property id="effectiveSince" :full-width="!sideBySide">
        <template #name>In Effect Since</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="configuration.consensus_timestamp"/>
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        Peers learn this configuration in-band through control messages.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import Property from "@/components/Property.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {CLPR_MOCK_LEDGER_CONFIGURATION} from "@/components/clpr/ClprMockData.ts";

// The two configuration cards are displayed side by side on extra large screens: the label column is then wider
const sideBySide = inject('isXLargeScreen', false)

// Static mockup data, to be replaced by a call to GET /api/v1/clpr/configuration
const configuration = CLPR_MOCK_LEDGER_CONFIGURATION
const throttles = computed(() => configuration.throttles)

const formatBytes = (n: number | null): string | null => n !== null ? n.toLocaleString() + " bytes" : null

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
