// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="fees"
      :hoverable="false"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      :narrowed="true"
      :striped="false"
  >

    <o-table-column v-slot="props" field="amount" label="FRACTIONAL FEE">
      <StringValue :string-value="makeAmount(props.row.amount)"/>
    </o-table-column>

    <o-table-column v-slot="props" field="token" label="FEE CURRENCY">
      <TokenLink :show-extra="true" :token-id="props.row.denominating_token_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="collector" label="COLLECTOR ACCOUNT">
      <AccountLink :account-id="props.row.collector_account_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="min" label="MIN">
      <PlainAmount :amount="props.row.minimum" none-label="None"/>
    </o-table-column>

    <o-table-column v-slot="props" field="max" label="MAX">
      <PlainAmount :amount="props.row.maximum" none-label="None"/>
    </o-table-column>

    <o-table-column v-slot="props" field="net" label="NET">
      {{ props.row.net_of_transfers ? "&check;" : "" }}
    </o-table-column>

  </o-table>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import AccountLink from "@/components/values/link/AccountLink.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {FractionAmount} from "@/schemas/MirrorNodeSchemas";
import StringValue from "@/components/values/StringValue.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer";

const props = defineProps({
  analyzer: {
    type: Object as PropType<TokenInfoAnalyzer>,
    required: true
  }
})

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

const fees = props.analyzer.fractionalFees

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
