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
      :range-before="1"
      :range-after="1"
      :total="props.controller.totalRowCount.value"
      :current-page="props.controller.currentPage.value"
      :per-page="props.controller.pageSize.value"
      @page-change="props.controller.onPageChange"
      @cellClick="handleClick"

      :hoverable="true"
      :narrowed="true"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      v-model:checked-rows="checkedRows"
      :checkable="props.checkEnabled"

      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-previous-label="Previous page"
  >

    <o-table-column v-slot="{ row }" field="image" label="IMAGE">
      <NftCell
          :token-id="row.token_id"
          :serial-number="row.serial_number"
          :property="NftCellItem.image"
          :size="32"
      />
    </o-table-column>

    <o-table-column v-slot="{ row }" field="token_id" label="TOKEN ID">
      <TokenIOL class="token-id-label" :token-id="row.token_id"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="serial" label="SERIAL #">
      {{ row.serial_number }}
    </o-table-column>

    <o-table-column v-slot="{ row }" field="name" label="COLLECTION NAME">
      <TokenCell class="is-inline-block" :token-id="row.token_id" :property="TokenCellItem.tokenName"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="name" label="SYMBOL">
      <TokenCell class="is-inline-block" :token-id="row.token_id" :property="TokenCellItem.tokenSymbol"/>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="sender" label="SENDER">
      <div>{{ row.sender_id }}</div>
    </o-table-column>

    <o-table-column v-slot="{ row }" field="timestamp" label="AIRDROP TIME">
      <TimestampValue v-bind:timestamp="row.timestamp.from"/>
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
import {TokenAirdrop} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {routeManager} from "@/router";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {PendingAirdropTableController} from "@/components/account/PendingAirdropTableController";
import NftCell, {NftCellItem} from "@/components/token/NftCell.vue";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<PendingAirdropTableController>,
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

const checkedRows = defineModel("checkedAirdrops", {
  type: Object as PropType<TokenAirdrop[]>,
  default: [] as TokenAirdrop[]
})

watch([props.controller.rows, () => props.checkEnabled], () => checkedRows.value.splice(0))

const handleClick = (airdrop: TokenAirdrop, c: unknown, i: number, ci: number, event: Event) => {
  if (airdrop.token_id && airdrop.serial_number) {
    routeManager.routeToSerial(airdrop.token_id, airdrop.serial_number, event)
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
