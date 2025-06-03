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
      :total="total"
      v-model:current-page="currentPage"
      :per-page="perPage"
      @page-change="onPageChange"
      @cell-click="handleClick"

      :hoverable="true"
      :narrowed="narrowed"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      row-key="token_id"
  >
    <o-table-column v-slot="props" field="token_id" label="TOKEN">
      <TokenIOL class="token_id" :token-id="props.row.token_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="name" label="NAME">
      <div class="w250">
        {{ props.row.name }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="symbol" label="SYMBOL">
      <div class="w250">
        {{ props.row.symbol }}
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

import {PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Token} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {TokenTableController} from "@/components/token/TokenTableController";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TokenTableController>,
    required: true
  },
  narrowed: {
    type: Boolean,
    default: false
  }
})

const handleClick = (t: Token, c: unknown, i: number, ci: number, event: Event) => {
  if (t.token_id) {
    routeManager.routeToToken(t.token_id, event)
  }
}

const tokens = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.token_id {
  font-weight: 600;
}

</style>
