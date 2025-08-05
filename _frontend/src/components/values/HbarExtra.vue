// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <span v-if="props.tbarAmount !== 0 || !props.hideZero" class="h-is-numeric">
    {{ dollarAmount }}
  </span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import {HbarPriceCache} from "@/utils/cache/HbarPriceCache";

const props = defineProps({
  tbarAmount: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: String,
    default: "0"
  },
  hideZero: {
    type: Boolean,
    default: false
  },
})

const hbarAmount = computed(() => {
  return props.tbarAmount / 100000000
})
const dollarAmount = computed(() => {
  let result: string
  if (hbarPrice.value !== null) {
    const resolution = Math.pow(10, -fractionDigits)
    let usdAmount = hbarAmount.value * hbarPrice.value
    if (0 < usdAmount && usdAmount < +resolution) {
      usdAmount = resolution
    } else if (-resolution < usdAmount && usdAmount < 0) {
      usdAmount = -resolution
    }
    result = dollarFormatting.format(usdAmount)
  } else {
    result = ""
  }
  return result
})

const hbarPriceLookup = HbarPriceCache.instance.makeLookup(computed(() => props.timestamp ?? null))
onMounted(() => hbarPriceLookup.mount())
onBeforeUnmount(() => hbarPriceLookup.unmount())

const hbarPrice = computed(() => {
  const rate = hbarPriceLookup.entity.value?.current_rate
  return rate ? (rate.cent_equivalent / rate.hbar_equivalent / 100) : null
})

const fractionDigits = 5

const dollarFormatting = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: fractionDigits,
  maximumFractionDigits: fractionDigits
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>

