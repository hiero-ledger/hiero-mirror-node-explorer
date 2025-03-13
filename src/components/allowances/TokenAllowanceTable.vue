// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableView
      :controller="props.controller"
  >

    <template #tableHeaders>

      <TableHeaderView>SPENDER</TableHeaderView>
      <TableHeaderView :align-right="true">AMOUNT</TableHeaderView>
      <TableHeaderView>TOKEN ID</TableHeaderView>
      <TableHeaderView>TIME</TableHeaderView>
      <TableHeaderView v-if="isWalletConnected" :align-right="true"></TableHeaderView>

    </template>

    <template #tableCells="displayedAllowance">

      <TableDataView>
        <AccountLink class="entity-id" :account-id="displayedAllowance.allowance.spender" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <TokenAmount :token-id="displayedAllowance.allowance.token_id" :amount="BigInt(displayedAllowance.allowance.amount_granted)"/>
      </TableDataView>

      <TableDataView>
        <TokenLink :token-id="displayedAllowance.allowance.token_id ?? undefined" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="displayedAllowance.allowance.timestamp.from"/>
      </TableDataView>

      <TableDataView v-if="isWalletConnected">
        <i v-if="displayedAllowance.isEditable" class="fa fa-pen" @click="emit('editAllowance', displayedAllowance.allowance)"/>
        <InfoTooltip
            v-else
            label="The allowance cannot be modified because the token is no longer associated with this account."
        />
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import TimestampValue from "@/components/values/TimestampValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {TokenAllowanceTableController} from "@/components/allowances/TokenAllowanceTableController";
import TokenAmount from "@/components/values/TokenAmount.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import {walletManager} from "@/router";
import InfoTooltip from "@/components/InfoTooltip.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableView from "@/tables/TableView.vue";

const emit = defineEmits(["editAllowance"])

const props = defineProps({
  controller: {
    type: Object as PropType<TokenAllowanceTableController>,
    required: true
  }
})

const isWalletConnected = computed(() =>
    walletManager.isHieroWallet.value
    && walletManager.accountId.value === props.controller.accountId.value
)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.entity-id {
  font-weight: 600;
}

</style>
