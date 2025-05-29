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

      row-key="token_id"
  >
    <o-table-column v-slot="props" field="token_id" label="TOKEN">
      <ERCTokenIOL :evm-address="props.row.token.address"/>
    </o-table-column>

    <o-table-column v-slot="props" field="token_id" label="ERC TYPE">
      {{ props.row.token.type }}
    </o-table-column>

    <o-table-column v-slot="props" field="token_id" label="SUPPORT">
      <ERCTokenSupport :evm-address="props.row.token.address"/>
    </o-table-column>

    <o-table-column v-slot="props" field="token_id" label="ADDRESS">
      <EVMAddress :address="props.row.token.address"
                  :show-id="false"
                  compact/>
    </o-table-column>

    <o-table-column v-slot="props" field="name" label="NAME">
      <div class="w250">
        {{ props.row.token.name ?? "" }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="symbol" label="SYMBOL">
      <div class="w250">
        {{ props.row.token.symbol ?? "" }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="balance" label="BALANCE">
      <div class="w250">
        {{ props.row.value }}
      </div>
    </o-table-column>

  </o-table>

  <EmptyTable v-if="!tokens.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, PropType, ref} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import axios from "axios";
import {routeManager} from "@/router.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints.ts";
import EmptyTable from "@/components/EmptyTable.vue";
import ERCTokenIOL from "@/components/values/link/ERCTokenIOL.vue";
import ERCTokenSupport from "@/components/ercToken/ERCTokenSupport.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {EntityID} from "@/utils/EntityID";
import {BlockscoutTokenBalance} from "@/schemas/BlockScoutSchemas.ts";

const props = defineProps({
  accountAddress: {
    type: String as PropType<string | null>,
    default: null
  }
})

const handleClick = async (tokenBalance: BlockscoutTokenBalance, c: unknown, i: number, ci: number, event: Event) => {

  const evmAddress = tokenBalance.token.address
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
const tokens = ref<BlockscoutTokenBalance[]>([])

onMounted(async () => {
  const blockscoutURL = routeManager.currentNetworkEntry.value.blockscoutURL
  if (blockscoutURL !== null) {
    loading.value = true
    try {
      const url = blockscoutURL + "api/v2/addresses/" + props.accountAddress + "/token-balances"
      const response = await axios.get<BlockscoutTokenBalance[]>(url)
      tokens.value = response.data.slice(0, 15)
    } catch (reason) {
      console.log("reason=" + reason)
    } finally {
      loading.value = false
    }
  }
})

onBeforeUnmount(() => {
  tokens.value = []
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>
