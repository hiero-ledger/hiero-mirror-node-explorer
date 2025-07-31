// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

    <template #title>
      Custom Fees
    </template>

    <template #content>
      <Property id="customFeeCreatedAt" full-width>
        <template #name>Created at</template>
        <template #value>
          <TimestampValue :nano="true" :show-none="true" :timestamp="fees?.created_timestamp?.toString()"/>
        </template>
      </Property>

      <Property id="fixedFee" full-width>
        <template #name>Fixed Fees</template>
        <template v-if="hasFixedFees" #value>
          <FixedFeeTable :fees="fixedFees ?? null"/>
        </template>
        <template v-else #value>
          <span class="h-is-low-contrast">None</span>
        </template>
      </Property>

      <Property v-if="isFungible" id="fractionalFee" full-width>
        <template #name>Fractional Fees</template>
        <template v-if="hasFractionalFees" #value>
          <FractionalFeeTable :analyzer="analyzer"/>
        </template>
        <template v-else #value>
          <span class="h-is-low-contrast">None</span>
        </template>
      </Property>

      <Property v-else id="royalteeFee" full-width>
        <template #name>Percentage & Fallback Fees</template>
        <template v-if="hasRoyaltyFees" #value>
          <RoyaltyFeeTable :analyzer="analyzer"/>
        </template>
        <template v-else #value>
          <span class="h-is-low-contrast">None</span>
        </template>
      </Property>

    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import TimestampValue from "@/components/values/TimestampValue.vue";
import Property from "@/components/Property.vue";
import FixedFeeTable from "@/components/token/FixedFeeTable.vue";
import FractionalFeeTable from "@/components/token/FractionalFeeTable.vue";
import RoyaltyFeeTable from "@/components/token/RoyaltyFeeTable.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

const props = defineProps({
  analyzer: {
    type: Object as PropType<TokenInfoAnalyzer>,
    required: true
  }
})

const fees = props.analyzer.customFees
const hasFixedFees = props.analyzer.hasFixedFees
const fixedFees = props.analyzer.fixedFees
const hasFractionalFees = props.analyzer.hasFractionalFees
const hasRoyaltyFees = props.analyzer.hasRoyaltyFees
const isFungible = props.analyzer.isFungible

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>
</style>
