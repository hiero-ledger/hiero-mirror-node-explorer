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

    <o-table-column v-slot="props" field="amount" label="FIXED FEE">
      <PlainAmount v-if="props.row.denominating_token_id" :amount="props.row.amount"/>
      <HbarAmount v-else :amount="props.row.amount" timestamp="0" :show-extra="true"/>
    </o-table-column>

    <o-table-column v-slot="props" field="currency" label="FEE CURRENCY">
      <TokenLink v-if="props.row.denominating_token_id"
                 :show-extra="true" :token-id="props.row.denominating_token_id"/>
      <div v-else>{{ cryptoName }}</div>
    </o-table-column>

    <o-table-column v-slot="props" field="collector" label="COLLECTOR ACCOUNT">
      <AccountLink :account-id="props.row.collector_account_id"/>
    </o-table-column>

  </o-table>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import HbarAmount from "@/components/values/HbarAmount.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import {FixedCustomFee, FixedFee} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  fees: {
    type: Object as PropType<FixedFee[] | FixedCustomFee[] | null>,
    required: true
  }
})

const cryptoName = CoreConfig.inject().cryptoName
const fees = computed(() => props.fees ?? [])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
