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

import {computed, onBeforeUnmount, onMounted, PropType, watch, WatchHandle} from 'vue';
import StringValue from "@/components/values/StringValue.vue";
import Property from "@/components/Property.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import {ERC20InfoCache} from "@/utils/cache/ERC20InfoCache.ts";
import {formatUnits} from "ethers";
import {ERC721InfoCache} from "@/utils/cache/ERC721InfoCache.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

const props = defineProps({
  contractId: {
    type: String as PropType<string | null>,
    default: null
  },
})
const isErc20 = defineModel(
    "isErc20", {
      type: Boolean,
      required: true
    }
)
const isErc721 = defineModel(
    "isErc721", {
      type: Boolean,
      required: true
    }
)

const contractId = computed(() => props.contractId ?? null)
const ercName = computed(() => erc20.value?.name ?? erc721.value?.name)
const ercSymbol = computed(() => erc20.value?.symbol ?? erc721.value?.symbol)
const erc20TotalSupply = computed(() =>
    erc20.value?.totalSupply && erc20.value?.decimals
        ? formatUnits(erc20.value.totalSupply, erc20.value.decimals)
        : null
)

//
// ERC20
//

const erc20Lookup = ERC20InfoCache.instance.makeLookup(contractId)
const erc20 = erc20Lookup.entity
let watch20Handle: WatchHandle
onMounted(() => {
  erc20Lookup.mount()
  watch20Handle = watch(erc20, (value) => isErc20.value = value !== null)
})
onBeforeUnmount(() => {
  erc20Lookup.unmount()
  watch20Handle()
})

//
// ERC721
//
const erc721Lookup = ERC721InfoCache.instance.makeLookup(contractId)
const erc721 = erc721Lookup.entity
let watch721Handle: WatchHandle
onMounted(() => {
  erc721Lookup.mount()
  watch721Handle = watch(erc721, (value) => isErc721.value = value !== null)
})
onBeforeUnmount(() => {
  erc721Lookup.unmount()
  watch721Handle()
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>