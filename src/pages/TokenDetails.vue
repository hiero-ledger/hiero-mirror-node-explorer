// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Token Details">

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2 collapsible-key="tokenDetails">
      <template #title>
          <span v-if="tokenInfo">
            {{ tokenInfo.type === 'NON_FUNGIBLE_UNIQUE' ? 'NFT Collection' : 'Fungible Token' }}
          </span>
        <div class="title-extra">
          {{ `${displayName} (${displaySymbol})` }}
        </div>
      </template>

      <template v-if="isWalletConnected" #right-control>
        <TokenActions
            :analyzer="tokenAnalyzer"
            @completed="onActionCompleted"
        />
      </template>

      <template #content>
        <Property id="entityId" full-width>
          <template #name>Token ID</template>
          <template #value>
            <EntityIDView :id="normalizedTokenId" :checksum="tokenChecksum"/>
          </template>
        </Property>
        <Property v-if="ethereumAddress" id="evmAddress" full-width>
          <template #name>EVM Address</template>
          <template #value>
            <EVMAddress :show-id="false" :address="ethereumAddress"/>
          </template>
        </Property>
      </template>

      <template #left-content>
        <Property id="name">
          <template #name>Name</template>
          <template #value>
            <BlobValue :blob-value="tokenInfo?.name" :show-none="true"/>
          </template>
        </Property>
        <Property id="symbol">
          <template #name>Symbol</template>
          <template #value>
            <BlobValue :blob-value="tokenInfo?.symbol" :show-none="true"/>
          </template>
        </Property>
        <Property id="memo">
          <template #name>Memo</template>
          <template #value>
            <BlobValue :blob-value="tokenInfo?.memo" :show-none="true"/>
          </template>
        </Property>
        <Property id="metadata">
          <template #name>Metadata</template>
          <template #value>
            <BlobValue
                :base64="true"
                :blob-value="tokenInfo?.metadata"
                :show-none="true"
            />
          </template>
        </Property>
        <Property id="createTransaction">
          <template #name>Create Transaction</template>
          <template #value>
            <TransactionLink :transactionLoc="tokenInfo?.created_timestamp ?? undefined"/>
          </template>
        </Property>
        <Property id="expiresAt" tooltip="Token expiry is not turned on yet. Value in this field is not relevant.">
          <template #name>
            <span>Expires at</span>
          </template>
          <template #value>
            <TimestampValue :nano="true" :show-none="true" :timestamp="tokenInfo?.expiry_timestamp?.toString()"/>
          </template>
        </Property>
        <Property id="autoRenewPeriod"
                  tooltip="Token auto-renew is not turned on yet. Value in this field is not relevant.">
          <template #name>
            <span>Auto Renew Period</span>
          </template>
          <template #value>
            <DurationValue :number-value="tokenInfo?.auto_renew_period ?? undefined"/>
          </template>
        </Property>
        <Property id="autoRenewAccount"
                  tooltip="Token auto-renew is not turned on yet. Value in this field is not relevant.">
          <template #name>
            <span>Auto Renew Account</span>
          </template>
          <template #value>
            <AccountLink :account-id="tokenInfo?.auto_renew_account"/>
          </template>
        </Property>
        <Property id="freezeDefault">
          <template #name>Freeze Default</template>
          <template #value>
            <StringValue :string-value="tokenInfo?.freeze_default?.toString()"/>
          </template>
        </Property>
      </template>

      <template #right-content>
        <Property id="treasuryAccount">
          <template #name>Treasury Account</template>
          <template #value>
            <AccountLink :account-id="tokenInfo?.treasury_account_id"/>
          </template>
        </Property>
        <Property id="createdAt">
          <template #name>Created at</template>
          <template #value>
            <TimestampValue :show-none="true" :timestamp="tokenInfo?.created_timestamp"/>
          </template>
        </Property>
        <Property id="modifiedAt">
          <template #name>Modified at</template>
          <template #value>
            <TimestampValue :show-none="true" :timestamp="tokenInfo?.modified_timestamp"/>
          </template>
        </Property>
        <Property id="totalSupply">
          <template #name>Total Supply</template>
          <template v-if="validEntityId" #value>
            <TokenAmount :amount="parseBigIntString(tokenInfo?.total_supply)" :show-extra="false"
                         :token-id="normalizedTokenId"/>
          </template>
        </Property>
        <Property id="initialSupply">
          <template #name>Initial Supply</template>
          <template v-if="validEntityId" #value>
            <TokenAmount :amount="parseBigIntString(tokenInfo?.initial_supply)" :show-extra="false"
                         :token-id="normalizedTokenId"/>
          </template>
        </Property>
        <Property id="maxSupply">
          <template #name>Max Supply</template>
          <template v-if="validEntityId" #value>
            <div v-if="tokenInfo?.supply_type === 'INFINITE'" class="h-is-low-contrast">Infinite</div>
            <TokenAmount v-else :amount="parseBigIntString(tokenInfo?.max_supply)" :show-extra="false"
                         :token-id="normalizedTokenId"/>
          </template>
        </Property>
        <Property id="decimals">
          <template #name>Decimals</template>
          <template v-if="validEntityId" #value>
            <StringValue :string-value="tokenInfo?.decimals"/>
          </template>
        </Property>
        <Property id="pauseStatus">
          <template #name>Pause Status</template>
          <template #value>
            <StringValue v-if="tokenInfo?.pause_status === 'NOT_APPLICABLE'"
                         class="h-is-low-contrast" string-value="Not applicable"/>
            <StringValue v-else :string-value="tokenInfo?.pause_status"/>
          </template>
        </Property>
      </template>

    </DashboardCardV2>

    <DashboardCardV2 v-if="tokenInfo" collapsible-key="nftHolders">

      <template #title>
        {{ tokenInfo.type === 'NON_FUNGIBLE_UNIQUE' ? 'NFTs' : 'Balances' }}
      </template>

      <template #left-control>
        <PlayPauseButton :controller="isNft ? nftHolderTableController : tokenBalanceTableController"/>
      </template>

      <template #content>
        <NftHolderTable v-if="isNft" :controller="nftHolderTableController"/>
        <TokenBalanceTable v-else :controller="tokenBalanceTableController"/>
      </template>

    </DashboardCardV2>

    <MetadataSection :metadata-analyzer="metadataAnalyzer"/>

    <TokenKeysSection :token-info="tokenInfo"/>

    <TokenFeesSection v-if="hasCustomFees" :analyzer="analyzer"/>

    <ContractResultsSection :contract-id="normalizedTokenId ?? undefined"/>

    <MirrorLink :network="network" entityUrl="tokens" :loc="tokenId"/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted} from 'vue';
import {useRouter} from "vue-router";
import {routeManager, walletManager} from "@/router";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TokenBalanceTable from "@/components/token/TokenBalanceTable.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import TokenAmount from "@/components/values/TokenAmount.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import TokenActions from "@/components/token/TokenActions.vue";
import {EntityID} from "@/utils/EntityID";
import Property from "@/components/Property.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import NftHolderTable from "@/components/token/NftHolderTable.vue";
import {NftHolderTableController} from "@/components/token/NftHolderTableController";
import {TokenBalanceTableController} from "@/components/token/TokenBalanceTableController";
import AccountLink from "@/components/values/link/AccountLink.vue";
import StringValue from "@/components/values/StringValue.vue";
import TokenFeesSection from "@/components/token/TokenFeesSection.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {makeTokenName, makeTokenSymbol} from "@/schemas/MirrorNodeUtils.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer";
import ContractResultsSection from "@/components/contract/ContractResultsSection.vue";
import MirrorLink from "@/components/MirrorLink.vue";
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer";
import MetadataSection from "@/components/token/MetadataSection.vue";
import TransactionLink from "@/components/values/TransactionLink.vue";
import {CoreConfig} from "@/config/CoreConfig";
import {NetworkConfig} from "@/config/NetworkConfig";
import {WalletManagerStatus} from "@/utils/wallet/WalletManagerV4";
import TokenKeysSection from "@/components/token/TokenKeysSection.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import EntityIDView from "@/components/values/EntityIDView.vue";

const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)
const networkConfig = NetworkConfig.inject()

const normalizedTokenId = computed(() => {
  const network = routeManager.currentNetworkEntry.value
  const result =
      EntityID.parse(props.tokenId)
      ?? EntityID.fromAddress(props.tokenId, network.baseShard, network.baseRealm)
  return result !== null ? result.toString() : null
})
const validEntityId = computed(() => normalizedTokenId.value != null)

const tokenLookup = TokenInfoCache.instance.makeLookup(normalizedTokenId)
onMounted(() => tokenLookup.mount())
onBeforeUnmount(() => tokenLookup.unmount())

const tokenAnalyzer = new TokenInfoAnalyzer(tokenLookup.entity, networkConfig)
onMounted(() => tokenAnalyzer.mount())
onBeforeUnmount(() => tokenAnalyzer.unmount())

const coreConfig = CoreConfig.inject()
const ipfsGatewayPrefix = coreConfig.ipfsGatewayURL
const arweaveServerURL = coreConfig.arweaveServerURL

const metadata = computed(() => tokenLookup.entity.value?.metadata ?? '')
const metadataAnalyzer = new TokenMetadataAnalyzer(metadata, ipfsGatewayPrefix, arweaveServerURL)
onMounted(() => metadataAnalyzer.mount())
onBeforeUnmount(() => metadataAnalyzer.unmount())

const displayName = computed(() => makeTokenName(tokenLookup.entity.value, 80))
const displaySymbol = computed(() => makeTokenSymbol(tokenLookup.entity.value, 80))

const notification = computed(() => {
  let result
  if (!validEntityId.value) {
    result = "Invalid token ID: " + props.tokenId
  } else if (tokenLookup.entity.value == null) {
    if (tokenLookup.isLoaded.value) {
      result = "Token with ID " + props.tokenId + " was not found"
    } else {
      result = null
    }
  } else if (tokenLookup.entity.value?.deleted) {
    result = "Token is deleted"
  } else {
    result = null
  }
  return result
})

const defaultPageSize = isMediumScreen ? 10 : 5

//
// TokenBalanceTableController
//
const fungibleTokenId = computed(() => tokenAnalyzer.isFungible.value ? normalizedTokenId.value : null)
const tokenBalanceTableController = new TokenBalanceTableController(useRouter(), fungibleTokenId, defaultPageSize);
onMounted(() => tokenBalanceTableController.mount())
onBeforeUnmount(() => tokenBalanceTableController.unmount())

//
// NftHolderTableController
//
const nftTokenId = computed(() => tokenAnalyzer.isNft.value ? normalizedTokenId.value : null)
const nftHolderTableController = new NftHolderTableController(useRouter(), nftTokenId, defaultPageSize)
onMounted(() => nftHolderTableController.mount())
onBeforeUnmount(() => nftHolderTableController.unmount())

const isWalletConnected = computed(() => walletManager.status.value == WalletManagerStatus.connected)

const onActionCompleted = () => {
  if (tokenAnalyzer.isNft.value) {
    nftHolderTableController.refresh()
  } else {
    tokenBalanceTableController.refresh()
  }
}

const analyzer = tokenAnalyzer
const tokenInfo = tokenLookup.entity
const isNft = tokenAnalyzer.isNft
const hasCustomFees = tokenAnalyzer.hasCustomFees
const tokenChecksum = tokenAnalyzer.tokenChecksum
const ethereumAddress = tokenAnalyzer.ethereumAddress

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
