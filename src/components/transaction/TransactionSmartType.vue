// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <span v-if="props.transaction" class="h-has-pill">
    <span v-if="isEthereumTransaction && ethereumTransactionLabel !== null">ETH - {{ ethereumTransactionLabel }}</span>
    <span v-else>{{ makeTypeLabel(props.transaction?.name) }}</span>
  </span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType, ref} from "vue";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {TransactionTypeAnalyzer} from "@/utils/analyzer/TransactionTypeAnalyzer.ts";
import {makeTypeLabel} from "@/utils/TransactionTools.ts";

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction|null>,
    default: null
  }
})

const mounted = ref(false)
onMounted(() => mounted.value = true)
onBeforeUnmount(() => mounted.value = false)

const transactionTypeAnalyzer = new TransactionTypeAnalyzer(computed(() => props.transaction))
onMounted(() => transactionTypeAnalyzer.mount())
onBeforeUnmount(() => transactionTypeAnalyzer.unmount())

const isEthereumTransaction = transactionTypeAnalyzer.isEthereumTransaction
const ethereumTransactionLabel = transactionTypeAnalyzer.ethereumTransactionLabel

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
