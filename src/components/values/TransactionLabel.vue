// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <span style="display: inline-flex; gap: 8px; align-items: center;">
    <span class="h-is-numeric">{{ transactionText }}</span>
    <TriangleAlert v-if="errorFlagVisible" :size="18" class="h-text-error"/>
  </span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import {TransactionID} from "@/utils/TransactionID";
import {isSuccessfulResult} from "@/utils/TransactionTools";
import {TriangleAlert} from 'lucide-vue-next';

const props = defineProps({
  transactionId: String,
  result: String
})

const transactionText = computed(() => {
  return props.transactionId ? TransactionID.normalizeForDisplay(props.transactionId) : ""
})

const errorFlagVisible = computed(() => {
  return props.result && !isSuccessfulResult(props.result)
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
