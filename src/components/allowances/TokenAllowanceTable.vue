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
      aria-current-label="Current page"
      aria-next-label="Next page"
      aria-page-label="Page"

      aria-previous-label="Previous page"
      backend-pagination
      customRowKey="spender"
      default-sort="spender"
      @page-change="onPageChange">

    <o-table-column v-slot="props" field="spender" label="SPENDER">
      <AccountLink class="entity-id" :account-id="props.row.spender" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="amount" label="AMOUNT">
      <TokenAmount :token-id="props.row.token_id" :amount="BigInt(props.row.amount_granted)"/>
    </o-table-column>

    <o-table-column v-slot="props" field="token" label="TOKEN ID">
      <TokenLink :token-id="props.row.token_id" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="timestamp" label="TIME">
      <TimestampValue v-bind:timestamp="props.row.timestamp.from"/>
    </o-table-column>

    <o-table-column v-if="isWalletConnected" v-slot="props" field="edit-icon" position="right">
      <i v-if="props.row.isEditable" class="fa fa-pen" @click="emit('editAllowance', props.row)"/>
      <InfoTooltip
          v-else
          label="The allowance cannot be modified because the token is no longer associated with this account."
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

  <EmptyTable v-if="!allowances.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, ref, watch} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {TokenAllowance} from "@/schemas/MirrorNodeSchemas";
import {isValidAssociation} from "@/schemas/MirrorNodeUtils.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import TimestampValue from "@/components/values/TimestampValue.vue";
import EmptyTable from "@/components/EmptyTable.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {TokenAllowanceTableController} from "@/components/allowances/TokenAllowanceTableController";
import TokenAmount from "@/components/values/TokenAmount.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import {walletManager} from "@/router";
import InfoTooltip from "@/components/InfoTooltip.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {AppStorage} from "@/AppStorage";

interface DisplayedTokenAllowance extends TokenAllowance {
  isEditable: boolean
}

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

const allowances = ref<DisplayedTokenAllowance[]>([])
watch(props.controller.rows, async () => {
  const result = []
  for (const a of props.controller.rows.value) {
    const allowance: DisplayedTokenAllowance = a as DisplayedTokenAllowance
    allowance.isEditable = await isValidAssociation(a.owner, a.token_id)
    result.push(allowance)
  }
  allowances.value = result
})

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
