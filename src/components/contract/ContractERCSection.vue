// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="isErc20 || isErc721 || isErc1155" collapsible-key="contractERCProperties">
    <template #title>
      ERC Token
    </template>

    <template #content>

      <Property id="erc-type" :full-width="true">
        <template #name>Type</template>
        <template #value>
          <StringValue :string-value="type"/>
        </template>
      </Property>

      <Property id="erc-name" :full-width="true">
        <template #name>Name</template>
        <template #value>
          <StringValue :string-value="name"/>
        </template>
      </Property>

      <Property v-if="symbol" id="erc-symbol" :full-width="true">
        <template #name>Symbol</template>
        <template #value>
          <StringValue :string-value="symbol"/>
        </template>
      </Property>

      <Property v-if="decimals" id="erc-decimals" :full-width="true">
        <template #name>Decimals</template>
        <template #value>
          <PlainAmount :amount="Number(decimals)"/>
        </template>
      </Property>

      <Property v-if="holders" id="erc-holders" :full-width="true">
        <template #name># Holders</template>
        <template #value>
          <PlainAmount :amount="Number(holders)"/>
        </template>
      </Property>

      <Property v-if="displayTotalSupply" id="erc-total-supply" :full-width="true">
          <template #name>Total Supply</template>
          <template #value>
            <StringValue :string-value="displayTotalSupply"/>
          </template>
        </Property>

      <div class="h-sub-section mt-4">
        Top Holders
      </div>
      <ERCTokenHolderTable :token-address="contractAddress"/>

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
import ERCTokenHolderTable from "@/components/ercToken/ERCTokenHolderTable.vue";

const props = defineProps({
  ercAnalyzer: {
    type: Object as PropType<ERCAnalyzer | null>,
    default: null
  },
})

const contractAddress = computed(() => props.ercAnalyzer?.contractAddress.value ?? null)
const isErc20 = computed(() => props.ercAnalyzer?.isErc20.value ?? null)
const isErc721 = computed(() => props.ercAnalyzer?.isErc721.value ?? null)
const isErc1155 = computed(() => props.ercAnalyzer?.isErc1155.value ?? false)

const type = computed(() => props.ercAnalyzer?.type.value ?? null)
const name = computed(() => props.ercAnalyzer?.name.value ?? null)
const symbol = computed(() => props.ercAnalyzer?.symbol.value ?? null)
const holders = computed(() => props.ercAnalyzer?.holders.value ?? null)
const totalSupply = computed(() => props.ercAnalyzer?.totalSupply.value ?? null)
const decimals = computed(() => props.ercAnalyzer?.decimals.value ?? null)
const displayTotalSupply = computed(() =>
    totalSupply.value !== null && decimals.value !== null
        ? formatUnits(totalSupply.value, decimals.value)
        : totalSupply.value
)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>