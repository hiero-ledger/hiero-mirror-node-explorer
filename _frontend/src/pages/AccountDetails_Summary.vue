// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
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
      <Property id="entityId" full-width>
        <template #name>
          Tags
        </template>
        <template #value>
          <MerkleScienceLabel v-if="merkleTag" :id="normalizedAccountId" :tag-definition="merkleTag"/>
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

    <template #footer>
      <MirrorLink :network="network" entityUrl="accounts" :loc="accountIdRef ?? undefined"/>
    </template>
  </DashboardCardV2>

  <UpdateAccountDialog
      v-model:show-dialog="showUpdateAccountDialog"
      @updated="onUpdateCompleted"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import KeyValue from "@/components/values/KeyValue.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {BalanceAnalyzer} from "@/utils/analyzer/BalanceAnalyzer";
import Property from "@/components/Property.vue";
import StringValue from "@/components/values/StringValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import TransactionLink from "@/components/values/TransactionLink.vue";
import {NodeAnalyzer} from "@/utils/analyzer/NodeAnalyzer";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {AppStorage} from "@/AppStorage";
import {NameQuery} from "@/utils/name_service/NameQuery";
import {labelForAutomaticTokenAssociation} from "@/schemas/MirrorNodeUtils.ts";
import EditableProperty from "@/components/EditableProperty.vue";
import UpdateAccountDialog from "@/dialogs/UpdateAccountDialog.vue";
import {NetworkConfig} from "@/config/NetworkConfig";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ButtonView from "@/elements/ButtonView.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import EntityIDView from "@/components/values/EntityIDView.vue";
import DomainLabel from "@/components/values/DomainLabel.vue";
import PublicLabel from "@/components/values/PublicLabel.vue";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";
import {routeManager, walletManager} from "@/utils/RouteManager.ts";
import MirrorLink from "@/components/MirrorLink.vue";
import {MerkleScienceAddressCache, MerkleScienceTag} from "@/utils/cache/MerkleScienceAddressCache.ts";
import MerkleScienceLabel from "@/components/values/MerkleScienceLabel.vue";

const props = defineProps({
  accountId: String,
  network: String,
})

const rewardIssueWarning = import.meta.env.VITE_APP_TEMPORARY_TOOLTIP ?? null

const networkConfig = NetworkConfig.inject()

const enableExpiry = routeManager.enableExpiry
const enableStaking = routeManager.enableStaking

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
// staking
//
const stakedNodeAnalyzer = new NodeAnalyzer(accountLocParser.stakedNodeId)
onMounted(() => stakedNodeAnalyzer.mount())
onBeforeUnmount(() => stakedNodeAnalyzer.unmount())

const stakedNodeRoute = computed(() => {
  const stakedNodeId = accountLocParser.stakedNodeId.value
  return stakedNodeId !== null ? routeManager.makeRouteToNode(stakedNodeId) : ''
})

const operatorNodeRoute = computed(() => {
  const operatorNodeId = accountLocParser.nodeId.value
  return operatorNodeId != null ? routeManager.makeRouteToNode(operatorNodeId) : ''
})

const accountIdRef = accountLocParser.accountId

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
// MerkleScience info
//

const merkleLookup = MerkleScienceAddressCache.instance.makeLookup(accountLocParser.accountId)
onMounted(() => merkleLookup.mount())
onBeforeUnmount(() => merkleLookup.unmount())
const merkleTag = computed(() => {
  let result: MerkleScienceTag | null
  const merkleAddress = merkleLookup.entity.value
  result = merkleAddress?.tags.owner ?? null
  return result
})

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

