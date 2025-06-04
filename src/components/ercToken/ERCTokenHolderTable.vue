// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="holders"
      :loading="loading"
      :paginated="paginated"
      backend-pagination
      pagination-order="centered"
      :total="total"
      v-model:current-page="currentPage"
      :per-page="perPage"
      @page-change="onPageChange"
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

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {routeManager} from "@/utils/RouteManager.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints.ts";
import EmptyTable from "@/components/EmptyTable.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";
import {AppStorage} from "@/AppStorage.ts";
import {ERCTokenHolderTableController} from "@/components/ercToken/ERCTokenHolderTableController.ts";

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

const blockscoutURL = computed(() => routeManager.currentNetworkEntry.value.blockscoutURL)
const tokenAddress = computed(() => props.tokenAddress)
const tableController = new ERCTokenHolderTableController(
    tokenAddress,
    10,
    blockscoutURL,
    AppStorage.ERC_TOKEN_HOLDER_TABLE_PAGE_SIZE_KEY)
onMounted(() => tableController.mount())
onBeforeUnmount(() => tableController.unmount())

const loading = tableController.loading
const holders = tableController.rows
const paginated = tableController.paginated
const perPage = tableController.pageSize
const total = tableController.totalRowCount
const currentPage = tableController.currentPage
const onPageChange = tableController.onPageChange

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>
