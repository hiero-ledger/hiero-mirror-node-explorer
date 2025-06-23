// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="!isInactiveEvmAddress" collapsible-key="recentTransactions">
    <template #title>
      <p id="recentTransactions">Recent Operations</p>
    </template>

    <template #left-control>
      <template v-if="selectedTab === 'transactions' && timeSelection === 'LATEST'">
        <PlayPauseButton :controller="transactionTableController"/>
      </template>
      <template v-else-if="selectedTab === 'contracts'">
        <PlayPauseButton v-if="!filterVerified" :controller="contractCreateTableController"/>
        <PlayPauseButton v-else :controller="verifiedContractsController"/>
      </template>
    </template>

    <template #right-control>
      <template v-if="selectedTab === 'transactions'">
        <DateTimePicker
            v-if="timeSelection !== 'LATEST'"
            :controller="transactionTableController"
            @dateCleared="onDateCleared"
        />
        <SelectView v-model="timeSelection" :small="true">
          <option value="LATEST">LATEST</option>
          <option value="JUMP">JUMP TO DATE</option>
        </SelectView>
        <Download :size="24" @click="transactionDownloadDialogVisible = true"/>
        <TransactionFilterSelect v-model:selected-filter="transactionType"/>
      </template>
      <template v-else-if="selectedTab === 'contracts'">
        <span>All</span>
        <SwitchView v-model="filterVerified"/>
        <span>Verified</span>
      </template>
    </template>

    <template #content>

      <div style="display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap:16px">
        <Tabs
            :selected-tab="selectedTab"
            :tab-ids="tabIds"
            :tabLabels="tabLabels"
            @update:selected-tab="handleTabUpdate($event)"
        />
        <div v-if="selectedTab === 'transactions'"
             style="display: flex; align-items: baseline; justify-content: flex-end; gap: 8px;">
          <div>Hide transfers below</div>
          <SelectView v-model="minTinyBar" small :style="{'font-size':minTinyBar!=0?'12px':'10px'}"
                      style="min-width: 70px">
            <option value=500000000>
              <HbarAmount :amount="500000000" :decimals="0"/>
            </option>
            <option value=400000000>
              <HbarAmount :amount="400000000" :decimals="0"/>
            </option>
            <option value=300000000>
              <HbarAmount :amount="300000000" :decimals="0"/>
            </option>
            <option value=200000000>
              <HbarAmount :amount="200000000" :decimals="0"/>
            </option>
            <option value=100000000>
              <HbarAmount :amount="100000000" :decimals="0"/>
            </option>
            <option value=0>NONE</option>
          </SelectView>
        </div>
      </div>

      <div v-if="selectedTab === 'transactions'" id="recentTransactionsTable">
        <TransactionTable v-if="account" :controller="transactionTableController" :narrowed="true"/>
      </div>

      <div v-else-if="selectedTab === 'contracts'" id="recentContractsTable">
        <AccountCreatedContractsTable
            v-if="account && !filterVerified"
            :controller="contractCreateTableController"
        />
        <VerifiedContractsTable
            v-else-if="account"
            :controller="verifiedContractsController"
            :loaded="loaded"
            :overflow="overflow"/>
        <EmptyTable v-else/>
      </div>

      <div v-else id="recentRewardsTable">
        <StakingRewardsTable :controller="rewardsTableController"/>
      </div>
    </template>
  </DashboardCardV2>

  <TransactionDownloadDialog
      v-if="accountIdRef"
      v-model:show-dialog="transactionDownloadDialogVisible"
      :account-id="accountIdRef"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import TransactionTable from "@/components/transaction/TransactionTable.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {TransactionTableControllerXL} from "@/components/transaction/TransactionTableControllerXL";
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import TransactionFilterSelect from "@/components/transaction/TransactionFilterSelect.vue";
import {StakingRewardsTableController} from "@/components/staking/StakingRewardsTableController";
import StakingRewardsTable from "@/components/staking/StakingRewardsTable.vue";
import {TransactionType} from "@/schemas/MirrorNodeSchemas";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import EmptyTable from "@/components/EmptyTable.vue";
import VerifiedContractsTable from "@/components/account/VerifiedContractsTable.vue";
import {AppStorage} from "@/AppStorage";
import Tabs from "@/components/Tabs.vue";
import AccountCreatedContractsTable from "@/components/account/AccountCreatedContractsTable.vue";
import {VerifiedContractsByAccountIdCache} from "@/utils/cache/VerifiedContractsByAccountIdCache";
import {VerifiedContractsController} from "@/components/contract/VerifiedContractsController";
import DateTimePicker from "@/components/DateTimePicker.vue";
import TransactionDownloadDialog from "@/dialogs/download/TransactionDownloadDialog.vue";
import {NetworkConfig} from "@/config/NetworkConfig";
import SwitchView from "@/elements/SwitchView.vue";
import SelectView from "@/elements/SelectView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import {Download} from 'lucide-vue-next';
import router, {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  accountId: String,
  network: String,
})

const isMediumScreen = inject('isMediumScreen', true)
const networkConfig = NetworkConfig.inject()

const enableStaking = routeManager.enableStaking

const timeSelection = ref("LATEST")
watch(timeSelection, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (timeSelection.value == "LATEST") {
      transactionTableController.startAutoRefresh() // (1)
    } else {
      transactionTableController.stopAutoRefresh()
    }
  }
})

function onDateCleared() {
  timeSelection.value = "LATEST"
  // (1) will restart auto-refresh
}

const minTinyBar = ref(AppStorage.getMinTinyBarTransfer() ?? 0)
watch(minTinyBar, (newValue) => AppStorage.setMinTinyBarTransfer(newValue))

//
// account
//
const accountLocParser = new AccountLocParser(computed(() => props.accountId ?? null), networkConfig)
onMounted(() => accountLocParser.mount())
onBeforeUnmount(() => accountLocParser.unmount())

const tabIds = enableStaking ? ['transactions', 'contracts', 'rewards'] : ['transactions', 'contracts']
const tabLabels = enableStaking ? ['Transactions', 'Created Contracts', 'Staking Rewards'] : ['Transactions', 'Created Contracts']
const selectedTab = ref<string | null>(AppStorage.getAccountOperationTab() ?? tabIds[0])
const handleTabUpdate = (tab: string | null) => {
  selectedTab.value = tab
  AppStorage.setAccountOperationTab(tab)
}
const filterVerified = ref(false)

//
// Table controllers and cache for Recent Account Operations
// These are mounted only when their respective table is mounted, i.e. when the corresponding tab is selected
//
const defaultPageSize = isMediumScreen ? 10 : 5
const accountIdRef = accountLocParser.accountId

const transactionTableController = new TransactionTableControllerXL(
    router,
    accountIdRef,
    defaultPageSize,
    true,
    AppStorage.ACCOUNT_OPERATION_TABLE_PAGE_SIZE_KEY,
    "p1", "k1",
    minTinyBar)

const contractCreateTableController = new TransactionTableController(
    router,
    defaultPageSize,
    TransactionType.CONTRACTCREATEINSTANCE,
    "success",
    AppStorage.ACCOUNT_OPERATION_TABLE_PAGE_SIZE_KEY,
    "p3", "k3",
    accountIdRef)

const verifiedContractsController = new VerifiedContractsController(
    VerifiedContractsByAccountIdCache.instance.makeLookup(accountIdRef),
    ref(defaultPageSize),
    AppStorage.ACCOUNT_OPERATION_TABLE_PAGE_SIZE_KEY
)

const rewardsTableController = new StakingRewardsTableController(
    router,
    accountLocParser.accountId,
    defaultPageSize,
    AppStorage.ACCOUNT_OPERATION_TABLE_PAGE_SIZE_KEY,
    "p2", "k2")

//
// Transactions download
//
const transactionDownloadDialogVisible = ref(false)

const transactionType = transactionTableController.transactionType
const loaded = verifiedContractsController.loaded
const overflow = verifiedContractsController.overflow
const isInactiveEvmAddress = accountLocParser.isInactiveEvmAddress
const account = accountLocParser.accountInfo

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>

