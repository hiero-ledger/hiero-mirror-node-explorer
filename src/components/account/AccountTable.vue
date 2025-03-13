// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableView
      :controller="props.controller"
      :clickable="true"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>ID tagada</TableHeaderView>
      <TableHeaderView>CREATED</TableHeaderView>
      <TableHeaderView>TOKENS</TableHeaderView>
      <TableHeaderView>MEMO</TableHeaderView>
      <TableHeaderView :align-right="true">BALANCE</TableHeaderView>

    </template>

    <template #tableCells="account">

      <TableDataView>
        <AccountIOL class="account_id" :account-id="account.account"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="account.created_timestamp"/>
      </TableDataView>

      <TableDataView>
        <div v-if="account.balance?.tokens && account.balance?.tokens?.length > 1">
          {{ account.balance?.tokens?.length }} Types of Token
        </div>
        <div v-else-if="account.balance?.tokens?.length === 1">
          <TokenAmount
              v-bind:amount="BigInt(account.balance?.tokens[0].balance)"
              v-bind:token-id="account.balance?.tokens[0].token_id"
              v-bind:show-extra="true"/>
        </div>
        <div v-else class="h-is-low-contrast">
          None
        </div>
      </TableDataView>

      <TableDataView>
        <div class="w250">
          <BlobValue v-bind:blob-value="account.memo" v-bind:base64="true" v-bind:show-none="true"/>
        </div>
      </TableDataView>

      <TableDataView>
        <HbarAmount v-bind:amount="account.balance?.balance ?? 0"/>
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {AccountInfo} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import HbarAmount from "@/components/values/HbarAmount.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TokenAmount from "@/components/values/TokenAmount.vue";
import {AccountTableController} from "@/components/account/AccountTableController";
import AccountIOL from "@/components/values/link/AccountIOL.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableView from "@/tables/TableView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<AccountTableController>,
    required: true
  },
  narrowed: {
    type: Boolean,
    default: false
  }
})

const handleClick = (a: AccountInfo, event: MouseEvent) => {
  if (a.account) {
    routeManager.routeToAccount(a.account, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.account_id {
  font-weight: 600;
}

</style>
