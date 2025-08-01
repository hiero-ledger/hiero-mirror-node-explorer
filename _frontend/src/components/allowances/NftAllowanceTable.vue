// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      v-model:current-page="currentPage"
      :data="nfts"
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
      row-key="spender"
      default-sort="spender"
      @page-change="onPageChange">

    <o-table-column v-slot="props" field="token" label="TOKEN ID">
      <TokenLink class="entity-id" :token-id="props.row.token_id" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="serial" label="SERIAL #">
      <div class="h-is-numeric">
        {{ props.row.serial_number }}
      </div>
    </o-table-column>

    <o-table-column v-slot="props" field="spender" label="SPENDER">
      <AccountLink :account-id="props.row.spender" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="timestamp" label="TIME">
      <TimestampValue v-bind:timestamp="props.row.modified_timestamp"/>
    </o-table-column>

    <o-table-column v-if="isWalletConnected" v-slot="props" field="action" position="right">
      <Trash2
          class="icon-in-table"
          :size="16"
          @click="emit('deleteAllowance', props.row)"
      />
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

  <EmptyTable v-if="!nfts.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import TimestampValue from "@/components/values/TimestampValue.vue";
import EmptyTable from "@/components/EmptyTable.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import {NftAllowanceTableController} from "@/components/allowances/NftAllowanceTableController";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {walletManager} from "@/utils/RouteManager.ts";
import {Trash2} from 'lucide-vue-next';

const emit = defineEmits(["deleteAllowance"])

const props = defineProps({
  controller: {
    type: Object as PropType<NftAllowanceTableController>,
    required: true
  }
})

const isWalletConnected = computed(() =>
    walletManager.isHieroWallet.value
    && walletManager.accountId.value === props.controller.accountId.value
)

const nfts = props.controller.rows
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
