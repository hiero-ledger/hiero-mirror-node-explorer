// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
      :clickable="true"
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

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, watch} from 'vue';
import {TokenAirdrop} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import {PendingAirdropTableController} from "@/components/account/PendingAirdropTableController";
import TokenAmount from "@/components/values/TokenAmount.vue";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

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

const dataSource = new DynamicDataSource(props.controller)

const checkedRows = defineModel("checkedAirdrops", {
  type: Object as PropType<TokenAirdrop[]>,
  default: [] as TokenAirdrop[]
})

watch([props.controller.rows, () => props.checkEnabled], () => checkedRows.value.splice(0))

const handleClick = (airdrop: TokenAirdrop, event: MouseEvent) => {
  if (airdrop.token_id) {
    routeManager.routeToToken(airdrop.token_id, event)
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
