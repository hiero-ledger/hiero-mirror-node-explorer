// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div id="nft-holder-table">

    <TableViewV3
        :data-source="dataSource"
        :clickable="true"
        @cell-click="handleClick"
    >

      <template #tableHeaders>
        <TableHeaderView>PREVIEW</TableHeaderView>
        <TableHeaderView>#</TableHeaderView>
        <TableHeaderView>NAME</TableHeaderView>
        <TableHeaderView>CREATOR</TableHeaderView>
        <TableHeaderView>OWNER</TableHeaderView>
        <TableHeaderView>DESCRIPTION</TableHeaderView>
      </template>

      <template #tableCells="nft">

        <TableDataView>
          <NftCell
              class="w400"
              :token-id="nft.token_id"
              :serial-number="nft.serial_number"
              :property="NftCellItem.image"/>
        </TableDataView>

        <TableDataView>
          <span class="serial-number">
            {{ nft.serial_number }}
          </span>
        </TableDataView>

        <TableDataView>
          <NftCell
              :token-id="nft.token_id"
              :serial-number="nft.serial_number"
              :property="NftCellItem.name"/>
        </TableDataView>

        <TableDataView>
          <NftCell
              :token-id="nft.token_id"
              :serial-number="nft.serial_number"
              :property="NftCellItem.creator"/>
        </TableDataView>

        <TableDataView>
          <AccountIOL :account-id="nft.account_id"/>
        </TableDataView>

        <TableDataView>
          <NftCell
              :token-id="nft.token_id"
              :serial-number="nft.serial_number"
              :property="NftCellItem.description"/>
        </TableDataView>

      </template>


    </TableViewV3>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {Nft} from "@/schemas/MirrorNodeSchemas";
import {NftHolderTableController} from "@/components/token/NftHolderTableController";
import {routeManager} from "@/router";
import AccountIOL from "@/components/values/link/AccountIOL.vue";
import NftCell, {NftCellItem} from "@/components/token/NftCell.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<NftHolderTableController>,
    required: true
  },
})

const dataSource = new DynamicDataSource(props.controller)

const handleClick = (n: Nft, event: MouseEvent,) => {
  if (n.token_id && n.serial_number) {
    routeManager.routeToSerial(n.token_id, n.serial_number, event);
  }
};

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
