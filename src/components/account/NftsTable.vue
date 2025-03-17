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

      <TableHeaderView>IMAGE</TableHeaderView>
      <TableHeaderView>TOKEN ID</TableHeaderView>
      <TableHeaderView :align-right="true">SERIAL #</TableHeaderView>
      <TableHeaderView>COLLECTION NAME</TableHeaderView>
      <TableHeaderView>SYMBOL</TableHeaderView>
      <TableHeaderView>NFT NAME</TableHeaderView>
      <TableHeaderView>CREATOR</TableHeaderView>

    </template>

    <template #tableCells="token">

      <TableDataView>
        <NftCell
            :token-id="token.token_id"
            :serial-number="token.serial_number"
            :property="NftCellItem.image"
            :size="32"
        />
      </TableDataView>

      <TableDataView>
        <TokenIOL class="token-id-label" :token-id="token.token_id"/>
      </TableDataView>

      <TableDataView>
        {{ token.serial_number }}
      </TableDataView>

      <TableDataView>
        <TokenCell class="is-inline-block" :token-id="token.token_id" :property="TokenCellItem.tokenName"/>
      </TableDataView>

      <TableDataView>
        <TokenCell class="is-inline-block" :token-id="token.token_id" :property="TokenCellItem.tokenSymbol"/>
      </TableDataView>

      <TableDataView>
        <NftCell :token-id="token.token_id" :serial-number="token.serial_number" :property="NftCellItem.name"/>
      </TableDataView>

      <TableDataView>
        <NftCell :token-id="token.token_id" :serial-number="token.serial_number" :property="NftCellItem.creator"/>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, watch} from 'vue';
import {Nft, Token} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import NftCell, {NftCellItem} from "@/components/token/NftCell.vue";
import {NftsTableController} from "@/components/account/NftsTableController";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

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

const dataSource = new DynamicDataSource(props.controller)

const checkedRows = defineModel("checkedNfts", {
  type: Object as PropType<(Token | Nft)[]>,
  default: [] as (Token | Nft)[]
})

watch([props.controller.rows, () => props.checkEnabled], () =>
    checkedRows.value.splice(0)
)

const handleClick = (nft: Nft, event: MouseEvent,) => {
  if (nft.token_id && nft.serial_number) {
    routeManager.routeToSerial(nft.token_id, nft.serial_number, event);
  }
};

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.token-id-label {
  font-weight: 600;
}

</style>
