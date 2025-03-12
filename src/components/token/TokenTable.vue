// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableView
      :controller="props.controller"
      :clickable="true"
      :page-size-storage-key="AppStorage.TOKEN_TABLE_PAGE_SIZE_KEY"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>TOKEN</TableHeaderView>
      <TableHeaderView>NAME</TableHeaderView>
      <TableHeaderView>SYMBOL</TableHeaderView>

    </template>

    <template #tableCells="token">

      <TableDataView>
        <TokenIOL class="token_id" :token-id="token.token_id"/>
      </TableDataView>

      <TableDataView>
        <div class="w250">
          {{ token.name }}
        </div>
      </TableDataView>

      <TableDataView>
        <div class="w250">
          {{ token.symbol }}
        </div>
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {routeManager} from "@/router";
import {Token} from "@/schemas/MirrorNodeSchemas";
import {TokenTableController} from "@/components/token/TokenTableController";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import {AppStorage} from "@/AppStorage";
import TableView from "@/tables/TableView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<TokenTableController>,
    required: true
  },
  narrowed: {
    type: Boolean,
    default: false
  }
})

const handleClick = (t: Token, event: MouseEvent) => {
  if (t.token_id) {
    routeManager.routeToToken(t.token_id, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.token_id {
  font-weight: 600;
}

</style>
