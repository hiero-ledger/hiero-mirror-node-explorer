// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
  >

    <template #tableHeaders>

      <TableHeaderView>TOKEN ID</TableHeaderView>
      <TableHeaderView :align-right="true">SERIAL #</TableHeaderView>
      <TableHeaderView>SPENDER</TableHeaderView>
      <TableHeaderView>TIME</TableHeaderView>
      <TableHeaderView v-if="isWalletConnected" :align-right="true"></TableHeaderView>

    </template>

    <template #tableCells="allowance">

      <TableDataView>
        <TokenLink class="entity-id" :token-id="allowance.token_id ?? undefined" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <div class="h-is-numeric">
          {{ allowance.serial_number }}
        </div>
      </TableDataView>

      <TableDataView>
        <AccountLink :account-id="allowance.spender" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="allowance.modified_timestamp"/>
      </TableDataView>

      <TableDataView v-if="isWalletConnected">
        <i class="far fa-trash-alt" @click="emit('deleteAllowance', allowance)"/>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import TimestampValue from "@/components/values/TimestampValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import {walletManager} from "@/router";
import {NftAllowanceTableController} from "@/components/allowances/NftAllowanceTableController";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

const emit = defineEmits(["deleteAllowance"])

const props = defineProps({
  controller: {
    type: Object as PropType<NftAllowanceTableController>,
    required: true
  }
})

const dataSource = new DynamicDataSource(props.controller)

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
