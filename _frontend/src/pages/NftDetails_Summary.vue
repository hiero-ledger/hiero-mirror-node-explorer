// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      <div class="title-extra">
        {{ `${displayName} (${displaySymbol})` }}
      </div>
      <div>
        {{ `#${props.serialNumber}` }}
      </div>
    </template>

    <template #media-content>
      <NftPreview
          :type="type"
          :url="imageUrl"
          :size="isSmallScreen ? 450 : 300"
          :auto="false"
      />
    </template>

    <template #media-description>
      <Property v-if="name" id="name" custom-nb-col-class="is-one-quarter">
        <template #name>Name</template>
        <template #value>
          <BlobValue :blob-value="name"/>
        </template>
      </Property>
      <Property v-if="description" id="description" custom-nb-col-class="is-one-quarter">
        <template #name>Description</template>
        <template #value>
          <BlobValue :blob-value="description"/>
        </template>
      </Property>
      <Property id="tokenId" custom-nb-col-class="is-one-quarter">
        <template #name>NFT Collection</template>
        <template #value>
          <router-link :to="tokenRoute">
            <span class="h-is-extra-text mr-2">{{ displayName }}</span>
          </router-link>
          <span>(</span>
          <TokenLink :token-id="props.tokenId" :show-extra="false"/>
          <span>)</span>
        </template>
      </Property>
      <Property id="serialNumber" custom-nb-col-class="is-one-quarter">
        <template #name>Serial #</template>
        <template #value>
          {{ serialNumber }}
        </template>
      </Property>
      <Property id="accountId" custom-nb-col-class="is-one-quarter">
        <template #name>Owner</template>
        <template #value>
          <AccountLink
              :account-id="nftInfo?.account_id"
          />
        </template>
      </Property>
      <Property v-if="creator" id="creator" custom-nb-col-class="is-one-quarter">
        <template #name>Creator</template>
        <template #value>
          {{ creator }}
        </template>
      </Property>
      <Property id="createdTimestamp" custom-nb-col-class="is-one-quarter">
        <template #name>Created</template>
        <template #value>
          <TimestampValue
              :show-none="true"
              :timestamp="nftInfo?.created_timestamp"
          />
        </template>
      </Property>
      <Property id="modifiedTimeStamp" custom-nb-col-class="is-one-quarter">
        <template #name>Modified</template>
        <template #value>
          <TimestampValue
              :timestamp="nftInfo?.modified_timestamp"
              :show-none="true"
          />
        </template>
      </Property>
      <Property id="spenderId" custom-nb-col-class="is-one-quarter">
        <template #name>Spender</template>
        <template #value>
          <AccountLink
              :account-id="nftInfo?.spender"
          />
        </template>
      </Property>
      <Property id="delegatingSpender" custom-nb-col-class="is-one-quarter">
        <template #name>Delegating Spender</template>
        <template #value>
          <AccountLink
              :account-id="nftInfo?.delegating_spender"
          />
        </template>
      </Property>
      <Property id="createTransaction" custom-nb-col-class="is-one-quarter">>
        <template #name>Mint Transaction</template>
        <template #value>
          <TransactionLink :transactionLoc="nftInfo?.created_timestamp ?? undefined"/>
        </template>
      </Property>
    </template>

    <template #footer>
      <MirrorLink :network="props.network" entityUrl="tokens" :loc="normalizedTokenId + '/nfts/' + serialNumber"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {computed, inject, onBeforeUnmount, onMounted, ref} from "vue"
import TimestampValue from "@/components/values/TimestampValue.vue"
import BlobValue from "@/components/values/BlobValue.vue"
import {EntityID} from "@/utils/EntityID"
import Property from "@/components/Property.vue"
import AccountLink from "@/components/values/link/AccountLink.vue"
import {NftBySerialCache} from "@/utils/cache/NftBySerialCache"
import {makeTokenName, makeTokenSymbol} from "@/schemas/MirrorNodeUtils.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import TokenLink from "@/components/values/link/TokenLink.vue";
import TransactionLink from "@/components/values/TransactionLink.vue";
import MirrorLink from "@/components/MirrorLink.vue";
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer";
import NftPreview from "@/components/token/NftPreview.vue";
import {CoreConfig} from "@/config/CoreConfig";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  tokenId: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  network: String,
})

const isSmallScreen = inject("isSmallScreen", true)

const normalizedTokenId = computed(() => {
  const network = routeManager.currentNetworkEntry.value
  const result =
      EntityID.parse(props.tokenId) ??
      EntityID.fromAddress(props.tokenId, network.baseShard, network.baseRealm)
  return result !== null ? result.toString() : null
})

const tokenLookup = TokenInfoCache.instance.makeLookup(normalizedTokenId)
onMounted(() => tokenLookup.mount())
onBeforeUnmount(() => tokenLookup.unmount())

const displayName = computed(() => makeTokenName(tokenLookup.entity.value, 80))
const displaySymbol = computed(() => makeTokenSymbol(tokenLookup.entity.value, 80))

const serialNumber = ref(props.serialNumber)
const nftLookup = NftBySerialCache.instance.makeNftLookup(
    normalizedTokenId,
    serialNumber,
)
onMounted(() => nftLookup.mount())
onBeforeUnmount(() => nftLookup.unmount())

const coreConfig = CoreConfig.inject()
const ipfsGatewayPrefix = coreConfig.ipfsGatewayURL
const arweaveServerURL = coreConfig.arweaveServerURL

const metadata = computed(() => nftLookup.entity.value?.metadata ?? '')
const metadataAnalyzer = new TokenMetadataAnalyzer(metadata, ipfsGatewayPrefix, arweaveServerURL)
onMounted(() => metadataAnalyzer.mount())
onBeforeUnmount(() => metadataAnalyzer.unmount())

const tokenRoute = computed(() => routeManager.makeRouteToToken(props.tokenId))

const nftInfo = nftLookup.entity
const name = metadataAnalyzer.name
const creator = metadataAnalyzer.creator
const description = metadataAnalyzer.description
const type = metadataAnalyzer.type
const imageUrl = metadataAnalyzer.imageUrl

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
