// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="tokens"
      :loading="loading"
      @cell-click="handleClick"

      :hoverable="true"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
      customRowKey="token_id"
  >
    <o-table-column v-slot="props" field="token_id" label="TOKEN">
      <ERCTokenIOL :evm-address="props.row.address"/>
    </o-table-column>

    <o-table-column v-slot="props" field="token_id" label="ERC TYPE">
      {{ props.row.type }}
    </o-table-column>

    <o-table-column v-slot="props" field="token_id" label="SUPPORT">
      <ERCTokenSupport :evm-address="props.row.address"/>
    </o-table-column>

    <o-table-column v-slot="props" field="token_id" label="ADDRESS">
      <EVMAddress :address="props.row.address"
                  :show-id="false"
                  compact/>
    </o-table-column>

    <o-table-column v-slot="props" field="name" label="NAME">
      <div class="w250">
        {{ props.row.name ?? "" }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="symbol" label="SYMBOL">
      <div class="w250">
        {{ props.row.symbol ?? "" }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="symbol" label="HOLDERS">
      <div class="w250">
        {{ props.row.holders }}
      </div>
    </o-table-column>

  </o-table>

  <EmptyTable v-if="!tokens.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, ref} from 'vue';
import axios from "axios";
import {routeManager} from "@/router.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints.ts";
import EmptyTable from "@/components/EmptyTable.vue";
import ERCTokenIOL from "@/components/values/link/ERCTokenIOL.vue";
import ERCTokenSupport from "@/components/ercToken/ERCTokenSupport.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {EntityID} from "@/utils/EntityID";

const handleClick = async (tokenInfo: BlockscoutTokenInfo, c: unknown, i: number, ci: number, event: MouseEvent) => {

  const evmAddress = tokenInfo.address
  const contractInfo = await ContractByAddressCache.instance.lookup(evmAddress)
  if (contractInfo?.contract_id) {
    await routeManager.routeToContract(contractInfo.contract_id, event)
  } else {
    const tokenId = EntityID.fromAddress(evmAddress)?.toString()
    if (tokenId) {
      await routeManager.routeToToken(tokenId, event)
    } else {
      console.log("Failed to construct route for ERC token address: " + evmAddress)
    }
  }
}

const loading = ref(false)
const tokens = ref<object[]>([])

onMounted(async () => {
  const blockscoutURL = routeManager.currentNetworkEntry.value.blockscoutURL
  if (blockscoutURL !== null) {
    loading.value = true
    try {
      const response = await axios.get<BlockscoutTokenResponse>(blockscoutURL + "api/v2/tokens")
      tokens.value = response.data.items
    } catch(reason) {
      console.log("reason=" + reason)
    } finally {
      loading.value = false
    }
  }
})

onBeforeUnmount(() => {
  tokens.value = []
})

//
// https://eth.blockscout.com/api-docs
//

interface BlockscoutTokenInfo {
  circulating_market_cap: string|null
  icon_url: string|null
  name: string|null
  decimals: string|null
  symbol: string|null
  address: string
  type: string
  holders: string|null
  exchange_rate: string|null
  total_supply: string
}

interface BlockscoutTokenResponse {
  items: BlockscoutTokenInfo[]
  next_page_params: object
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.token_id {
  font-weight: 600;
}

</style>
