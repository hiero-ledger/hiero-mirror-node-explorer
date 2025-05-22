// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="accounts"
      :loading="loading"
      :paginated="paginated"
      backend-pagination
      pagination-order="centered"
      :range-before="1"
      :range-after="1"
      :total="total"
      v-model:current-page="currentPage"
      :per-page="perPage"
      @page-change="onPageChange"
      @cell-click="handleClick"

      :hoverable="true"
      :narrowed="narrowed"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
      customRowKey="account"
  >
    <o-table-column v-slot="props" field="account" label="ID">
      <AccountIOL class="account_id" :account-id="props.row.account"/>
    </o-table-column>

    <o-table-column v-slot="props" field="created" label="CREATED">
      <TimestampValue v-bind:timestamp="props.row.created_timestamp"/>
    </o-table-column>

    <o-table-column field="nb_tokens" label="TOKENS" v-slot="props">
      <div v-if="props.row.balance?.tokens?.length > 1">
        {{ props.row.balance?.tokens?.length }} Types of Token
      </div>
      <div v-else-if="props.row.balance?.tokens?.length === 1">
        <TokenAmount
            v-bind:amount="BigInt(props.row.balance?.tokens[0].balance)"
            v-bind:token-id="props.row.balance?.tokens[0].token_id"
            v-bind:show-extra="true"/>
      </div>
      <div v-else class="h-is-low-contrast">
        None
      </div>

    </o-table-column>

    <o-table-column v-slot="props" field="memo" label="MEMO">
      <div class="w250">
        <BlobValue v-bind:blob-value="props.row.memo" v-bind:base64="true" v-bind:show-none="true"/>
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="balance" label="BALANCE" position="right">
      <HbarAmount v-bind:amount="props.row.balance.balance ?? 0"/>
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

  <EmptyTable v-if="!accounts.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {AccountInfo} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import HbarAmount from "@/components/values/HbarAmount.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TokenAmount from "@/components/values/TokenAmount.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {AccountTableController} from "@/components/account/AccountTableController";
import AccountIOL from "@/components/values/link/AccountIOL.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {AppStorage} from "@/AppStorage";

const props = defineProps({
  controller: {
    type: Object as PropType<AccountTableController>,
    required: true
  },
  narrowed: {
    type: Boolean,
    default: false
  }
})

const handleClick = (a: AccountInfo, c: unknown, i: number, ci: number, event: Event) => {
  if (a.account) {
    routeManager.routeToAccount(a.account, event)
  }
}

const accounts = props.controller.rows
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

.account_id {
  font-weight: 600;
}

</style>
