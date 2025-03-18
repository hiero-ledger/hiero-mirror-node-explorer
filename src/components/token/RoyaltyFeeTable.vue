// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
  >

    <template #tableHeaders>

      <TableHeaderView :align-right="true">PERCENTAGE FEE</TableHeaderView>
      <TableHeaderView>COLLECTOR ACCOUNT</TableHeaderView>
      <TableHeaderView>FALLBACK FEE</TableHeaderView>
      <TableHeaderView>FEE CURRENCY</TableHeaderView>

    </template>

    <template #tableCells="fee">

      <TableDataView>
        <StringValue :string-value="makeAmount(fee.amount)"/>
      </TableDataView>

      <TableDataView>
        <AccountLink :account-id="fee.collector_account_id"/>
      </TableDataView>

      <TableDataView>
        <PlainAmount v-if="fee.fallback_fee?.denominating_token_id"
                     :amount="fee.fallback_fee?.amount" none-label="None"/>
        <HbarAmount v-else :amount="fee.fallback_fee?.amount" :show-extra="true"/>
      </TableDataView>

      <TableDataView>
        <TokenLink v-if="fee.fallback_fee?.denominating_token_id"
                   :token-id="fee.fallback_fee?.denominating_token_id" :show-extra="true"/>
        <div v-else-if="fee.fallback_fee?.amount">{{ cryptoName }}</div>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import AccountLink from "@/components/values/link/AccountLink.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import {FractionAmount, RoyaltyFee} from "@/schemas/MirrorNodeSchemas";
import StringValue from "@/components/values/StringValue.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer";
import TokenLink from "@/components/values/link/TokenLink.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  analyzer: {
    type: Object as PropType<TokenInfoAnalyzer>,
    required: true
  }
})

const cryptoName = CoreConfig.inject().cryptoName
const vueKey = (fee: RoyaltyFee) => fee.collector_account_id ?? "null"
const dataSource = new StaticDataSource(props.analyzer.royaltyFees, null, vueKey)

const makeAmount = (fraction: FractionAmount): string => {
  let result: string
  const formatter = new Intl.NumberFormat("en-US", {
    style: 'percent',
    maximumFractionDigits: 2
  })
  if (fraction.numerator && fraction.denominator) {
    result = formatter.format(fraction.denominator ? fraction.numerator / fraction.denominator : 0)
  } else {
    result = ""
  }
  return result
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
