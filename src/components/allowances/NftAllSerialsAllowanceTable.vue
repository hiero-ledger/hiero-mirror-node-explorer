// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
  >

    <template #tableHeaders>

      <TableHeaderView>SPENDER</TableHeaderView>
      <TableHeaderView>TOKEN ID</TableHeaderView>
      <TableHeaderView>TIME</TableHeaderView>
      <TableHeaderView v-if="isWalletConnected" :align-right="true"></TableHeaderView>

    </template>

    <template #tableCells="displayedAllowance">

      <TableDataView>
        <AccountLink class="entity-id" :account-id="displayedAllowance.allowance.spender" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <TokenLink :token-id="displayedAllowance.allowance.token_id ?? undefined" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="displayedAllowance.allowance.timestamp.from"/>
      </TableDataView>

      <TableDataView v-if="isWalletConnected">
        <i v-if="displayedAllowance.isEditable" class="far fa-trash-alt" @click="emit('deleteAllowance', displayedAllowance.allowance)"/>
        <InfoTooltip
            v-else
            label="The allowance cannot be modified because the NFT collection is no longer associated with this account."
        />
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import {NftAllowance} from "@/schemas/MirrorNodeSchemas";
import TimestampValue from "@/components/values/TimestampValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import {walletManager} from "@/router";
import InfoTooltip from "@/components/InfoTooltip.vue";
import {NftAllSerialsAllowanceTableController} from "@/components/allowances/NftAllSerialsAllowanceTableController";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

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
