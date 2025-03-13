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
      <TableHeaderView>TIME</TableHeaderView>
      <TableHeaderView :align-right="true">AMOUNT</TableHeaderView>
      <TableHeaderView v-if="isWalletConnected" :align-right="true"></TableHeaderView>

    </template>

    <template #tableCells="allowance">

      <TableDataView>
        <AccountLink class="entity-id" :account-id="allowance.spender" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="allowance.timestamp.from"/>
      </TableDataView>

      <TableDataView>
        <HbarAmount :amount="allowance.amount_granted"/>
      </TableDataView>

      <TableDataView v-if="isWalletConnected">
        <i class="fa fa-pen" @click="emit('editAllowance', allowance)"/>
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import {HbarAllowanceTableController} from "@/components/allowances/HbarAllowanceTableController";
import TimestampValue from "@/components/values/TimestampValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {walletManager} from "@/router";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableView from "@/tables/TableView.vue";

const emit = defineEmits(["editAllowance"])

const props = defineProps({
  controller: {
    type: Object as PropType<HbarAllowanceTableController>,
    required: true
  }
})

const isWalletConnected = computed(
    () => walletManager.accountId.value === props.controller.accountId.value
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
