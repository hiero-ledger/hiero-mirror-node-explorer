// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 collapsible-key="tokenSummary">
    <template #title>
      <div class="title-extra">
        {{ title }}
      </div>
      <span class="mr-1"/>
      <PublicLabel v-if="label" :label-definition="label"/>
    </template>

    <template #right-control>
      <TokenActions
          v-if="isWalletConnected"
          :token-id="tokenId"
          @completed="onActionCompleted"
      />
    </template>

    <template #content>
      <Property id="entityId" full-width :tooltip="tokenIdTooltip">
        <template #name>Token ID</template>
        <template #value>
          <div style="display: flex; gap:12px; align-items: baseline">
            <EntityIDView :id="tokenId" :checksum="tokenChecksum"/>
            <ArrowLink
                v-if="!isHts && contractRoute"
                :route="contractRoute"
                id="showSupportContractLink"
                text="Supporting contract"
            />
          </div>
        </template>
      </Property>
      <Property v-if="tokenAddress" id="evmAddress" full-width>
        <template #name>EVM Address</template>
        <template #value>
          <EVMAddress :show-id="false" :address="tokenAddress"/>
        </template>
      </Property>
      <Property id="type" full-width>
        <template #name>Type</template>
        <template #value>
          <BlobValue :blob-value="displayType" :show-none="true"/>
        </template>
      </Property>
      <Property id="name" full-width>
        <template #name>Name</template>
        <template #value>
          <BlobValue :blob-value="displayName" :show-none="true"/>
        </template>
      </Property>
      <Property id="symbol" full-width>
        <template #name>Symbol</template>
        <template #value>
          <BlobValue :blob-value="displaySymbol" :show-none="true"/>
        </template>
      </Property>
      <Property id="totalSupply" full-width>
        <template #name>Total Supply</template>
        <template #value>
          <StringValue :string-value="displayTotalSupply"/>
        </template>
      </Property>
      <Property id="decimals" full-width>
        <template #name>Decimals</template>
        <template #value>
          <StringValue :string-value="decimals"/>
        </template>
      </Property>
      <Property v-if="holders" id="holders" full-width>
        <template #name>Holders</template>
        <template #value>
          <StringValue :string-value="holders"/>
        </template>
      </Property>
    </template>

  </DashboardCardV2>

  <DashboardCardV2 v-if="isHts" collapsible-key="htsTokenSummary">
    <template #title>HTS Info</template>

    <template #content>

      <Property id="memo" full-width>
        <template #name>Memo</template>
        <template #value>
          <BlobValue :blob-value="tokenInfo?.memo" :show-none="true"/>
        </template>
      </Property>
      <Property id="treasuryAccount" full-width>
        <template #name>Treasury Account</template>
        <template #value>
          <AccountLink :account-id="tokenInfo?.treasury_account_id"/>
        </template>
      </Property>
      <Property id="createTransaction" full-width>
        <template #name>Create Transaction</template>
        <template #value>
          <TransactionLink :transactionLoc="tokenInfo?.created_timestamp ?? undefined"/>
        </template>
      </Property>
      <Property id="createdAt" full-width>
        <template #name>Created at</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="tokenInfo?.created_timestamp"/>
        </template>
      </Property>
      <Property id="modifiedAt" full-width>
        <template #name>Modified at</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="tokenInfo?.modified_timestamp"/>
        </template>
      </Property>


    </template>

  </DashboardCardV2>

  <DashboardCardV2 v-else-if="isErc" collapsible-key="ercTokenSummary">
    <template #title>Supporting ERC Contract</template>

    <template #content>

      <Property id="entityId" full-width>
        <template #name>
          Contract ID
        </template>
        <template #value>
          <ContractLink :contract-id="tokenId"/>
        </template>
      </Property>

      <Property id="memo" full-width>
        <template #name>Memo</template>
        <template #value>
          <BlobValue :blob-value="contractInfo?.memo" :show-none="true" :base64="true" :show-base64-as-extra="true"/>
        </template>
      </Property>

      <Property id="createTransaction" full-width>
        <template #name>Create Transaction</template>
        <template #value>
          <TransactionLink :transactionLoc="contractInfo?.created_timestamp ?? undefined"/>
        </template>
      </Property>
      <Property id="verificationStatus" full-width>
        <template v-slot:name>Verification Status</template>
        <template v-slot:value>
          {{ verificationStatus }}
        </template>
      </Property>

      <Property id="contractName" full-width>
        <template v-slot:name>Contract Name</template>
        <template v-slot:value>
          <StringValue :string-value="contractName ?? undefined"/>
        </template>
      </Property>

    </template>

  </DashboardCardV2>

  <MirrorLink :network="network" entityUrl="tokens" :loc="tokenId"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import BlobValue from "@/components/values/BlobValue.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import EntityIDView from "@/components/values/EntityIDView.vue";
import Property from "@/components/Property.vue";
import PublicLabel from "@/components/values/PublicLabel.vue";
import StringValue from "@/components/values/StringValue.vue";
import TokenActions from "@/components/token/TokenActions.vue";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";
import {WalletManagerStatus} from "@/utils/wallet/WalletManagerV4.ts";
import {
  TOKEN_NAME_DISPLAY_LENGTH,
  TOKEN_SYMBOL_DISPLAY_LENGTH,
  truncateWithEllipsis
} from "@/schemas/MirrorNodeUtils.ts";
import {routeManager, walletManager} from "@/utils/RouteManager.ts";
import MirrorLink from "@/components/MirrorLink.vue";
import {SyntheticTokenAnalyzer} from "@/utils/analyzer/SyntheticTokenAnalyzer.ts";
import {formatUnits} from "ethers";
import ArrowLink from "@/components/ArrowLink.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TransactionLink from "@/components/values/TransactionLink.vue";
import ContractLink from "@/components/values/link/ContractLink.vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";


const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})

//
// Synthetic Token Analyzer
//
const tokenLoc = computed(() => props.tokenId)
const tokenAnalyzer = new SyntheticTokenAnalyzer(tokenLoc)
onMounted(() => tokenAnalyzer.mount())
onBeforeUnmount(() => tokenAnalyzer.unmount())

const tokenId = tokenAnalyzer.tokenId
const tokenAddress = tokenAnalyzer.tokenAddress
const tokenChecksum = tokenAnalyzer.tokenChecksum
const tokenInfo = tokenAnalyzer.tokenInfo

const contractInfo = tokenAnalyzer.contractInfo

const isHts = tokenAnalyzer.isHts
const isErc = tokenAnalyzer.isErc

const displayName = computed(() => {
  const name = tokenAnalyzer.name.value
  return name !== null ? truncateWithEllipsis(name, TOKEN_NAME_DISPLAY_LENGTH) : null
})

const displaySymbol = computed(() => {
  const symbol = tokenAnalyzer.symbol.value
  return symbol !== null ? truncateWithEllipsis(symbol, TOKEN_SYMBOL_DISPLAY_LENGTH) : null
})

const title = computed(() => {
  return tokenAnalyzer.isLoaded.value ? `${displayName.value} (${displaySymbol.value})` : ""
})

const holders = tokenAnalyzer.holders
const decimals = tokenAnalyzer.decimals

const displayTotalSupply = computed(() => {
  let result: string | null
  if (tokenAnalyzer.totalSupply.value !== null && decimals.value !== null) {
    result = formatUnits(tokenAnalyzer.totalSupply.value, Number(decimals.value))
  } else {
    result = tokenAnalyzer.totalSupply.value
  }
  console.log(`displayTotalSupply: ${result}`)
  return result
})

const displayType = computed(() => {
  let result: string
  switch (tokenAnalyzer.type.value) {
    case "ERC-20":
      result = "Fungible Token (ERC-20)"
      break
    case "ERC-721":
      result = "NFT (ERC-721)"
      break
    case "ERC-1155":
    default:
      result = "NFT (ERC-1155)"
  }
  return result
})

const contractRoute = computed(() => {
  return tokenId.value !== null ? routeManager.makeRouteToContract(tokenId.value) : null
})

//
// Label
//
const indexLookup = PublicLabelsCache.instance.makeLookup()
onMounted(() => indexLookup.mount())
onBeforeUnmount(() => indexLookup.unmount())
const index = indexLookup.entity
const label = computed(() => tokenId.value ? index.value?.lookup(tokenId.value) ?? null : null)

//
// ContractAnalyzer
//
const contractId = computed(() => isErc.value ? tokenId.value : null)
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const contractName = contractAnalyzer.contractName
const verificationStatus = computed(() => {
  let result: string
  if (contractAnalyzer.isVerified.value) {
    result = contractAnalyzer.fullMatch.value ? "Full Match" : "Partial Match"
  } else {
    result = "Unverified"
  }
  return result
})


//
// Tooltip
//
const tokenIdTooltip = computed(() => !isHts.value
    ? `This token is implemented by a smart contract which has a ${tokenAnalyzer.type.value} compliant interface. So this is the ID of a contract.`
    : undefined
)

const isWalletConnected = computed(() => walletManager.status.value == WalletManagerStatus.connected)

const onActionCompleted = () => {
  // if (tokenAnalyzer.isNft.value) {
  //   nftHolderTableController.refresh()
  // } else {
  //   tokenBalanceTableController.refresh()
  // }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.title-extra {
  color: var(--network-text-accent-color);
  word-break: break-all;
}

</style>
