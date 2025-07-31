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

    <o-table-column v-slot="props" field="amount" label="PERCENTAGE FEE">
      <StringValue :string-value="makeAmount(props.row.amount)"/>
    </o-table-column>

    <o-table-column v-slot="props" field="collector" label="COLLECTOR ACCOUNT">
      <AccountLink :account-id="props.row.collector_account_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="fallbackAmount" label="FALLBACK FEE">
      <PlainAmount v-if="props.row.fallback_fee?.denominating_token_id"
                   :amount="props.row.fallback_fee?.amount" none-label="None"/>
      <HbarAmount v-else :amount="props.row.fallback_fee?.amount" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="fallbackToken" label="FEE CURRENCY">
      <TokenLink v-if="props.row.fallback_fee?.denominating_token_id"
                 :token-id="props.row.fallback_fee?.denominating_token_id" :show-extra="true"/>
      <div v-else-if="props.row.fallback_fee?.amount">{{ cryptoName }}</div>
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
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {FractionAmount} from "@/schemas/MirrorNodeSchemas";
import StringValue from "@/components/values/StringValue.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer";
import TokenLink from "@/components/values/link/TokenLink.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";

const props = defineProps({
  analyzer: {
    type: Object as PropType<TokenInfoAnalyzer>,
    required: true
  }
})

const cryptoName = CoreConfig.inject().cryptoName

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

const fees = props.analyzer.royaltyFees

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
