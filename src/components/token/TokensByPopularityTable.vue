// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="tokens"
      :loading="loading"
      paginated
      backend-pagination
      pagination-order="centered"
      :range-before="1"
      :range-after="1"
      :total="total"
      v-model:current-page="currentPage"
      :per-page="perPage"
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
    <o-table-column v-slot="props" field="token_id" label="TOKEN">
      <TokenIOL class="h-is-bold" :token-id="props.row.token_id"/>
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
          :storage-key="AppStorage.TOKEN_TABLE_PAGE_SIZE_KEY"
      />
    </template>
  </o-table>

  <EmptyTable v-if="!tokens.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, PropType, ref} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Token} from '@/schemas/MirrorNodeSchemas.ts';
import {routeManager} from "@/router";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import {AppStorage} from "@/AppStorage";
import {TokensByPopulariyTableLoader} from "@/components/token/TokensByPopularityTableLoader";

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
const loader = new TokensByPopulariyTableLoader(perPage, targetName)
onMounted(() => {
  loader.mount()
})
onBeforeUnmount(() => {
  loader.unmount()
})

const handleClick = (t: Token, c: unknown, i: number, ci: number, event: Event) => {
  if (t.token_id !== null) {
    routeManager.routeToToken(t.token_id, event)
  }
}

const tokens = loader.rows
const loading = loader.loading
const total = loader.totalRowCount
const currentPage = loader.currentPage

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
