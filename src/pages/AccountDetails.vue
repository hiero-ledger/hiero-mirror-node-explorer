// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      Account
      <span style="white-space: nowrap; font-size: smaller">
        {{ normalizedAccountId }}
      </span>
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification" :is-error="!isInactiveEvmAddress"/>
    </template>

    <DashboardCardV2 collapsible-key="accountDetails">
      <template #title>
        <span v-if="isInactiveEvmAddress">
          Inactive EVM Address
        </span>
        <span v-else-if="isMyAccount" class="my-account">
          <img :src="walletIconURL ?? undefined" alt="wallet logo">
          <span>My Account</span>
        </span>
        <span v-else>
          Account
        </span>
        <span class="mr-1"/>
        <DomainLabel v-if="domainName" :domain-name="domainName" :provider-name="domainProviderName"/>
        <PublicLabel v-if="label" :label-definition="label"/>
        <ArrowLink
            v-if="showContractVisible && contractRoute"
            :route="contractRoute" id="showContractLink"
            text="Associated contract"
        />
      </template>

      <template #right-control>
        <ButtonView
            v-if="isAccountEditable"
            id="update-button"
            :size="ButtonSize.small"
            @action="onUpdateAccount"
        >
          UPDATE ACCOUNT
        </ButtonView>
      </template>

      <template #content>
        <Property id="entityId" full-width>
          <template #name>
            Account ID
          </template>
          <template #value>
              <span v-if="isInactiveEvmAddress">
                Assigned upon activation
              </span>
            <template v-else>
              <EntityIDView :id="normalizedAccountId" :checksum="accountChecksum"/>
            </template>
          </template>
        </Property>
        <Property v-if="operatorNodeRoute" id="nodeLink" full-width>
          <template #name>
            Node
          </template>
          <template #value>
            <router-link :to="operatorNodeRoute">
              <span>{{ nodeId }} - {{ accountDescription }}</span>
            </router-link>
          </template>
        </Property>
        <Property v-else id="evmAddress" full-width>
          <template #name>
            EVM Address
          </template>
          <template #value>
            <EVMAddress
                :show-id="false"
                :address="isInactiveEvmAddress ? accountIdRef : ethereumAddress"/>
          </template>
        </Property>
      </template>

      <template #left-content>

        <Property id="balance">
          <template #name>
            Balance
          </template>
          <template #value>
            <HbarAmount v-if="hbarBalance !== null" :amount="hbarBalance" show-extra/>
          </template>
        </Property>
        <EditableProperty
            v-if="enableStaking"
            id="stakedTo"
            :editable="isAccountEditable"
            @edit="onUpdateAccount"
        >
          <template #name>
            Staked to
          </template>
          <template #value>
            <div v-if="stakedAccountId">
              Account
              <AccountLink :accountId="account?.staked_account_id" v-bind:show-extra="true"/>
            </div>
            <div v-else-if="stakedNodeRoute">
              <router-link :to="stakedNodeRoute">
                Node {{ account?.staked_node_id }} - {{ stakedNodeDescription }}
              </router-link>
            </div>
            <span v-else>None</span>
          </template>
        </EditableProperty>
        <Property v-if="enableStaking" id="pendingReward" :tooltip="rewardIssueWarning">
          <template #name>Pending Reward</template>
          <template #value>
            <HbarAmount :amount="account?.pending_reward" :show-extra="true" timestamp="0"/>
            <div v-if="stakePeriodStart" class="text-secondary">
              {{ "Period Started " + stakePeriodStart }}
            </div>
          </template>
        </Property>
        <Property v-if="enableStaking && account?.staked_node_id != null" id="declineReward">
          <template #name>Rewards</template>
          <template #value>
            <StringValue :string-value="account?.decline_reward ? 'Declined' : 'Accepted'"/>
          </template>
        </Property>
        <EditableProperty
            id="memo"
            :editable="isAccountEditable"
            @edit="onUpdateAccount"
        >
          <template #name>Memo</template>
          <template #value>
            <BlobValue v-bind:base64="true" v-bind:blob-value="account?.memo" v-bind:show-none="true"
                       :show-base64-as-extra="true"/>
          </template>
        </EditableProperty>
        <Property id="createTransaction">
          <template #name>Create Transaction</template>
          <template #value>
            <TransactionLink :transactionLoc="account?.created_timestamp ?? undefined"/>
          </template>
        </Property>
        <Property
            v-if="enableExpiry"
            id="expiresAt"
            tooltip="Account expiry is not turned on yet. This value is not taken into account for the time being."
        >
          <template #name>
            <span>Expires at</span>
          </template>
          <template #value>
            <TimestampValue v-bind:show-none="true" v-bind:timestamp="account?.expiry_timestamp"/>
          </template>
        </Property>
        <EditableProperty
            v-if="enableExpiry"
            id="autoRenewPeriod"
            tooltip="Account auto-renew is not turned on yet. This value is not taken into account for the time being."
            :editable="isAccountEditable"
            @edit="onUpdateAccount"
        >
          <template #name>
            <span>Auto Renew Period</span>
          </template>
          <template #value>
            <DurationValue v-bind:number-value="account?.auto_renew_period ?? undefined"/>
          </template>
        </EditableProperty>
        <EditableProperty
            id="maxAutoAssociation"
            tooltip="Max.Auto.Associations sets the amount of airdrops. Unlimited(-1), Limited(>0), No airdrop slots(0)."
            :editable="isAccountEditable"
            @edit="onUpdateAccount"
        >
          <template #name>Max. Auto. Associations</template>
          <template #value>
            <StringValue :string-value="maxAutoAssociationsValue"/>
          </template>
        </EditableProperty>
        <EditableProperty
            id="receiverSigRequired"
            :editable="isAccountEditable"
            @edit="onUpdateAccount"
        >
          <template #name>Receiver Sig. Required</template>
          <template #value>
            <StringValue :string-value="account?.receiver_sig_required?.toString()"/>
          </template>
        </EditableProperty>
      </template>

      <template #right-content>
        <EditableProperty
            id="key"
            :editable="false"
            @edit="onUpdateAccount"
        >
          <template #name>Admin Key</template>
          <template #value>
            <KeyValue :account-id="normalizedAccountId ?? undefined" :key-bytes="account?.key?.key"
                      :key-type="account?.key?._type"
                      :show-none="true"/>
          </template>
        </EditableProperty>
        <Property id="ethereumNonce">
          <template #name>Ethereum Nonce</template>
          <template #value>
            <StringValue :string-value="account?.ethereum_nonce?.toString()"/>
          </template>
        </Property>
      </template>
    </DashboardCardV2>

    <TokensSection :account-id="normalizedAccountId" :full-page="false"/>

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

    <AllowancesSection :account-id="normalizedAccountId ?? undefined"/>

    <MirrorLink :network="network" entityUrl="accounts" :loc="accountIdRef ?? undefined"/>

    <TransactionDownloadDialog
        v-if="accountIdRef"
        v-model:show-dialog="transactionDownloadDialogVisible"
        :account-id="accountIdRef"/>

    <UpdateAccountDialog
        v-model:show-dialog="showUpdateAccountDialog"
        @updated="onUpdateCompleted"
    />

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import KeyValue from "@/components/values/KeyValue.vue";
import TransactionTable from "@/components/transaction/TransactionTable.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {BalanceAnalyzer} from "@/utils/analyzer/BalanceAnalyzer";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import Property from "@/components/Property.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import StringValue from "@/components/values/StringValue.vue";
import {TransactionTableControllerXL} from "@/components/transaction/TransactionTableControllerXL";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";
import TransactionFilterSelect from "@/components/transaction/TransactionFilterSelect.vue";
import TransactionLink from "@/components/values/TransactionLink.vue";
import {StakingRewardsTableController} from "@/components/staking/StakingRewardsTableController";
import StakingRewardsTable from "@/components/staking/StakingRewardsTable.vue";
import {NodeAnalyzer} from "@/utils/analyzer/NodeAnalyzer";
import EVMAddress from "@/components/values/EVMAddress.vue";
import AllowancesSection from "@/components/allowances/AllowancesSection.vue";
import MirrorLink from "@/components/MirrorLink.vue";
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
import {NameQuery} from "@/utils/name_service/NameQuery";
import {labelForAutomaticTokenAssociation} from "@/schemas/MirrorNodeUtils.ts";
import TokensSection from "@/components/token/TokensSection.vue";
import EditableProperty from "@/components/EditableProperty.vue";
import UpdateAccountDialog from "@/dialogs/UpdateAccountDialog.vue";
import {NetworkConfig} from "@/config/NetworkConfig";
import SwitchView from "@/elements/SwitchView.vue";
import SelectView from "@/elements/SelectView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ButtonView from "@/elements/ButtonView.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import ArrowLink from "@/components/ArrowLink.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import EntityIDView from "@/components/values/EntityIDView.vue";
import {Download} from 'lucide-vue-next';
import DomainLabel from "@/components/values/DomainLabel.vue";
import PublicLabel from "@/components/values/PublicLabel.vue";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";
import router, {routeManager, walletManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  accountId: String,
  network: String,
})

const rewardIssueWarning = import.meta.env.VITE_APP_TEMPORARY_TOOLTIP ?? null

const isMediumScreen = inject('isMediumScreen', true)
const networkConfig = NetworkConfig.inject()

const enableExpiry = routeManager.enableExpiry
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

const maxAutoAssociationsValue = computed(() =>
    labelForAutomaticTokenAssociation(
        accountLocParser.accountInfo.value?.max_automatic_token_associations ?? 0
    ))

//
// BalanceAnalyzer
//
const BALANCE_REFRESH_PERIOD = 60000 // 60 seconds
const balanceAnalyzer = new BalanceAnalyzer(accountLocParser.accountId, BALANCE_REFRESH_PERIOD)
onMounted(() => balanceAnalyzer.mount())
onBeforeUnmount(() => balanceAnalyzer.unmount())

//
// contract
//
const contractLookup = ContractByIdCache.instance.makeLookup(accountLocParser.accountId)
onMounted(() => contractLookup.mount())
onBeforeUnmount(() => contractLookup.unmount())
const showContractVisible = computed(() => {
  return contractLookup.entity.value != null
})

//
// staking
//
const stakedNodeAnalyzer = new NodeAnalyzer(accountLocParser.stakedNodeId)
onMounted(() => stakedNodeAnalyzer.mount())
onBeforeUnmount(() => stakedNodeAnalyzer.unmount())

const contractRoute = computed(() => {
  const accountId = accountLocParser.accountId.value
  return accountId ? routeManager.makeRouteToContract(accountId) : ''
})

const stakedNodeRoute = computed(() => {
  const stakedNodeId = accountLocParser.stakedNodeId.value
  return stakedNodeId !== null ? routeManager.makeRouteToNode(stakedNodeId) : ''
})

const operatorNodeRoute = computed(() => {
  const operatorNodeId = accountLocParser.nodeId.value
  return operatorNodeId != null ? routeManager.makeRouteToNode(operatorNodeId) : ''
})

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

//
// Naming
//
const nameQuery = new NameQuery(accountLocParser.accountId)
onMounted(() => nameQuery.mount())
onBeforeUnmount(() => nameQuery.unmount())
const domainName = nameQuery.name
const domainProviderName = nameQuery.providerName

//
// Public Label
//
const indexLookup = PublicLabelsCache.instance.makeLookup()
onMounted(() => indexLookup.mount())
onBeforeUnmount(() => indexLookup.unmount())
const index = indexLookup.entity
const label = computed(() =>
    accountLocParser.accountId.value ? index.value?.lookup(accountLocParser.accountId.value) ?? null : null
)

//
// Account Update
//
const showUpdateAccountDialog = ref(false)

const onUpdateAccount = () => showUpdateAccountDialog.value = true

const onUpdateCompleted = () => accountLocParser.remount()

const isMyAccount = computed(() => walletManager.accountId.value === props.accountId)
const walletIconURL = computed(() => (isMyAccount.value) ? walletManager.walletIconURL.value || "" : "")
const isHieroWallet = computed(() => walletManager.isHieroWallet.value)
const isAccountEditable = computed(() => isMyAccount.value && isHieroWallet.value
)

const hbarBalance = balanceAnalyzer.hbarBalance
const transactionType = transactionTableController.transactionType
const loaded = verifiedContractsController.loaded
const overflow = verifiedContractsController.overflow
const notification = accountLocParser.errorNotification
const isInactiveEvmAddress = accountLocParser.isInactiveEvmAddress
const account = accountLocParser.accountInfo
const normalizedAccountId = accountLocParser.accountId
const accountChecksum = accountLocParser.accountChecksum
const accountDescription = accountLocParser.accountDescription
const nodeId = accountLocParser.nodeId
const ethereumAddress = accountLocParser.ethereumAddress
const stakePeriodStart = accountLocParser.stakePeriodStart
const stakedAccountId = accountLocParser.stakedAccountId
const stakedNodeDescription = stakedNodeAnalyzer.nodeDescription

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.my-account {
  display: flex;
  align-items: center;
  gap: 8px;
}

.my-account img {
  height: 32px;
}

div.text-secondary {
  color: var(--text-secondary);
}

</style>

