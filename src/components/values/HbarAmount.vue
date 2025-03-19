// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="isNone" style="display: inline-block">
    <span v-if="initialLoading"/>
    <span v-else class="h-is-low-contrast">None</span>
  </div>

  <div v-else-if="props.amount !== 0 || !props.hideZero" class="hbar-amount">
    <div>
      <span
          id="hbar-amount"
          class="h-is-numeric"
          :class="{ 'h-is-low-contrast': isGrey, 'debit-amount': isRed, 'credit-amount': isGreen }"
      >
        {{ formattedAmount }}
      </span>
      <span v-if="cryptoSymbol" v-html="cryptoSymbol"/>
      <span v-else style="color: var(--text-secondary)">ℏ</span>
    </div>
    <span v-if="props.showExtra" class="dollar-amount">
      <HbarExtra :hide-zero="props.hideZero" :tbar-amount="amount ?? 0" :timestamp="timestamp"/>
    </span>
  </div>

  <template v-else/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType, ref} from "vue";
import HbarExtra from "@/components/values/HbarExtra.vue";
import {initialLoadingKey} from "@/AppKeys";
import {CoreConfig} from "@/config/CoreConfig";

const props = defineProps({
  amount: {
    type: Number as PropType<number | null>,
    default: null
  },
  timestamp: {
    type: String,
    default: "0"
  },
  decimals: {
    type: Number,
    default: 8
  },
  showExtra: {
    type: Boolean,
    default: false
  },
  hideZero: {
    type: Boolean,
    default: false
  },
  colored: {
    type: Boolean,
    default: false
  }
})

const initialLoading = inject(initialLoadingKey, ref(false))

const coreConfig = CoreConfig.inject()
const cryptoSymbol = coreConfig.cryptoSymbol

const hbarAmount = computed(() => {
  return (props.amount ?? 0) / 100000000
})

const isNone = computed(() => props.amount == null)

const formattedAmount = computed(() => {
  const amountFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: props.decimals ?? 0,
    maximumFractionDigits: props.decimals ?? 8
  })
  return amountFormatter.format(hbarAmount.value)
})

const isGrey = computed(() => {
  return props.amount === 0
})

const isRed = computed(() => {
  return hbarAmount.value < 0 && props.colored
})

const isGreen = computed(() => {
  return hbarAmount.value > 0 && props.colored
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.hbar-amount {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (min-width: 768px) {
  div.hbar-amount {
    justify-content: flex-start;
  }
}

span.credit-amount {
  color: var(--text-success);
}

span.debit-amount {
  color: var(--text-error);
}

span.dollar-amount {
  color: var(--network-text-accent-color);
  margin-left: 4px;
}

</style>

