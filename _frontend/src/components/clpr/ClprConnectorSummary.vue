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
      <Property id="connectorId" full-width>
        <template #name>Connector ID</template>
        <template #value>
          <HexaValue :byte-string="connector.connector_id" :show-none="true"/>
        </template>
      </Property>
      <Property id="channel" full-width>
        <template #name>Channel</template>
        <template #value>
          <router-link :to="routeManager.makeRouteToClprChannel(connector.channel_id)">
            <HexaValue :byte-string="connector.channel_id" :copyable="false"/>
          </router-link>
        </template>
      </Property>
      <Property id="contract" full-width>
        <template #name>Connector Contract</template>
        <template #value>
          <AccountLink :account-id="connector.connector_contract_id"/>
        </template>
      </Property>
      <Property id="adminKey" full-width>
        <template #name>Admin Key</template>
        <template #value>
          <KeyValue :key-bytes="connector.admin_key?.key" :key-type="connector.admin_key?._type" :show-none="true"/>
        </template>
      </Property>
      <Property id="state" full-width>
        <template #name>State</template>
        <template #value>
          <ClprConnectorStateLabel :connector="connector"/>
        </template>
      </Property>
      <Property id="created" full-width>
        <template #name>Created</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="connector.created_timestamp"/>
        </template>
      </Property>
      <Property id="lastUpdated" full-width>
        <template #name>Last Updated</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="connector.timestamp.from"/>
        </template>
      </Property>
      <Property id="stakeRecipient" full-width>
        <template #name>Stake Recipient</template>
        <template #value>
          <AccountLink :account-id="connector.stake_recipient_id"/>
        </template>
      </Property>
    </template>
  </DashboardCardV2>

  <DashboardCardV2>
    <template #title>
      Limits
    </template>
    <template #content>
      <Property id="lockedStake" full-width>
        <template #name>Locked Stake</template>
        <template #value>
          <HbarAmount :amount="stake" :decimals="2"/>
          <span class="h-is-secondary-text"> minimum {{ formatHbar(CLPR_ECONOMICS.minLockedStake) }}</span>
          <ClprBar
              :value="stake"
              :max="CLPR_ECONOMICS.minLockedStake * 2"
              :level="stake < CLPR_ECONOMICS.minLockedStake ? 'bad' : ''"
          />
        </template>
      </Property>
      <Property id="slashCount" full-width>
        <template #name>Slashes</template>
        <template #value>
          <PlainAmount :amount="connector.slash_count"/>
          <span class="h-is-secondary-text">
            ban at {{ CLPR_ECONOMICS.slashBanThreshold }} · next penalty {{ formatHbar(getNextPenalty(connector.slash_count)) }}
          </span>
          <ClprBar
              :value="connector.slash_count"
              :max="CLPR_ECONOMICS.slashBanThreshold"
              :level="connector.slash_count >= CLPR_ECONOMICS.slashBanThreshold - 1 ? 'bad' : connector.slash_count ? 'warn' : ''"
          />
        </template>
      </Property>
      <Property id="inFlight" full-width>
        <template #name>In-flight Messages</template>
        <template #value>
          <PlainAmount :amount="connector.in_flight_message_count"/>
          <span class="h-is-secondary-text"> quota {{ quota.toLocaleString() }}</span>
          <ClprBar :value="connector.in_flight_message_count" :max="quota" level="info"/>
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        Each bar compares this connector with the economic configuration in force. In-flight messages are what
        blocks a clean deregistration. A connector that reaches the slash ban threshold is deleted.
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
import HbarAmount from "@/components/values/HbarAmount.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import ClprBar from "@/components/clpr/ClprBar.vue";
import ClprConnectorStateLabel from "@/components/clpr/ClprConnectorStateLabel.vue";
import {CLPR_ECONOMICS, getConnectorQuota, getNextPenalty} from "@/components/clpr/ClprEconomics.ts";
import {CLPR_MOCK_LEDGER_CONFIGURATION} from "@/components/clpr/ClprMockData.ts";
import {ClprConnector} from "@/schemas/MirrorNodeSchemas.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  connector: {
    type: Object as PropType<ClprConnector>,
    required: true
  }
})

const stake = computed(() => Number(props.connector.locked_stake))

// The quota is a share of the max queue depth of the ledger configuration
// (mock for now, to be replaced by GET /api/v1/clpr/configuration)
const quota = getConnectorQuota(CLPR_MOCK_LEDGER_CONFIGURATION.throttles.max_queue_depth ?? 0)

const formatHbar = (tinybars: number): string => (tinybars / 100_000_000).toLocaleString() + " ℏ"

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
