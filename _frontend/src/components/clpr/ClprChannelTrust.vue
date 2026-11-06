// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Verifier
    </template>
    <template #content>
      <Property id="verifierContract" full-width>
        <template #name>Verifier Contract</template>
        <template #value>
          <AccountLink :account-id="channel.verifier_contract_id"/>
        </template>
      </Property>
      <Property v-if="channel.verifier_contract_id" id="verifierName" full-width>
        <template #name>Contract Name</template>
        <template #value>
          <StringValue :string-value="contractName"/>
        </template>
      </Property>
      <Property id="verifierFingerprint" full-width>
        <template #name>Code Fingerprint</template>
        <template #value>
          <HexaValue :byte-string="channel.verifier_fingerprint" :show-none="true"/>
        </template>
      </Property>
      <Property v-if="channel.verifier_contract_id" id="verifierAdminKey" full-width>
        <template #name>Admin Key</template>
        <template #value>
          <KeyValue
              :key-bytes="adminKey?.key"
              :key-type="adminKey?._type"
              :show-none="true"
          />
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        A verifier is fixed for the life of a channel. The contract name is known only if the contract is verified on
        Sourcify, and an admin key tells who, if anybody, can change the contract. These are facts for vetting the
        channel, not a verdict.
      </div>
    </template>
  </DashboardCardV2>

  <DashboardCardV2>
    <template #title>
      Trust Anchor
    </template>
    <template #content>
      <Property id="trustAnchorId" full-width>
        <template #name>Anchor ID</template>
        <template #value>
          <HexaValue :byte-string="channel.trust_anchor_id" :show-none="true"/>
        </template>
      </Property>
      <Property id="trustAnchor" full-width>
        <template #name>Anchor</template>
        <template #value>
          <HexaValue :byte-string="channel.trust_anchor" :show-none="true"/>
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        The trust anchor is the verifier's current reference point on the peer (a validator set, a sync committee
        period, a block header). It advances in-band: a bundle that proves a newer anchor rotates it.
      </div>
    </template>
  </DashboardCardV2>

  <DashboardCardV2>
    <template #title>
      Running Hashes
    </template>
    <template #content>
      <Property id="sentRunningHash" full-width>
        <template #name>Outbound Running Hash</template>
        <template #value>
          <HexaValue :byte-string="channel.sent_running_hash" :show-none="true"/>
          <div v-if="channel.next_message_id !== null" class="h-is-secondary-text">
            after message {{ channel.next_message_id - 1 }}
          </div>
        </template>
      </Property>
      <Property id="receivedRunningHash" full-width>
        <template #name>Inbound Running Hash</template>
        <template #value>
          <HexaValue :byte-string="channel.received_running_hash" :show-none="true"/>
          <div v-if="channel.received_message_id !== null" class="h-is-secondary-text">
            after peer message {{ channel.received_message_id }}
          </div>
        </template>
      </Property>
    </template>
    <template #footer>
      <div class="note">
        Each queue keeps a running hash: SHA-256 of the previous hash and the newest message. Both sides must agree
        on these for a bundle to be accepted.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import Property from "@/components/Property.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import StringValue from "@/components/values/StringValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {ClprChannel} from "@/schemas/MirrorNodeSchemas.ts";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";

const props = defineProps({
  channel: {
    type: Object as PropType<ClprChannel>,
    required: true
  }
})

// The verifier contract is looked up on the mirror node (admin key) and on Sourcify (name, if verified there)
const contractAnalyzer = new ContractAnalyzer(computed(() => props.channel.verifier_contract_id))
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())

const contractName = contractAnalyzer.contractName
const adminKey = computed(() => contractAnalyzer.report.value?.contractInfo?.admin_key ?? null)

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
