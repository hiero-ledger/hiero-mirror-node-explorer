// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Staking">

    <template v-if="temporaryBanner" #banner>
      <NotificationBanner :message="temporaryBanner" :is-error="false"/>
    </template>

    <UpdateAccountDialog
        v-model:show-dialog="changeStakingDialogVisible"
        :staking-only="true"
        @updated="stakingChanged"
    />

    <StopStakingDialog v-model:show-dialog="stopStakingDialogVisible"
                       :account-id="accountId"
                       v-on:staking-changed="stakingChanged"/>

    <DashboardCardV2 v-if="enableWallet">
      <template #title>
        <span>My Staking </span>
        <template v-if="accountId">
          <span> for account </span>
          <AccountLink :account-id="accountId"/>
        </template>
      </template>

      <template #content>

        <div class="my-staking-section">

          <template v-if="accountId">

            <div class="my-staking-dashboard">
              <NetworkDashboardItemV2
                  title="STAKED TO"
                  :value="stakedTo"
                  :extra="stakePeriodStart ? ('since ' + stakePeriodStart) : undefined"
              />
              <NetworkDashboardItemV2
                  title="MY STAKE"
                  :value="stakedAmount"
                  :unit="stakedAmount ? cryptoName : ''"
              />
              <NetworkDashboardItemV2
                  v-if="!ignoreReward && declineReward && !pendingReward"
                  title="REWARDS"
                  value="Declined"
              />
              <NetworkDashboardItemV2
                  v-else
                  title="PENDING REWARDS"
                  :value="pendingReward"
                  :unit="pendingReward ? cryptoName : ''"
              />
            </div>

            <div v-if="isHieroWallet" class="my-staking-buttons">
              <ButtonView
                  id="stopStakingButton"
                  :enabled="stakedTo !== null"
                  @action="stopStakingDialogVisible = true"
              >
                STOP STAKING
              </ButtonView>
              <ButtonView
                  id="showStakingDialog"
                  :is-default="true"
                  @action="changeStakingDialogVisible = true"
              >
                CHANGE STAKING
              </ButtonView>
            </div>
            <p v-else class="connect-wallet-text">
              To change your staking options use Blade or HashPack.
            </p>

            <p class="staking-notice">
              <span>Please Note: Your full balance is automatically staked. </span>
              <span>Your funds are fully available for use while staked. You can unstake or switch nodes freely.</span>
            </p>
          </template>

          <template v-else>
            <p class="connect-wallet-text">
              To view or change your staking options first connect your wallet.
            </p>
          </template>
        </div>

      </template>
    </DashboardCardV2>

    <RecentRewardsSection/>

    <RewardsCalculator :amount-in-hbar="balanceInHbar" :node-id="stakedNode?.node_id"/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import UpdateAccountDialog from "@/dialogs/UpdateAccountDialog.vue";
import StopStakingDialog from "@/dialogs/staking/StopStakingDialog.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import RewardsCalculator from "@/components/staking/RewardsCalculator.vue";
import {NodeAnalyzer} from "@/utils/analyzer/NodeAnalyzer";
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import {gtagTransaction} from "@/gtag";
import {NetworkConfig} from "@/config/NetworkConfig";
import {CoreConfig} from "@/config/CoreConfig.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NetworkDashboardItemV2 from "@/components/node/NetworkDashboardItemV2.vue";
import RecentRewardsSection from "@/components/staking/RecentRewardsSection.vue";
import ButtonView from "@/elements/ButtonView.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import {routeManager, walletManager} from "@/utils/RouteManager.ts";

defineProps({
  network: String
})

const temporaryBanner = import.meta.env.VITE_APP_TEMPORARY_BANNER ?? null

const cryptoName = CoreConfig.inject().cryptoName
const networkConfig = NetworkConfig.inject()

const changeStakingDialogVisible = ref(false)
const stopStakingDialogVisible = ref(false)

//
// Account
//
const accountLocParser = new AccountLocParser(walletManager.accountId, networkConfig)
onMounted(() => accountLocParser.mount())
onBeforeUnmount(() => accountLocParser.unmount())

const isStakedToNode = computed(() => accountLocParser.stakedNodeId.value !== null)
const isStakedToAccount = computed(() => accountLocParser.stakedAccountId.value)
const isStaked = computed(() => isStakedToNode.value || isStakedToAccount.value)

const stakedTo = computed(() => {
  let result: string | null
  if (isStakedToAccount.value) {
    result = "Account " + accountLocParser.stakedAccountId.value
  } else if (isStakedToNode.value) {
    result = "Node " + accountLocParser.stakedNodeId.value + " - " + stakedNodeAnalyzer.shortNodeDescription.value
  } else {
    result = null
  }
  return result
})

const balanceInHbar = computed(() => {
  const balance = accountLocParser.balance.value ?? 10000000000
  return balance / 100000000
})

const stakedAmount = computed(() => isStaked.value ? formatHbarAmount(accountLocParser.balance.value) : null)

const formatHbarAmount = (amount: number | null) => {
  let result: string | null
  if (amount) {
    const amountFormatter = new Intl.NumberFormat("en-US", {maximumFractionDigits: 8})
    result = amountFormatter.format(amount / 100000000)
  } else {
    result = null
  }
  return result
}

const pendingReward = computed(() => formatHbarAmount(accountLocParser.pendingReward.value ?? null))
const declineReward = computed(() => accountLocParser.accountInfo.value?.decline_reward ?? false)
const ignoreReward = computed(() => accountLocParser.stakedNodeId.value === null)

//
// stakedNode
//

const stakedNodeAnalyzer = new NodeAnalyzer(accountLocParser.stakedNodeId)
onMounted(() => stakedNodeAnalyzer.mount())
onBeforeUnmount(() => stakedNodeAnalyzer.unmount())

//
// handleStopStaking / handleChangeStaking
//

const stakingChanged = () => {
  accountLocParser.remount()
  gtagTransaction("change_staking")
}

const enableWallet = routeManager.enableWallet
const accountId = walletManager.accountId
const isHieroWallet = walletManager.isHieroWallet
const stakePeriodStart = accountLocParser.stakePeriodStart
const stakedNode = stakedNodeAnalyzer.node

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.my-staking-dashboard {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
  min-height: 128px;
}

div.my-staking-buttons {
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  margin-bottom: 24px;
  gap: 8px;
}

p.staking-notice {
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 400;
  height: 13px;
}

p.connect-wallet-text {
  color: var(--text-disabled);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  height: 26px;
  text-align: center;
}

</style>
