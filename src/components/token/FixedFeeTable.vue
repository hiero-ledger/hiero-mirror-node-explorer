// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
  >

    <template #tableHeaders>

      <TableHeaderView :align-right="true">FIXED FEE</TableHeaderView>
      <TableHeaderView>FEE CURRENCY</TableHeaderView>
      <TableHeaderView>COLLECTOR ACCOUNT</TableHeaderView>

    </template>

    <template #tableCells="fee">

      <TableDataView>
        <PlainAmount v-if="fee.denominating_token_id" :amount="fee.amount"/>
        <HbarAmount v-else :amount="fee.amount" timestamp="0" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <TokenLink v-if="fee.denominating_token_id"
                   :show-extra="true" :token-id="fee.denominating_token_id"/>
        <div v-else>{{ cryptoName }}</div>
      </TableDataView>

      <TableDataView>
        <AccountLink :account-id="fee.collector_account_id"/>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import AccountLink from "@/components/values/link/AccountLink.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import {FixedCustomFee, FixedFee} from "@/schemas/MirrorNodeSchemas.ts";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  fees: {
    type: Object as PropType<FixedFee[] | FixedCustomFee[] | null>,
    required: true
  }
})

const fees = computed(() => props.fees ?? [])
const vueKey = (fee: FixedFee|FixedCustomFee) => fee.collector_account_id + "/" + fee.denominating_token_id
const dataSource = new StaticDataSource(fees, null, vueKey)

const cryptoName = CoreConfig.inject().cryptoName

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
