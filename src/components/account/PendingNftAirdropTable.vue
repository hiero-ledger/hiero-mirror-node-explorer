// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableView
      :controller="props.controller"
      :clickable="true"
      :page-size-storage-key="AppStorage.ACCOUNT_TOKENS_TABLE_PAGE_SIZE_KEY"
      :pagination-disabled="!props.fullPage"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>TOKEN ID</TableHeaderView>
      <TableHeaderView>NAME</TableHeaderView>
      <TableHeaderView>SYMBOL</TableHeaderView>
      <TableHeaderView :align-right="true">AMOUNT</TableHeaderView>
      <TableHeaderView>SENDER</TableHeaderView>
      <TableHeaderView>AIRDROP TIME</TableHeaderView>

    </template>

    <template #tableCells="airdrop">

      <TableDataView>
        <TokenIOL class="token-id-label" :token-id="airdrop.token_id"/>
      </TableDataView>

      <TableDataView>
        <TokenCell class="is-inline-block" :token-id="airdrop.token_id" :property="TokenCellItem.tokenName"/>
      </TableDataView>

      <TableDataView>
        <TokenCell class="is-inline-block" :token-id="airdrop.token_id" :property="TokenCellItem.tokenSymbol"/>
      </TableDataView>

      <TableDataView>
        <TokenAmount
            v-if="! airdrop.serial_number"
            :amount="BigInt(airdrop.amount)"
            :token-id="airdrop.token_id"
        />
      </TableDataView>

      <TableDataView>
        <div>{{ airdrop.sender_id }}</div>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="airdrop.timestamp.from"/>
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, watch} from 'vue';
import {TokenAirdrop} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import {AppStorage} from "@/AppStorage";
import {PendingAirdropTableController} from "@/components/account/PendingAirdropTableController";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableView from "@/tables/TableView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TokenAmount from "@/components/values/TokenAmount.vue";

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

const handleClick = (airdrop: TokenAirdrop, c: unknown, i: number, ci: number, event: MouseEvent) => {
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
