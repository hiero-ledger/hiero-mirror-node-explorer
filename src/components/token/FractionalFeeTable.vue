// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
  >

    <template #tableHeaders>

      <TableHeaderView>FRACTIONAL FEE</TableHeaderView>
      <TableHeaderView>FEE CURRENCY</TableHeaderView>
      <TableHeaderView>COLLECTOR ACCOUNT</TableHeaderView>
      <TableHeaderView :align-right="true">MIN</TableHeaderView>
      <TableHeaderView :align-right="true">MAX</TableHeaderView>
      <TableHeaderView :align-right="true">NET</TableHeaderView>

    </template>

    <template #tableCells="fee">


      <TableDataView>
        <StringValue :string-value="makeAmount(fee.amount)"/>
      </TableDataView>

      <TableDataView>
        <TokenLink :show-extra="true" :token-id="fee.denominating_token_id ?? undefined"/>
      </TableDataView>

      <TableDataView>
        <AccountLink :account-id="fee.collector_account_id"/>
      </TableDataView>

      <TableDataView>
        <PlainAmount :amount="fee.minimum" none-label="None"/>
      </TableDataView>

      <TableDataView>
        <PlainAmount :amount="fee.maximum" none-label="None"/>
      </TableDataView>

      <TableDataView>
        {{ fee.net_of_transfers ? "&check;" : "" }}
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
import TokenLink from "@/components/values/link/TokenLink.vue";
import {FractionalFee, FractionAmount} from "@/schemas/MirrorNodeSchemas";
import StringValue from "@/components/values/StringValue.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer";
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

const vueKey = (fee: FractionalFee) => fee.collector_account_id + "/" + fee.denominating_token_id
const dataSource = new StaticDataSource(props.analyzer.fractionalFees, null, vueKey)

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
