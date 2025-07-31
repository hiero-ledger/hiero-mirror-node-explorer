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
      row-key="spender"
      default-sort="spender"
      @page-change="onPageChange">

    <o-table-column v-slot="props" field="spender" label="SPENDER">
      <AccountLink class="entity-id" :account-id="props.row.spender" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="token" label="TOKEN ID">
      <TokenLink :token-id="props.row.token_id" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="timestamp" label="TIME">
      <TimestampValue v-bind:timestamp="props.row.timestamp.from"/>
    </o-table-column>

    <o-table-column v-if="isWalletConnected" v-slot="props" field="action" position="right">
      <i v-if="props.row.isEditable" class="far fa-trash-alt" @click="emit('deleteAllowance', props.row)"/>
      <InfoTooltip
          v-else
          label="The allowance cannot be modified because the NFT collection is no longer associated with this account."
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
import {NftAllowance} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import TimestampValue from "@/components/values/TimestampValue.vue";
import EmptyTable from "@/components/EmptyTable.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import InfoTooltip from "@/components/InfoTooltip.vue";
import {NftAllSerialsAllowanceTableController} from "@/components/allowances/NftAllSerialsAllowanceTableController";
import {isValidAssociation} from "@/schemas/MirrorNodeUtils.ts";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {walletManager} from "@/utils/RouteManager.ts";

interface DisplayedNftAllowance extends NftAllowance {
  isEditable: boolean
}

const emit = defineEmits(["deleteAllowance"])

const props = defineProps({
  controller: {
    type: Object as PropType<NftAllSerialsAllowanceTableController>,
    required: true
  }
})

const isWalletConnected = computed(() =>
    walletManager.isHieroWallet.value
    && walletManager.accountId.value === props.controller.accountId.value
)

const allowances = ref<DisplayedNftAllowance[]>([])
watch(props.controller.rows, async () => {
  const result = []
  for (const a of props.controller.rows.value) {
    const allowance: DisplayedNftAllowance = a as DisplayedNftAllowance
    // isValidAssociation(a.owner, a.token_id).then((r) => allowance.isEditable = r)
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
