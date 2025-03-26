// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Node Details">

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2>
      <template #title>
        {{ `Node ${nodeIdNb}` }}
      </template>

      <template #left-content>
        <Property id="nodeAccount">
          <template #name>Node Account</template>
          <template #value>
            <AccountLink :accountId="node?.node_account_id"/>
          </template>
        </Property>
        <Property id="description">
          <template #name>Description</template>
          <template #value>
            <BlobValue :base64="false" :blob-value="nodeDescription" :show-none="true"/>
          </template>
        </Property>
        <Property id="file">
          <template #name>Address Book File</template>
          <template #value>
            <StringValue :string-value="node?.file_id"/>
          </template>
        </Property>
        <Property id="rangeFrom">
          <template #name>Node existed since</template>
          <template #value>
            <TimestampValue :show-none="true" :timestamp="node?.timestamp?.from"/>
          </template>
        </Property>
        <Property id="rangeTo">
          <template #name>Node expiry date</template>
          <template #value>
            <TimestampValue :show-none="true" :timestamp="node?.timestamp?.to"/>
          </template>
        </Property>
        <Property id="serviceEndpoints">
          <template #name>Service Endpoints</template>
          <template #value>
            <Endpoints :endpoints="node?.service_endpoints"></Endpoints>
          </template>
        </Property>
        <Property id="adminKey">
          <template #name>Admin Key</template>
          <template #value>
            <KeyValue
                :node-id="nodeIdNb"
                :key-bytes="node?.admin_key?.key"
                :key-type="node?.admin_key?._type"
                :show-none="true"
            />
          </template>
        </Property>
        <template v-if="enableStaking">
          <Property id="publicKey">
            <template #name>Public Key</template>
            <template #value>
              <KeyValue :key-bytes="node?.public_key" :show-none="true" key-type="RSA"/>
            </template>
          </Property>
          <Property id="nodeCertHash">
            <template #name>Certificate Hash</template>
            <template #value>
              <HexaValue :byteString="formattedHash" :show-none="true"/>
            </template>
          </Property>
        </template>
      </template>

      <template v-if="enableStaking" #right-content>
        <div class="dashboard-items">
          <NetworkDashboardItemV2
              id="yearlyRate"
              title="Last Period Reward Rate"
              :value="node ? annualizedRate.toString() : null"
              unit="APPROX ANNUAL EQUIVALENT"
          />
          <NetworkDashboardItemV2
              id="consensusStake"
              title="Stake for Consensus"
              :value="node ? makeFloorHbarAmount(stake) : null"
              :unit=cryptoName
              :info-label="stakeLabel"
              :extra="stake > 0 ? `${stakePercentage} of total` : undefined"
          />
          <NetworkDashboardItemV2
              id="rewarded"
              title="Staked for Reward"
              :value="node ? makeFloorHbarAmount(stakeRewarded): null"
              :unit=cryptoName
              :extra="`${stakeRewardedPercentage}% of total`"
          />
          <NetworkDashboardItemV2
              id="notRewarded"
              title="Staked For No Reward"
              :value="node ? makeFloorHbarAmount(stakeUnrewarded) : null"
              :unit=cryptoName
              :extra="`${stakeUnrewardedPercentage}% of total`"
          />
          <NetworkDashboardItemV2
              id="minStake"
              title="Min Stake"
              :value="node ? makeFloorHbarAmount(minStake) : null"
              :unit=cryptoName
          />
          <NetworkDashboardItemV2
              id="maxStake"
              title="Max Stake"
              :value="node ? makeFloorHbarAmount(maxStake) :  null"
              :unit=cryptoName
          />
          <NetworkDashboardItemV2
              title="Current Staking Period"
              id="stakingPeriod"
              :value="node ? '24' : null"
              unit="HOURS"
              extra="from 00:00 am today to 11:59 pm today UTC"
          />
        </div>
      </template>

      <template v-else #right-content>
        <Property id="publicKey">
          <template #name>Public Key</template>
          <template #value>
            <KeyValue :key-bytes="node?.public_key" :show-none="true" key-type="RSA"/>
          </template>
        </Property>
        <Property id="nodeCertHash">
          <template #name>Certificate Hash</template>
          <template #value>
            <HexaDumpValue :byteString="formattedHash" :show-none="true"/>
          </template>
        </Property>
      </template>
    </DashboardCardV2>

    <MirrorLink :network="props.network" entityUrl="network/nodes" :query="`node.id=${props.nodeId}`"/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import KeyValue from "@/components/values/KeyValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import StringValue from "@/components/values/StringValue.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Property from "@/components/Property.vue";
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";
import Endpoints from "@/components/values/Endpoints.vue";
import {StakeCache} from "@/utils/cache/StakeCache";
import {PathParam} from "@/utils/PathParam";
import {NodeAnalyzer} from "@/utils/analyzer/NodeAnalyzer";
import {NetworkNode} from "@/schemas/MirrorNodeSchemas";
import {makeStakePercentage} from "@/schemas/MirrorNodeUtils.ts";
import {routeManager} from "@/router";
import {CoreConfig} from "@/config/CoreConfig.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NetworkDashboardItemV2 from "@/components/node/NetworkDashboardItemV2.vue";
import MirrorLink from "@/components/MirrorLink.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import {loadingKey} from "@/AppKeys.ts";

const props = defineProps({
  nodeId: {
    type: String,
    required: true
  },
  network: String
})

const cryptoName = CoreConfig.inject().cryptoName
const loading = inject(loadingKey, ref(false))

const nodeIdNb = computed(() => PathParam.parseNodeId(props.nodeId))
const nodeAnalyzer = new NodeAnalyzer(nodeIdNb)
onMounted(() => nodeAnalyzer.mount())
onBeforeUnmount(() => nodeAnalyzer.unmount())
const networkAnalyzer = nodeAnalyzer.networkAnalyzer // Mounted / unmounted by nodeAnalyzer

const stakeLookup = StakeCache.instance.makeLookup()
onMounted(() => stakeLookup.mount())
onBeforeUnmount(() => stakeLookup.unmount())

const stakePercentage = computed(() =>
    nodeAnalyzer.node.value && totalStakeForConsensus.value
        ? makeStakePercentage(nodeAnalyzer.node.value as NetworkNode, totalStakeForConsensus.value)
        : "0"
)
const stakeLabel = computed(() =>
    nodeAnalyzer.stake.value === 0
        ? 'Stake for consensus is 0 because (Staked for Reward + Staked For No Reward) was less than Min Stake at the beginning of the current staking period.'
        : null
)
const stakeRewardedPercentage = computed(() =>
    networkAnalyzer.stakeRewardedTotal.value != 0 ? Math.round(nodeAnalyzer.stakeRewarded.value / networkAnalyzer.stakeRewardedTotal.value * 10000) / 100 : 0
)
const stakeUnrewardedPercentage = computed(() =>
    networkAnalyzer.stakeUnrewardedTotal.value != 0 ? Math.round(nodeAnalyzer.stakeUnrewarded.value / networkAnalyzer.stakeUnrewardedTotal.value * 10000) / 100 : 0
)

const notification = computed(() => {
  let result: string | null
  if (!loading.value && node.value === null) {
    result = "Node with ID " + props.nodeId + " was not found"
  } else {
    result = null
  }
  return result
})

const makeFloorHbarAmount = (tinyBarAmount: number) => {
  return Math.floor((tinyBarAmount ?? 0) / 100000000).toLocaleString('en-US')
}

const enableStaking = routeManager.enableStaking
const node = nodeAnalyzer.node
const totalStakeForConsensus = networkAnalyzer.totalStakeForConsensus
const annualizedRate = nodeAnalyzer.annualizedRate
const stake = nodeAnalyzer.stake
const minStake = nodeAnalyzer.minStake
const maxStake = nodeAnalyzer.maxStake
const stakeRewarded = nodeAnalyzer.stakeRewarded
const stakeUnrewarded = nodeAnalyzer.stakeUnrewarded
const nodeDescription = nodeAnalyzer.nodeDescription
const formattedHash = nodeAnalyzer.certificateHash

</script>

<style scoped>

div.dashboard-items {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

</style>
