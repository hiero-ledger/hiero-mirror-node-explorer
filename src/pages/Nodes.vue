// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Nodes">

    <DashboardCardV2 v-if="enableStaking" collapsible-key="networkDetails">
      <template #title>
        <span>Network</span>
      </template>

      <template #content>
        <div class="network-dashboard">
          <NetworkDashboardItemV2
              title="LAST STAKED"
              :value="formatSeconds((elapsedMin??0)*60) + ' ago'"
          />
          <NetworkDashboardItemV2
              title="NEXT STAKING PERIOD"
              :value="'in ' + formatSeconds((remainingMin??0)*60)"
          />
          <NetworkDashboardItemV2
              title="STAKING PERIOD"
              :value="formatSeconds((durationMin??0)*60)"
          />
          <NetworkDashboardItemV2
              :unit=cryptoName
              title="TOTAL STAKED"
              :value="makeFloorHbarAmount(stakeTotal)"
              :tooltip-label="stakeTotalTooltip"
          />
          <NetworkDashboardItemV2
              :unit=cryptoName
              title="STAKED FOR REWARD"
              :value="makeFloorHbarAmount(stakeRewardedTotal)"
              :tooltip-label="stakeRewardedTotalTooltip"
          />
          <NetworkDashboardItemV2
              :unit=cryptoName
              title="MAXIMUM STAKED FOR REWARD"
              :value="makeFloorHbarAmount(maxStakeRewarded)"
              :tooltip-label="maxStakeRewardedTooltip"
          />
          <NetworkDashboardItemV2
              :unit=cryptoName
              title="REWARDED LAST PERIOD"
              :value="makeFloorHbarAmount(totalRewarded)"
              :tooltip-label="totalRewardedTooltip"
          />
          <NetworkDashboardItemV2
              title="MAXIMUM REWARD RATE"
              :value="makeAnnualizedRate(maxRewardRate)"
              :tooltip-label="maxRewardRateTooltip"
          />
          <NetworkDashboardItemV2
              title="CURRENT REWARD RATE"
              :value="makeAnnualizedRate(rewardRate)"
              :tooltip-label="rewardRateTooltip"
          />
        </div>
      </template>
    </DashboardCardV2>

    <DashboardCardV2>
      <template #title>
        Map
      </template>
      <template #content>
        <NodeMap :nodes="nodes"/>
      </template>
    </DashboardCardV2>

    <DashboardCardV2 collapsible-key="nodes">
      <template #title>
        <span>{{ `${nodes.length}  Nodes` }}</span>
      </template>
      <template #content>
        <NodeTable :nodes="nodes" :stake-total="totalStakeForConsensus"/>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NodeTable from "@/components/node/NodeTable.vue";
import {formatSeconds} from "@/utils/Duration";
import {StakeCache} from "@/utils/cache/StakeCache";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer";
import {makeAnnualizedRate} from "@/schemas/MirrorNodeUtils.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NetworkDashboardItemV2 from "@/components/node/NetworkDashboardItemV2.vue";
import NodeMap from "@/components/node/NodeMap.vue";
import {routeManager} from "@/utils/RouteManager.ts";

defineProps({
  network: String
})

const cryptoName = CoreConfig.inject().cryptoName

const stakeTotalTooltip = `Total amount of ${cryptoName} staked to all validators for consensus.`
const stakeRewardedTotalTooltip = `Total amount of ${cryptoName} staked for reward.`
const maxStakeRewardedTooltip = `Maximum amount of ${cryptoName} that can be staked for reward while still achieving the maximum reward rate.`
const totalRewardedTooltip = `Total amount of ${cryptoName} paid in reward for the last period.`
const maxRewardRateTooltip = "Approximate annual reward rate based on the maximum reward rate that any account can receive in a day."
const rewardRateTooltip = "Approximate annual reward rate based on the reward earned during the last 24h period."

const networkNodeAnalyzer = new NetworkAnalyzer()
onMounted(() => networkNodeAnalyzer.mount())
onBeforeUnmount(() => networkNodeAnalyzer.unmount())

const stakeLookup = StakeCache.instance.makeLookup()
onMounted(() => stakeLookup.mount())
onBeforeUnmount(() => stakeLookup.unmount())

const stakeTotal = computed(() => stakeLookup.entity.value?.stake_total ?? 0)
const maxStakeRewarded = computed(() => stakeLookup.entity.value?.max_stake_rewarded ?? 0)
const rewardRate = computed(() => {
  return networkNodeAnalyzer.stakeRewardedTotal.value != 0
      ? (stakeLookup.entity.value?.staking_reward_rate ?? 0) / networkNodeAnalyzer.stakeRewardedTotal.value * 100000000
      : 0
})
const maxRewardRate = computed(() => stakeLookup.entity.value?.max_staking_reward_rate_per_hbar ?? 0)

const makeFloorHbarAmount = (tinyBarAmount: number) => Math.floor((tinyBarAmount ?? 0) / 100000000).toLocaleString('en-US')

const enableStaking = routeManager.enableStaking
const nodes = networkNodeAnalyzer.nodes
const totalStakeForConsensus = networkNodeAnalyzer.totalStakeForConsensus
const stakeRewardedTotal = networkNodeAnalyzer.stakeRewardedTotal
const totalRewarded = networkNodeAnalyzer.totalRewarded
const durationMin = networkNodeAnalyzer.durationMin
const elapsedMin = networkNodeAnalyzer.elapsedMin
const remainingMin = networkNodeAnalyzer.remainingMin

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.network-dashboard {
  display: grid;
  gap: 24px;
  grid-auto-flow: column;
  grid-template-rows: repeat(9, auto);
}

@media (min-width: 768px) {
  div.network-dashboard {
    grid-template-rows: repeat(5, auto);
    justify-content: space-between;
  }
}

@media (min-width: 1080px) {
  div.network-dashboard {
    grid-template-rows: repeat(3, auto);
    justify-content: space-between;
  }
}

</style>
