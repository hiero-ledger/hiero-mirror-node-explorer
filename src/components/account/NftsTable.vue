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

  >

    <o-table-column v-slot="{ row }" field="image" label="IMAGE">
      <NftCell
          :token-id="row.token_id"
          :serial-number="row.serial_number"
          :property="NftCellItem.image"
          :size="32"
      />
    </o-table-column>

    <o-table-column v-slot="{ row }" field="token-id" label="TOKEN ID">
      <TokenIOL class="token-id-label" :token-id="row.token_id"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="serial" label="SERIAL #">
      {{ row.serial_number }}
    </o-table-column>

    <o-table-column v-slot="{ row }" field="token-name" label="COLLECTION NAME">
      <TokenCell class="is-inline-block" :token-id="row.token_id" :property="TokenCellItem.tokenName"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="token-name" label="SYMBOL">
      <TokenCell class="is-inline-block" :token-id="row.token_id" :property="TokenCellItem.tokenSymbol"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="name" label="NFT NAME">
      <NftCell :token-id="row.token_id" :serial-number="row.serial_number" :property="NftCellItem.name"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="creator" label="CREATOR">
      <NftCell :token-id="row.token_id" :serial-number="row.serial_number" :property="NftCellItem.creator"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="freeze-status" label="FREEZE STATUS">
      <FreezeStatusView :account-id="accountId" :token-id="row.token_id"/>
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
import EmptyTable from "@/components/EmptyTable.vue";
import NftCell, {NftCellItem} from "@/components/token/NftCell.vue";
import {NftsTableController} from "@/components/account/NftsTableController";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {routeManager} from "@/utils/RouteManager.ts";
import FreezeStatusView from "@/components/token/FreezeStatusView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<NftsTableController>,
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

const checkedRows = defineModel("checkedNfts", {
  type: Object as PropType<(Token | Nft)[]>,
  default: [] as (Token | Nft)[]
})

watch([props.controller.rows, () => props.checkEnabled], () =>
    checkedRows.value.splice(0)
)

const handleClick = (nft: Token | Nft, c: unknown, i: number, ci: number, event: Event,) => {
  if (nft.token_id && "serial_number" in nft) {
    routeManager.routeToSerial(nft.token_id, nft.serial_number, event);
  }
};

const accountId = props.controller.accountId

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.token-id-label {
  font-weight: 600;
}

</style>
