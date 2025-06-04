// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      Contract
      <span style="white-space: nowrap; font-size: smaller">
        {{ normalizedContractId }}
      </span>
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2 collapsible-key="contractDetails">
      <template #title>
        Contract
        <div v-if="contractName" class="card-title-extra">
          {{ contractName }}
        </div>
        <span class="mr-1"/>
        <div v-if="isVerified" class="h-has-pill h-chip-success">
          VERIFIED
        </div>
        <div v-if="isErc20" class="h-has-pill">
          ERC 20
        </div>
        <div v-if="isErc721" class="h-has-pill">
          ERC 721
        </div>
        <div v-if="isErc1155" class="h-has-pill">
          ERC 1155
        </div>
        <DomainLabel v-if="domainName" :domain-name="domainName" :provider-name="domainProviderName"/>
        <PublicLabel v-if="label" :label-definition="label"/>
        <ArrowLink
            v-if="contract && accountRoute"
            :route="accountRoute" id="showAccountLink"
            text="Associated account"
        />
      </template>

      <template #content>
        <Property id="entityId" full-width>
          <template #name>
            Contract ID
          </template>
          <template #value>
            <EntityIDView :id="normalizedContractId" :checksum="accountChecksum"/>
          </template>
        </Property>
        <Property id="evmAddress" full-width>
          <template #name>
            EVM Address
          </template>
          <template #value>
            <EVMAddress
                :show-id="false"
                :address="ethereumAddress"/>
          </template>
        </Property>
      </template>

      <template #left-content>
        <Property v-if="tokenName" id="tokenName">
          <template #name>
            Token Name
          </template>
          <template #value>
            <EntityLink
                :route="ethereumAddress ? routeManager.makeRouteToToken(ethereumAddress) : null">
              <BlobValue :blob-value="tokenName"/>
            </EntityLink>
          </template>
        </Property>
        <Property id="balance">
          <template #name>
            Balance
          </template>
          <template #value>
            <HbarAmount v-if="hbarBalance !== null" :amount="hbarBalance" show-extra/>
          </template>
        </Property>
        <Property id="key">
          <template #name>Admin Key</template>
          <template #value>
            <KeyValue :key-bytes="contract?.admin_key?.key" :key-type="contract?.admin_key?._type" :show-none="true"/>
          </template>
        </Property>
        <Property id="memo">
          <template #name>Memo</template>
          <template #value>
            <BlobValue :blob-value="contract?.memo" :show-none="true" :base64="true" :show-base64-as-extra="true"/>
          </template>
        </Property>
        <Property id="createTransaction">
          <template #name>Create Transaction</template>
          <template #value>
            <TransactionLink :transactionLoc="contract?.created_timestamp ?? undefined"/>
          </template>
        </Property>
        <Property
            id="maxAutoAssociation"
            tooltip="Number of auto association slots for token airdrops. Unlimited (-1), Limited (>0), No auto association slots (0)."
        >
          <template #name>Max. Auto. Association</template>
          <template #value>
            <StringValue :string-value="maxAutoAssociationValue"/>
          </template>
        </Property>

        <template v-if="enableExpiry">
          <Property
              id="expiresAt"
              tooltip="Contract expiry is not turned on yet. Value in this field is not relevant."
          >
            <template #name>
              <span>Expires at</span>
            </template>
            <template #value>
              <TimestampValue :timestamp="contract?.expiration_timestamp" :show-none="true"/>
            </template>
          </Property>
          <Property
              id="autoRenewPeriod"
              tooltip="Contract auto-renew is not turned on yet. Value in this field is not relevant."
          >
            <template #name>
              <span>Auto Renew Period</span>
            </template>
            <template #value>
              <DurationValue :number-value="contract?.auto_renew_period ?? undefined"/>
            </template>
          </Property>
          <Property
              id="autoRenewAccount"
              tooltip="Contract auto-renew is not turned on yet. Value in this field is not relevant."
          >
            <template #name>
              <span>Auto Renew Account</span>
            </template>
            <template #value>
              <AccountLink :account-id="autoRenewAccount"/>
            </template>
          </Property>
        </template>
        <template v-else>
          <Property id="obtainer">
            <template #name>Obtainer</template>
            <template #value>
              <AccountLink :account-id="obtainerId"/>
            </template>
          </Property>
          <Property id="proxyAccount">
            <template #name>Proxy Account</template>
            <template #value>
              <AccountLink :account-id="proxyAccountId"/>
            </template>
          </Property>
        </template>
      </template>

      <template #right-content>
        <template v-if="enableExpiry">
          <Property id="obtainer">
            <template #name>Obtainer</template>
            <template #value>
              <AccountLink :account-id="obtainerId"/>
            </template>
          </Property>
          <Property id="proxyAccount">
            <template #name>Proxy Account</template>
            <template #value>
              <AccountLink :account-id="proxyAccountId"/>
            </template>
          </Property>
        </template>
        <template v-else>
        </template>

        <Property id="validFrom">
          <template #name>Valid from</template>
          <template #value>
            <TimestampValue :timestamp="contract?.timestamp?.from" :show-none="true"/>
          </template>
        </Property>
        <Property id="validUntil">
          <template #name>Valid until</template>
          <template #value>
            <TimestampValue :timestamp="contract?.timestamp?.to" :show-none="true"/>
          </template>
        </Property>
        <Property v-if="displayNonce" id="nonce">
          <template #name>Contract Nonce</template>
          <template #value>
            {{ contract?.nonce }}
          </template>
        </Property>
        <Property id="file">
          <template #name>File</template>
          <template #value>
            <StringValue :string-value="contract?.file_id"/>
          </template>
        </Property>
      </template>
    </DashboardCardV2>

    <TokensSection :account-id="normalizedContractId"/>

    <ContractResultsSection :contract-id="normalizedContractId ?? undefined"/>

    <ContractByteCodeSection :contract-analyzer="contractAnalyzer"/>

    <ContractResultLogs :logs="logs"/>

    <MirrorLink :network="network" entityUrl="contracts" :loc="contractId"/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import KeyValue from "@/components/values/KeyValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import StringValue from "@/components/values/StringValue.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Property from "@/components/Property.vue";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache";
import {ContractLocParser} from "@/utils/parser/ContractLocParser";
import {NetworkConfig} from "@/config/NetworkConfig";
import TransactionLink from "@/components/values/TransactionLink.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import ContractByteCodeSection from "@/components/contract/ContractByteCodeSection.vue";
import ContractResultsSection from "@/components/contract/ContractResultsSection.vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer";
import ContractResultLogs from "@/components/contract/ContractResultLogs.vue";
import {ContractResultsLogsAnalyzer} from "@/utils/analyzer/ContractResultsLogsAnalyzer";
import {BalanceAnalyzer} from "@/utils/analyzer/BalanceAnalyzer";
import MirrorLink from "@/components/MirrorLink.vue";
import {NameQuery} from "@/utils/name_service/NameQuery";
import {labelForAutomaticTokenAssociation} from "@/schemas/MirrorNodeUtils.ts";
import TokensSection from "@/components/token/TokensSection.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ArrowLink from "@/components/ArrowLink.vue";
import EntityIDView from "@/components/values/EntityIDView.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {SyntheticTokenAnalyzer} from "@/utils/analyzer/SyntheticTokenAnalyzer.ts";
import DomainLabel from "@/components/values/DomainLabel.vue";
import PublicLabel from "@/components/values/PublicLabel.vue";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";
import EntityLink from "@/components/values/link/EntityLink.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  contractId: String,
  network: String
})

const networkConfig = NetworkConfig.inject()

const normalizedContractId = computed(() => {
  return contractLocParser.contractId.value
})

//
// contract
//
const contractLocParser = new ContractLocParser(computed(() => props.contractId ?? null))
onMounted(() => contractLocParser.mount())
onBeforeUnmount(() => contractLocParser.unmount())

const displayNonce = computed(() => contractLocParser.entity.value?.nonce != undefined)
const maxAutoAssociationValue = computed(() =>
    labelForAutomaticTokenAssociation(
        contractLocParser.entity.value?.max_automatic_token_associations ?? 0
    ))

const autoRenewAccount = computed(() => {
  return contractLocParser.entity.value?.auto_renew_account ?? null
})

const obtainerId = computed(() => {
  return contractLocParser.entity.value?.obtainer_id ?? null
})

const proxyAccountId = computed(() => {
  return contractLocParser.entity.value?.proxy_account_id ?? null
})

const accountChecksum = computed(() =>
    contractLocParser.contractId.value ? networkConfig.computeChecksum(
        contractLocParser.contractId.value,
        routeManager.currentNetwork.value
    ) : null)

//
// account
//
const accountLookup = AccountByIdCache.instance.makeLookup(normalizedContractId)
onMounted(() => accountLookup.mount())
onBeforeUnmount(() => accountLookup.unmount())

//
// BalanceAnalyzer
//
const balanceAnalyzer = new BalanceAnalyzer(contractLocParser.contractId, 10000)
onMounted(() => balanceAnalyzer.mount())
onBeforeUnmount(() => balanceAnalyzer.unmount())

const accountRoute = computed(() => {
  return normalizedContractId.value !== null ? routeManager.makeRouteToAccount(normalizedContractId.value) : null
})

//
// ContractAnalyzer
//
const contractAnalyzer = new ContractAnalyzer(normalizedContractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())

//
// TokenAnalyzer
//
const tokenAnalyzer = new SyntheticTokenAnalyzer(contractAnalyzer.contractAddress)
onMounted(() => tokenAnalyzer.mount())
onBeforeUnmount(() => tokenAnalyzer.unmount())

//
// contract results logs - event logs at contract level
//
const contractResultsLogsAnalyzer = new ContractResultsLogsAnalyzer(normalizedContractId)
onMounted(() => contractResultsLogsAnalyzer.mount())
onBeforeUnmount(() => contractResultsLogsAnalyzer.unmount())

//
// Naming
//
const nameQuery = new NameQuery(normalizedContractId)
onMounted(() => nameQuery.mount())
onBeforeUnmount(() => nameQuery.unmount())
const domainName = nameQuery.name
const domainProviderName = nameQuery.providerName

//
// Label
//
const indexLookup = PublicLabelsCache.instance.makeLookup()
onMounted(() => indexLookup.mount())
onBeforeUnmount(() => indexLookup.unmount())
const index = indexLookup.entity
const label = computed(() =>
    normalizedContractId.value ? index.value?.lookup(normalizedContractId.value) ?? null : null
)

const enableExpiry = routeManager.enableExpiry
const contract = contractLocParser.entity
const ethereumAddress = contractLocParser.ethereumAddress
const notification = contractLocParser.errorNotification
const hbarBalance = balanceAnalyzer.hbarBalance
const isVerified = contractAnalyzer.isVerified
const contractName = contractAnalyzer.contractName
const logs = contractResultsLogsAnalyzer.logs
const isErc20 = tokenAnalyzer.isErc20
const isErc721 = tokenAnalyzer.isErc721
const isErc1155 = tokenAnalyzer.isErc1155
const tokenName = tokenAnalyzer.name

</script>

<style scoped>

</style>
