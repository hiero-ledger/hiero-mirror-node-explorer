// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 collapsible-key="tokenSummary">
    <template #title>
      <div class="title-extra">
        {{ `${displayName} (${displaySymbol})` }}
      </div>
      <span class="mr-1"/>
      <PublicLabel v-if="label" :label-definition="label"/>
    </template>

    <template #right-control>
      <TokenActions
          v-if="isWalletConnected"
          :analyzer="tokenInfoAnalyzer"
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
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
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

const displayName = computed(() =>
    truncateWithEllipsis(tokenAnalyzer.name.value ?? '?', TOKEN_NAME_DISPLAY_LENGTH)
)
const displaySymbol = computed(() =>
    truncateWithEllipsis(tokenAnalyzer.symbol.value ?? '?', TOKEN_SYMBOL_DISPLAY_LENGTH)
)

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
// HTS TokenInfo analyzer
//
const networkConfig = NetworkConfig.inject()
const tokenInfoAnalyzer = new TokenInfoAnalyzer(tokenId, networkConfig)
onMounted(() => tokenInfoAnalyzer.mount())
onBeforeUnmount(() => tokenInfoAnalyzer.unmount())
const tokenChecksum = tokenInfoAnalyzer.tokenChecksum

//
// Label
//
const indexLookup = PublicLabelsCache.instance.makeLookup()
onMounted(() => indexLookup.mount())
onBeforeUnmount(() => indexLookup.unmount())
const index = indexLookup.entity
const label = computed(() => tokenId.value ? index.value?.lookup(tokenId.value) ?? null : null)

//
// Tooltip
//
const isHts = tokenAnalyzer.isHts
const tokenIdTooltip = computed(() => isHts
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

const parseBigIntString = (s: string | undefined): bigint | undefined => {
  let result: bigint | undefined
  try {
    result = s ? BigInt(s) : undefined
  } catch {
    result = undefined
  }
  return result
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
