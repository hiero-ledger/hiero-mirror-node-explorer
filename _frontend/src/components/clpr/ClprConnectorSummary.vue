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
      <Property id="status" full-width>
        <template #name>Status</template>
        <template #value>
          <StringValue :string-value="connector.deleted ? 'Deleted' : 'Active'"/>
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
    </template>
  </DashboardCardV2>

  <DashboardCardV2>
    <template #title>
      Stake
    </template>
    <template #content>
      <Property id="lockedStake" full-width>
        <template #name>Locked Stake</template>
        <template #value>
          <HbarAmount :amount="Number(connector.locked_stake)" :decimals="2"/>
        </template>
      </Property>
      <Property id="slashCount" full-width>
        <template #name>Slashes</template>
        <template #value>
          <PlainAmount :amount="connector.slash_count"/>
        </template>
      </Property>
      <Property id="stakeRecipient" full-width>
        <template #name>Stake Recipient</template>
        <template #value>
          <AccountLink :account-id="connector.stake_recipient_id"/>
        </template>
      </Property>
      <Property id="inFlight" full-width>
        <template #name>In-flight Messages</template>
        <template #value>
          <PlainAmount :amount="connector.in_flight_message_count"/>
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        In-flight messages are the ones this connector has paid to send and that are not yet resolved: they block a
        clean deregistration. Slashing reduces the locked stake, and a connector that reaches the slash ban
        threshold is deleted.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import Property from "@/components/Property.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {ClprConnector} from "@/schemas/MirrorNodeSchemas.ts";
import {routeManager} from "@/utils/RouteManager.ts";

defineProps({
  connector: {
    type: Object as PropType<ClprConnector>,
    required: true
  }
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
