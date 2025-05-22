// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div id="nft-holder-table">
    <o-table
        :data="nfts"
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
        :narrowed="true"
        :striped="true"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

        aria-current-label="Current page"
        aria-next-label="Next page"
        aria-page-label="Page"
        aria-previous-label="Previous page"
        customRowKey="serial_number"
    >
      <o-table-column v-slot="props" field="image" label="PREVIEW">
        <NftCell
            class="w400"
            :token-id="props.row.token_id"
            :serial-number="props.row.serial_number"
            :property="NftCellItem.image"/>
      </o-table-column>

      <o-table-column v-slot="props" field="serial" label="#">
        <span class="serial-number">
          {{ props.row.serial_number }}
        </span>
      </o-table-column>

      <o-table-column v-slot="props" field="name" label="NAME">
        <NftCell
            :token-id="props.row.token_id"
            :serial-number="props.row.serial_number"
            :property="NftCellItem.name"/>
      </o-table-column>

      <o-table-column v-slot="props" field="creator" label="CREATOR">
        <NftCell
            :token-id="props.row.token_id"
            :serial-number="props.row.serial_number"
            :property="NftCellItem.creator"/>
      </o-table-column>

      <o-table-column v-slot="props" field="account_id" label="OWNER">
        <AccountIOL :account-id="props.row.account_id"/>
      </o-table-column>

      <o-table-column v-slot="props" field="description" label="DESCRIPTION">
        <NftCell
            :token-id="props.row.token_id"
            :serial-number="props.row.serial_number"
            :property="NftCellItem.description"/>
      </o-table-column>

      <template v-slot:bottom-left>
        <TablePageSize
            v-model:size="perPage"
            :storage-key="AppStorage.NFT_HOLDER_TABLE_PAGE_SIZE_KEY"
        />
      </template>

    </o-table>

    <TablePageSize
        v-if="!paginated && showPageSizeSelector"
        v-model:size="perPage"
        style="width: 116px; margin-left: 4px"
    />

    <EmptyTable v-if="!nfts.length"/>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {Nft} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {NftHolderTableController} from "@/components/token/NftHolderTableController";
import {routeManager} from "@/router";
import AccountIOL from "@/components/values/link/AccountIOL.vue";
import NftCell, {NftCellItem} from "@/components/token/NftCell.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {AppStorage} from "@/AppStorage";

const props = defineProps({
  controller: {
    type: Object as PropType<NftHolderTableController>,
    required: true
  },
})

const handleClick = (n: Nft, c: unknown, i: number, ci: number, event: Event,) => {
  if (n.token_id && n.serial_number) {
    routeManager.routeToSerial(n.token_id, n.serial_number, event);
  }
};

const nfts = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize
const paginated = props.controller.paginated
const showPageSizeSelector = props.controller.showPageSizeSelector

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>

div#nft-holder-table {
  td {
    padding-top: 2px;
    padding-bottom: 2px;
  }
}

span.serial-number {
  font-weight: 600;
}

</style>
