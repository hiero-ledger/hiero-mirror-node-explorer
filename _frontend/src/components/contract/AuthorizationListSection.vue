// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="props.authorizationList.length > 0">
    <template #title>
      <span>Authorization List</span>
    </template>
    <template #content>
      <o-table
          :data="props.authorizationList"
          :hoverable="true"
          :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
          :striped="false"
          row-key="nonce"
      >
        <o-table-column v-slot="props" field="nonce" label="NONCE">
          <PlainAmount :amount="props.row.nonce"/>
        </o-table-column>

        <o-table-column v-slot="props" field="address" label="DELEGATED ADDRESS">
          <EVMAddress :address="props.row.address" :compact="true" enable-copy/>
        </o-table-column>

        <o-table-column v-slot="props" field="chain_id" label="CHAIN ID">
          <HexaValue :byte-string="props.row.chain_id" :copyable="false"/>
        </o-table-column>

        <o-table-column v-slot="props" field="r_value" label="R">
          <HexaValue :byte-string="toCompactString(props.row.r)"/>
        </o-table-column>

        <o-table-column v-slot="props" field="s_value" label="S">
          <HexaValue :byte-string="toCompactString(props.row.s)"/>
        </o-table-column>

        <o-table-column v-slot="props" field="parity" label="PARITY">
          {{ props.row.y_parity === '0x0' ? 'Even' : 'Odd' }}
        </o-table-column>
      </o-table>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {PropType} from "vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints.ts";
import EVMAddress from "@/components/values/EVMAddress.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import PlainAmount from "@/components/values/PlainAmount.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import {AuthorizationListItem} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  authorizationList: {
    type: Array as PropType<Array<AuthorizationListItem>>,
    required: true,
  },
})

const toCompactString = (initial: string, leading = 2, trailing = 6): string => {
  return "0x"
      + initial.slice(0, leading)
      + "…" + initial.slice(-trailing)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
