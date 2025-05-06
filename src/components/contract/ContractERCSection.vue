// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="erc20 || erc721" collapsible-key="contractERCProperties">
    <template #title>
      ERC Token
    </template>

    <template #content>

      <!-- Properties common to ERC 20 and ERC 721 -->
      <Property id="erc-type" :full-width="true">
        <template #name>Type</template>
        <template #value>
          <StringValue :string-value="erc20 ? 'ERC 20' : 'ERC 721'"/>
        </template>
      </Property>
      <Property id="erc-name" :full-width="true">
        <template #name>Name</template>
        <template #value>
          <StringValue :string-value="ercName"/>
        </template>
      </Property>
      <Property v-if="ercSymbol" id="erc-symbol" :full-width="true">
        <template #name>Symbol</template>
        <template #value>
          <StringValue :string-value="ercSymbol"/>
        </template>
      </Property>

      <!-- Properties specific to ERC 20 -->
      <template v-if="erc20">
        <Property v-if="erc20.decimals" id="erc-decimals" :full-width="true">
          <template #name>Decimals</template>
          <template #value>
            <PlainAmount :amount="erc20.decimals"/>
          </template>
        </Property>
        <Property v-if="erc20TotalSupply" id="erc-total-supply" :full-width="true">
          <template #name>Total Supply</template>
          <template #value>
            <StringValue :string-value="erc20TotalSupply"/>
          </template>
        </Property>
      </template>

    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import StringValue from "@/components/values/StringValue.vue";
import Property from "@/components/Property.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import {formatUnits} from "ethers";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ERCAnalyzer} from "@/utils/analyzer/ERCAnalyzer.ts";

const props = defineProps({
  ercAnalyzer: {
    type: Object as PropType<ERCAnalyzer | null>,
    default: null
  },
})

const erc20 = computed(() => props.ercAnalyzer?.erc20.value ?? null)
const erc721 = computed(() => props.ercAnalyzer?.erc721.value ?? null)

const ercName = computed(() => erc20.value?.name ?? erc721.value?.name)
const ercSymbol = computed(() => erc20.value?.symbol ?? erc721.value?.symbol)
const erc20TotalSupply = computed(() =>
    erc20.value?.totalSupply && erc20.value?.decimals
        ? formatUnits(erc20.value.totalSupply, erc20.value.decimals)
        : null
)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>