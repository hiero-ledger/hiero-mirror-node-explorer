// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      v-model:current-page="currentPage"
      :data="allowances"
      :hoverable="false"
      :loading="loading"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      :narrowed="true"
      :paginated="paginated"
      pagination-order="centered"
      :per-page="perPage"
      :striped="true"

      :total="total"
      backend-pagination
      customRowKey="spender"
      default-sort="spender"
      @page-change="onPageChange">

    <o-table-column v-slot="props" field="spender" label="SPENDER">
      <AccountLink class="entity-id" :account-id="props.row.spender" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="timestamp" label="TIME">
      <TimestampValue v-bind:timestamp="props.row.timestamp.from"/>
    </o-table-column>

    <o-table-column v-slot="props" field="amount" label="AMOUNT" position="right">
      <HbarAmount :amount="props.row.amount_granted"/>
    </o-table-column>

    <o-table-column v-if="isWalletConnected" v-slot="props" position="right">
      <i class="fa fa-pen" @click="emit('editAllowance', props.row)"/>
    </o-table-column>

    <template v-slot:bottom-left>
      <TablePageSize
          v-model:size="perPage"
      />
    </template>
  </o-table>

  <TablePageSize
      v-if="!paginated && showPageSizeSelector"
      v-model:size="perPage"
      style="width: 116px; margin-left: 4px"
  />

  <EmptyTable v-if="!allowances.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {HbarAllowanceTableController} from "@/components/allowances/HbarAllowanceTableController";
import TimestampValue from "@/components/values/TimestampValue.vue";
import EmptyTable from "@/components/EmptyTable.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {walletManager} from "@/router";
import TablePageSize from "@/components/transaction/TablePageSize.vue";

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

const allowances = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize
const paginated = props.controller.paginated
const showPageSizeSelector = props.controller.showPageSizeSelector

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.entity-id {
  font-weight: 600;
}

</style>
