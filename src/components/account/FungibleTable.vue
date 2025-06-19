// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="props.controller.rows.value"
      :loading="props.controller.loading.value"
      :paginated="props.controller.paginated.value && props.fullPage"
      backend-pagination
      pagination-order="centered"
      :total="props.controller.totalRowCount.value"
      v-model:current-page="props.controller.currentPage.value"
      :per-page="props.controller.pageSize.value"
      @page-change="props.controller.onPageChange"
      @cell-click="handleClick"
      :checkable="props.checkEnabled"
      v-model:checked-rows="checkedRows"

      :hoverable="true"
      :narrowed="true"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      row-key="token_id"
  >
    <o-table-column v-slot="{ row }" field="token_id" label="TOKEN ID">
      <TokenIOL class="token-id-label" :token-id="row.token_id"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="name" label="NAME">
      {{ makeTokenName(row) }}
    </o-table-column>

    <o-table-column v-slot="{ row }" field="symbol" label="SYMBOL">
      {{ makeTokenSymbol(row) }}
    </o-table-column>

    <o-table-column v-slot="{ row }" field="balance" label="BALANCE">
      <TokenCell
          :account-id="props.controller.accountId.value"
          :token-id="row.token_id"
          :property="TokenCellItem.tokenBalance"
      />
    </o-table-column>

    <o-table-column v-slot="{ row }" field="freeze-status" label="FREEZE STATUS">
      <FreezeStatusView
          :account-id="props.controller.accountId.value"
          :token-id="row.token_id"
      />
    </o-table-column>

    <template v-slot:bottom-left>
      <TablePageSize
          v-if="props.fullPage"
          v-model:size="props.controller.pageSize.value"
      />
    </template>

  </o-table>

  <TablePageSize
      v-if="!props.controller.paginated.value
      && props.controller.showPageSizeSelector.value
      && !props.checkEnabled
      && props.fullPage"
      v-model:size="props.controller.pageSize.value"
      style="width: 102px; margin-left: 4px"
  />

  <EmptyTable v-if="!props.controller.totalRowCount.value"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, watch} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Nft, Token} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {FungibleTableController} from "@/components/account/FungibleTableController";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import {routeManager} from "@/utils/RouteManager.ts";
import FreezeStatusView from "@/components/token/FreezeStatusView.vue";
import {makeTokenName, makeTokenSymbol} from "@/schemas/MirrorNodeUtils.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<FungibleTableController>,
    required: true
  },
  checkEnabled: {
    type: Boolean,
    required: true
  },
  fullPage: {
    type: Boolean,
    default: false
  },
})

const checkedRows = defineModel("checkedTokens", {
  type: Object as PropType<(Token | Nft)[]>,
  default: [] as (Token | Nft)[]
})

watch([props.controller.rows, () => props.checkEnabled], () =>
    checkedRows.value.splice(0)
)

const handleClick = (balance: Token|Nft, c: unknown, i: number, ci: number, event: Event) => {
  if (balance.token_id) {
    routeManager.routeToToken(balance.token_id, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.token-id-label {
  font-weight: 600;
}

</style>
