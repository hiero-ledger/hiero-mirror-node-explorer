// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="holders"
      :loading="loading"
      @cell-click="handleClick"

      :hoverable="true"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      row-key="account"
  >
    <o-table-column v-slot="props" field="account" label="ACCOUNT">
      <EVMAddress :address="props.row.address.hash" :show-id="false"/>
    </o-table-column>

    <o-table-column v-slot="props" field="balance" label="BALANCE">
      <div class="w250">
        {{ props.row.value }}
      </div>
    </o-table-column>

  </o-table>

  <EmptyTable v-if="!holders.length"/>

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
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";

const props = defineProps({
  tokenAddress: {
    type: String as PropType<string | null>,
    default: null
  }
})

const handleClick = async (tokenHolder: Blockscout.Holder, c: unknown, i: number, ci: number, event: Event) => {

  const evmAddress = tokenHolder.address.hash
  const contractInfo = await ContractByAddressCache.instance.lookup(evmAddress)
  if (contractInfo?.contract_id) {
    await routeManager.routeToContract(contractInfo.contract_id, event)
  } else {
    await routeManager.routeToAccount(evmAddress, event)
  }
}

  const loading = ref(false)
  const holders = ref<Blockscout.Holder[]>([])

  onMounted(async () => {
    const blockscoutURL = routeManager.currentNetworkEntry.value.blockscoutURL
    if (blockscoutURL !== null) {
      loading.value = true
      try {
        const url = blockscoutURL + "api/v2/tokens/" + props.tokenAddress + "/holders"
        const response = await axios.get<Blockscout.HolderResponse>(url)
        holders.value = response.data.items.slice(0, 10)
      } catch (reason) {
        console.log("reason=" + reason)
      } finally {
        loading.value = false
      }
    }
  })

  onBeforeUnmount(() => {
    holders.value = []
  })

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>
