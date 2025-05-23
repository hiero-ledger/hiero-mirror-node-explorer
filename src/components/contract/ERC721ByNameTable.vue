// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="ercs"
      :loading="loading"
      paginated
      backend-pagination
      pagination-order="centered"
      :total="total"
      v-model:current-page="currentPage"
      :per-page="pageSize"
      @cell-click="handleClick"

      :hoverable="true"
      :narrowed="props.narrowed"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
      customRowKey="token_id"
  >
    <o-table-column v-slot="props" field="contract_id" label="CONTRACT ID">
      <ContractIOL class="h-is-bold" :contract-id="props.row.contractId"/>
    </o-table-column>

    <o-table-column v-slot="props" field="name" label="NAME">
      <div class="w400">
        {{ props.row.name }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="symbol" label="SYMBOL">
      <div class="w400">
        {{ props.row.symbol }}
      </div>
    </o-table-column>

    <template v-slot:bottom-left>
      <TablePageSize
          v-model:size="perPage"
      />
    </template>
  </o-table>

  <EmptyTable v-if="!ercs.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, PropType, ref} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {routeManager} from "@/router";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {ERC721Contract} from "@/utils/cache/ERC721Cache.ts";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import {ERC721ByNameTableLoader} from "@/components/contract/ERC721ByNameTableLoader.ts";

const props = defineProps({
  narrowed: Boolean,
  nbItems: Number,
  name: {
    type: String as PropType<string | null>,
    default: null
  }
})
const isMediumScreen = inject('isMediumScreen', true)

const perPage = ref(isMediumScreen ? 15 : 10)
const targetName = computed(() => props.name)
const loader = new ERC721ByNameTableLoader(perPage, targetName)
onMounted(() => loader.mount())
onBeforeUnmount(() => loader.unmount())

const handleClick = (t: ERC721Contract, c: unknown, i: number, ci: number, event: Event) => {
  if (t.contractId !== null) {
    routeManager.routeToContract(t.contractId, event)
  }
}

const ercs = loader.rows
const loading = loader.loading
const total = loader.totalRowCount
const currentPage = loader.currentPage
const pageSize = loader.pageSize

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
