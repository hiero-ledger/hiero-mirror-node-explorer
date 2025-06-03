// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 collapsible-key="tokenDetails">
    <template #title>
        <span v-if="tokenInfo">
          {{ tokenInfo.type === 'NON_FUNGIBLE_UNIQUE' ? 'NFT Collection' : 'Fungible Token' }}
        </span>
      <div class="title-extra">
        {{ `${displayName} (${displaySymbol})` }}
      </div>
      <span class="mr-1"/>
      <PublicLabel v-if="label" :label-definition="label"/>
    </template>

    <template #right-control>
      <TokenActions
          v-if="isWalletConnected"
          :analyzer="tokenAnalyzer"
          @completed="onActionCompleted"
      />
    </template>

    <template #content>
      <Property id="entityId" full-width>
        <template #name>Token ID</template>
        <template #value>
          <EntityIDView :id="tokenId" :checksum="tokenChecksum"/>
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
                       :token-id="tokenId"/>
        </template>
      </Property>
      <Property id="initialSupply">
        <template #name>Initial Supply</template>
        <template v-if="validEntityId" #value>
          <TokenAmount :amount="parseBigIntString(tokenInfo?.initial_supply)" :show-extra="false"
                       :token-id="tokenId"/>
        </template>
      </Property>
      <Property id="maxSupply">
        <template #name>Max Supply</template>
        <template v-if="validEntityId" #value>
          <div v-if="tokenInfo?.supply_type === 'INFINITE'" class="h-is-low-contrast">Infinite</div>
          <TokenAmount v-else :amount="parseBigIntString(tokenInfo?.max_supply)" :show-extra="false"
                       :token-id="tokenId"/>
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

  <MirrorLink :network="network" entityUrl="tokens" :loc="tokenId"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import EntityIDView from "@/components/values/EntityIDView.vue";
import Property from "@/components/Property.vue";
import PublicLabel from "@/components/values/PublicLabel.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TokenActions from "@/components/token/TokenActions.vue";
import TokenAmount from "@/components/values/TokenAmount.vue";
import TransactionLink from "@/components/values/TransactionLink.vue";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {WalletManagerStatus} from "@/utils/wallet/WalletManagerV4.ts";
import {makeTokenName, makeTokenSymbol} from "@/schemas/MirrorNodeUtils.ts";
import {walletManager} from "@/utils/RouteManager.ts";
import MirrorLink from "@/components/MirrorLink.vue";


const props = defineProps({
  tokenId: {
    type: String,
    required: true
  },
  network: String
})


//
// Token analyzer
//
const tokenId = computed(() => props.tokenId ?? null)
const networkConfig = NetworkConfig.inject()
const tokenAnalyzer = new TokenInfoAnalyzer(tokenId, networkConfig)
onMounted(() => tokenAnalyzer.mount())
onBeforeUnmount(() => tokenAnalyzer.unmount())
const tokenInfo = tokenAnalyzer.tokenInfo
const tokenChecksum = tokenAnalyzer.tokenChecksum
const ethereumAddress = tokenAnalyzer.ethereumAddress
const displayName = computed(() => makeTokenName(tokenInfo.value, 80))
const displaySymbol = computed(() => makeTokenSymbol(tokenInfo.value, 80))
const validEntityId = computed(() => tokenId.value != null)

//
// Label
//
const indexLookup = PublicLabelsCache.instance.makeLookup()
onMounted(() => indexLookup.mount())
onBeforeUnmount(() => indexLookup.unmount())
const index = indexLookup.entity
const label = computed(() => tokenId.value ? index.value?.lookup(tokenId.value) ?? null : null)

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
