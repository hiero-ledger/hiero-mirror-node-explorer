// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div id="token-balance-table">

    <TableViewV3
        :data-source="dataSource"
        :clickable="true"
        @cell-click="handleClick"
    >

      <template #tableHeaders>

        <TableHeaderView>ACCOUNT ID</TableHeaderView>
        <TableHeaderView :align-right="true">BALANCE</TableHeaderView>

      </template>

      <template #tableCells="account">

        <TableDataView>
          <AccountIOL class="account-id" :account-id="account.account"/>
        </TableDataView>

        <TableDataView>
          <TokenAmount :amount="BigInt(account.balance)" :token-id="tokenId"/>
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
import {TokenDistribution} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import TokenAmount from "@/components/values/TokenAmount.vue";
import {TokenBalanceTableController} from "@/components/token/TokenBalanceTableController";
import AccountIOL from "@/components/values/link/AccountIOL.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TokenBalanceTableController>,
    required: true
  },
})

const dataSource = new DynamicDataSource(props.controller)

const handleClick = (t: TokenDistribution, c: unknown, i: number, ci: number, event: MouseEvent) => {
  if (t.account) {
    routeManager.routeToAccount(t.account, event)
  }
}

const tokenId = props.controller.tokenId.value

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.account-id {
  font-weight: 600;
}

</style>
