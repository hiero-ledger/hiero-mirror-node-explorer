// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

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
          <EntityIDView :id="contractId" :checksum="accountChecksum"/>
        </template>
      </Property>
      <Property id="evmAddress" full-width>
        <template #name>
          EVM Address
        </template>
        <template #value>
          <EVMAddress
              :show-id="false"
              :address="contractAddress"/>
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

  <ContractERCSection :erc-analyzer="ercAnalyzer"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import ArrowLink from "@/components/ArrowLink.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import DomainLabel from "@/components/values/DomainLabel.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import EntityIDView from "@/components/values/EntityIDView.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import Property from "@/components/Property.vue";
import PublicLabel from "@/components/values/PublicLabel.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TransactionLink from "@/components/values/TransactionLink.vue";
import {BalanceAnalyzer} from "@/utils/analyzer/BalanceAnalyzer.ts";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";
import {ContractLocParser} from "@/utils/parser/ContractLocParser";
import {NameQuery} from "@/utils/name_service/NameQuery.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";
import {labelForAutomaticTokenAssociation} from "@/schemas/MirrorNodeUtils.ts";
import {routeManager} from "@/utils/RouteManager.ts";
import {ERCAnalyzer} from "@/utils/analyzer/ERCAnalyzer.ts";
import ContractERCSection from "@/components/contract/ContractERCSection.vue";

const props = defineProps({
  contractId: String,
  network: String
})


const enableExpiry = routeManager.enableExpiry

//
// contract
//
const contractLocParser = new ContractLocParser(computed(() => props.contractId ?? null))
onMounted(() => contractLocParser.mount())
onBeforeUnmount(() => contractLocParser.unmount())
const contractId = contractLocParser.contractId
const contractAddress = contractLocParser.ethereumAddress
const contract = contractLocParser.entity
const displayNonce = computed(() => contract.value?.nonce != undefined)
const proxyAccountId = computed(() => {
  return contract.value?.proxy_account_id ?? null
})
const autoRenewAccount = computed(() => {
  return contract.value?.auto_renew_account ?? null
})
const obtainerId = computed(() => {
  return contract.value?.obtainer_id ?? null
})
const maxAutoAssociationValue = computed(() =>
    labelForAutomaticTokenAssociation(
        contract.value?.max_automatic_token_associations ?? 0
    ))

//
// ContractAnalyzer
//
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const contractName = contractAnalyzer.contractName
const isVerified = contractAnalyzer.isVerified

//
// ERCAnalyzer
//
const ercAnalyzer = new ERCAnalyzer(contractId)
onMounted(() => ercAnalyzer.mount())
onBeforeUnmount(() => ercAnalyzer.unmount())
const isErc20 = ercAnalyzer.isErc20
const isErc721 = ercAnalyzer.isErc721
const isErc1155 = ercAnalyzer.isErc1155

//
// Naming
//
const nameQuery = new NameQuery(contractId)
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
    contractId.value ? index.value?.lookup(contractId.value) ?? null : null
)

//
// BalanceAnalyzer
//
const balanceAnalyzer = new BalanceAnalyzer(contractLocParser.contractId, 10000)
onMounted(() => balanceAnalyzer.mount())
onBeforeUnmount(() => balanceAnalyzer.unmount())
const hbarBalance = balanceAnalyzer.hbarBalance


//
// Account checksum
//

const networkConfig = NetworkConfig.inject()
const accountChecksum = computed(() =>
    contractId.value ? networkConfig.computeChecksum(
        contractId.value,
        routeManager.currentNetwork.value
    ) : null)

//
// Account route
//

const accountRoute = computed(() => {
  return contractId.value !== null ? routeManager.makeRouteToAccount(contractId.value) : null
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
