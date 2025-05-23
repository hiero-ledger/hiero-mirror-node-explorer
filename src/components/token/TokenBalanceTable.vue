// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div id="token-balance-table">

    <o-table
        :data="tokenBalances"
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
        :narrowed="true"
        :striped="true"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

        customRowKey="account"
    >
      <o-table-column v-slot="props" field="account" label="ACCOUNT ID">
        <AccountIOL class="account-id" :account-id="props.row.account"/>
      </o-table-column>

      <o-table-column v-slot="props" field="balance" label="BALANCE" position="right">
        <TokenAmount :amount="BigInt(props.row.balance)" :token-id="tokenId"/>
      </o-table-column>

      <template v-slot:bottom-left>
        <TablePageSize
            v-model:size="perPage"
        />
      </template>

    </o-table>

    <TablePageSize
        v-if="!paginated && showPageSizeSelector"
        v-model:size="perPage"
        style="width: 116px; margin-left: 4px"
    />

    <EmptyTable v-if="!tokenBalances.length"/>

  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {TokenDistribution} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import TokenAmount from "@/components/values/TokenAmount.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {TokenBalanceTableController} from "@/components/token/TokenBalanceTableController";
import AccountIOL from "@/components/values/link/AccountIOL.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<TokenBalanceTableController>,
    required: true
  },
})

const handleClick = (t: TokenDistribution, c: unknown, i: number, ci: number, event: Event) => {
  if (t.account) {
    routeManager.routeToAccount(t.account, event)
  }
}

const tokenId = props.controller.tokenId.value
const tokenBalances = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize
const paginated = props.controller.paginated
const showPageSizeSelector = props.controller.showPageSizeSelector

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.account-id {
  font-weight: 600;
}

</style>
