// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
      :clickable="true"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>TOKEN ID</TableHeaderView>
      <TableHeaderView>NAME</TableHeaderView>
      <TableHeaderView>SYMBOL</TableHeaderView>
      <TableHeaderView :align-right="true">BALANCE</TableHeaderView>

    </template>

    <template #tableCells="token">

      <TableDataView>
        <TokenIOL class="token-id-label" :token-id="token.token_id"/>
      </TableDataView>

      <TableDataView>
        {{ token.name }}
      </TableDataView>

      <TableDataView>
        {{ token.symbol }}
      </TableDataView>

      <TableDataView>
        <TokenCell
            :account-id="props.controller.accountId.value"
            :token-id="token.token_id"
            :property="TokenCellItem.tokenBalance"
        />
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, watch} from 'vue';
import {Nft, Token, TokenBalance} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import {FungibleTableController} from "@/components/account/FungibleTableController";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

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

const dataSource = new DynamicDataSource(props.controller)

const checkedRows = defineModel("checkedTokens", {
  type: Object as PropType<(Token | Nft)[]>,
  default: [] as (Token | Nft)[]
})

watch([props.controller.rows, () => props.checkEnabled], () =>
    checkedRows.value.splice(0)
)

const handleClick = (balance: TokenBalance, event: MouseEvent) => {
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
