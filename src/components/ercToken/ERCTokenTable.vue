// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="tokens"
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

      row-key="token_id"
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

    <template v-slot:bottom-left>
      <TablePageSize
          v-model:size="perPage"
      />
    </template>
  </o-table>

  <EmptyTable v-if="!tokens.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {routeManager} from "@/utils/RouteManager.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints.ts";
import EmptyTable from "@/components/EmptyTable.vue";
import ERCTokenIOL from "@/components/values/link/ERCTokenIOL.vue";
import ERCTokenSupport from "@/components/ercToken/ERCTokenSupport.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {EntityID} from "@/utils/EntityID";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";
import {AppStorage} from "@/AppStorage.ts";
import {ERCTokenTableController} from "@/components/ercToken/ERCTokenTableController.ts";
import TablePageSize from "@/components/transaction/TablePageSize.vue";

const handleClick = async (tokenInfo: Blockscout.TokenInfo, c: unknown, i: number, ci: number, event: Event) => {

  const evmAddress = tokenInfo.address
  const contractInfo = await ContractByAddressCache.instance.lookup(evmAddress)
  if (contractInfo) {
    await routeManager.routeToToken(evmAddress, event)
  } else {
    const tokenId = EntityID.fromAddress(evmAddress)?.toString()
    if (tokenId) {
      await routeManager.routeToToken(tokenId, event)
    } else {
      console.log("Failed to construct route for ERC token address: " + evmAddress)
    }
  }
}

const blockscoutURL = computed(() => routeManager.currentNetworkEntry.value.blockscoutURL)
const tableController = new ERCTokenTableController(10, blockscoutURL, AppStorage.ERC_TOKEN_TABLE_PAGE_SIZE_KEY)
onMounted(() => tableController.mount())
onBeforeUnmount(() => tableController.unmount())

const loading = tableController.loading
const tokens = tableController.rows
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
